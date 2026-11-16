import gsap from 'gsap';
import { capturePage, layoutKey, renderScale } from './capture';
import { inkParams } from './params';
import { InkRenderer, type InkFrame, type InkSource } from './renderer';
import { applyTheme, getTheme, otherTheme, type Theme } from './theme';
import { ThemeIcon } from './themeIcon';

export interface Point {
  x: number;
  y: number;
}

const EASE = 'power3.out';
const FADE_OUT = 0.15;
const RESIZE_DEBOUNCE_MS = 250;
/** CSS cross-fade used without WebGL2, with reduced motion, or before snapshots are ready. */
const CSS_FADE_S = 0.45;

/**
 * Spread shape over time. `growth`: base radius at progress 1 relative to the farthest
 * corner. `cleanupFrom`: fraction of the (linear) duration after which a uniform extra
 * reach slowly eats whatever the noise left behind, so the page is fully covered exactly
 * at the end. `cleanupReach`: that extra reach at t = 1, relative to the farthest corner.
 */
export const SPREAD = { growth: 0.7, cleanupFrom: 0.45, cleanupReach: 0.4, cleanupPow: 2 };

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Everything needed to reproduce a transition exactly ("replay last click"). */
export interface ClickRecord {
  point: Point;
  seed: InkFrame['seed'];
  from: Theme;
}

const REPLAY_HOLD_MS = 400;

type ActiveFrame = Omit<InkFrame, 'progress' | 'radius' | 'time' | 'cleanup'>;

interface PendingToggle {
  count: number;
  point?: Point;
  onThemeChange?: (theme: Theme) => void;
}

/**
 * Orchestrates the theme transition:
 *  1. keeps fresh snapshots of both themes on the GPU (pre-captured, re-captured on layout change)
 *  2. on toggle, covers the page with the "from" image, flips the live DOM underneath,
 *     spreads the ink, then fades the overlay away onto the already-flipped page
 *  3. if toggled mid-spread, freezes the frame on screen and spreads the next ink over it
 *  4. falls back to a CSS colour cross-fade when WebGL2 is unavailable or motion is reduced
 */
export class InkTransition {
  private readonly renderer: InkRenderer | null;
  private readonly toggleButton: HTMLButtonElement | null;
  private readonly icon: ThemeIcon | null;
  private readonly state = { progress: 0, time: 0 };
  private tween: gsap.core.Tween | null = null;
  private fade: gsap.core.Tween | null = null;
  private frame: ActiveFrame | null = null;
  private cssFadeTimer = 0;
  private replayTimer = 0;
  private last: ClickRecord | null = null;

  private captureGen = 0;
  private capturing = false;
  private captureQueued = false;
  private pendingToggle: PendingToggle | null = null;
  private resizeTimer = 0;
  private resizeObserver: ResizeObserver | null = null;
  private destroyed = false;

  private readonly handleResize = (): void => {
    if (this.frame) {
      this.cancel();
      this.icon?.set(getTheme());
    }
    this.resizeCanvas();
    this.scheduleCapture(RESIZE_DEBOUNCE_MS);
  };

  private readonly handleMotionChange = (): void => {
    if (reducedMotion.matches) {
      this.cancel();
      window.clearTimeout(this.cssFadeTimer);
      document.documentElement.classList.remove('theme-fade');
      document.documentElement.style.removeProperty('--theme-fade');
      this.icon?.set(getTheme());
      this.flushPendingToggle();
      return;
    }
    this.scheduleCapture(0);
  };

  constructor(canvas: HTMLCanvasElement, toggleButton: HTMLButtonElement | null, opts: { webgl?: boolean } = {}) {
    this.toggleButton = toggleButton;
    this.icon = toggleButton ? new ThemeIcon(toggleButton) : null;
    this.icon?.set(getTheme());

    this.renderer = opts.webgl === false ? null : InkRenderer.create(canvas);
    if (!this.renderer) {
      document.documentElement.dataset.ink = 'css';
      return;
    }
    document.documentElement.dataset.ink = 'webgl';

    this.resizeCanvas();
    this.renderer.watchContext(
      () => {
        this.cancel();
        this.flushPendingToggle();
      },
      () => this.scheduleCapture(0),
    );

    window.addEventListener('resize', this.handleResize);
    // Catches document-height changes that aren't window resizes (late fonts, images).
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.frame) {
          this.cancel();
          this.icon?.set(getTheme());
        }
        this.renderer?.resize(renderScale());
        this.scheduleCapture(RESIZE_DEBOUNCE_MS);
      });
      this.resizeObserver.observe(document.body);
    }
    // Snapshots are skipped under reduced motion; take them if the preference is lifted.
    reducedMotion.addEventListener('change', this.handleMotionChange);

    this.scheduleCapture(0);
    void document.fonts.ready.then(() => this.scheduleCapture(0));
  }

  get isWebGL(): boolean {
    return this.renderer !== null;
  }

  get isAnimating(): boolean {
    return this.frame !== null;
  }

  /** The most recent click, for "replay last click". */
  get lastClick(): ClickRecord | null {
    return this.last;
  }

  destroy(): void {
    this.destroyed = true;
    this.captureGen++;
    this.pendingToggle = null;
    window.clearTimeout(this.cssFadeTimer);
    window.clearTimeout(this.replayTimer);
    window.clearTimeout(this.resizeTimer);
    window.removeEventListener('resize', this.handleResize);
    reducedMotion.removeEventListener('change', this.handleMotionChange);
    this.resizeObserver?.disconnect();
    this.tween?.kill();
    this.fade?.kill();
    this.icon?.kill();
    this.renderer?.canvas.classList.remove('is-active');
    this.renderer?.dispose();
    this.frame = null;
    document.documentElement.classList.remove('theme-fade');
    document.documentElement.style.removeProperty('--theme-fade');
  }

  /**
   * Toggle the theme, spreading from `point` (viewport CSS px) or from the toggle button.
   * `seed` reproduces a previous spread exactly.
   */
  toggle(
    point?: Point,
    seed?: InkFrame['seed'],
    onThemeChange?: (theme: Theme) => void,
    waitForSnapshots = true,
  ): void {
    if (this.destroyed) return;
    window.clearTimeout(this.replayTimer);
    // The live DOM always holds the latest target, so this is right even mid-transition.
    const to = otherTheme(getTheme());
    const renderer = this.renderer;
    const scale = renderScale();
    const key = layoutKey(scale);
    const interrupting = this.frame !== null;

    const canAnimate =
      renderer !== null &&
      !renderer.isLost &&
      !reducedMotion.matches &&
      renderer.hasValid(to, key) &&
      (interrupting || renderer.hasValid(getTheme(), key));

    if (!canAnimate || !renderer) {
      if (
        waitForSnapshots &&
        renderer &&
        !renderer.isLost &&
        !reducedMotion.matches &&
        !interrupting
      ) {
        this.queueToggle(point, onThemeChange);
        this.scheduleCapture(0);
        return;
      }
      this.cancel();
      this.crossFade(to, onThemeChange);
      if (renderer && !reducedMotion.matches) this.scheduleCapture(0);
      return;
    }

    // Interrupted: freeze exactly what is on screen and spread the new ink over it.
    let from: InkSource = getTheme();
    if (interrupting) {
      this.tween?.kill();
      this.fade?.kill();
      this.tween = this.fade = null;
      renderer.resize(scale);
      const frozen = this.currentFrame();
      from = frozen && renderer.freeze(frozen) ? 'composite' : getTheme();
    }

    const center = point ?? this.toggleCenter();
    const maxDist = farthestCorner(center);
    const frameSeed = seed ?? randomSeed();
    this.last = { point: center, seed: frameSeed, from: otherTheme(to) };
    this.frame = { from, to, center, maxDist, seed: frameSeed };
    this.state.progress = 0;
    this.state.time = 0;

    const chromeFrom = this.icon?.readChrome();
    renderer.resize(scale);
    this.draw();
    // Same task: the overlay (showing "from") and the flipped DOM hit the screen together.
    gsap.set(renderer.canvas, { opacity: 1 });
    renderer.canvas.classList.add('is-active');
    applyTheme(to, this.toggleButton);
    onThemeChange?.(to);

    const duration = inkParams.duration;
    this.icon?.morphTo(to, {
      duration,
      ease: EASE,
      timeScale: inkParams.timeScale,
      chromeFrom,
      chromeDelay: this.inkArrival(center, maxDist, this.toggleCenter()) * duration,
    });

    this.tween = gsap.to(this.state, {
      progress: 1,
      duration,
      ease: EASE,
      onUpdate: () => {
        // Tween-local seconds: slow motion slows the drift too, so it looks identical.
        this.state.time = this.tween?.time() ?? 0;
        this.draw();
      },
      onComplete: () => this.finish(),
    });
    this.tween.timeScale(inkParams.timeScale);
  }

  /**
   * Re-run the last click: snap back to the theme it started from, hold briefly (a clean
   * first frame for the recording), then spread again with the same point and seed.
   */
  replay(): boolean {
    const last = this.last;
    if (!last) return false;
    window.clearTimeout(this.replayTimer);
    this.cancel();
    this.icon?.kill();
    if (getTheme() !== last.from) {
      applyTheme(last.from, this.toggleButton);
      this.icon?.set(last.from);
    }
    this.replayTimer = window.setTimeout(() => this.toggle(last.point, last.seed), REPLAY_HOLD_MS);
    return true;
  }

  /** Live playback rate (slow motion), applied to a running transition too. */
  setTimeScale(scale: number): void {
    inkParams.timeScale = scale;
    this.tween?.timeScale(scale);
    this.fade?.timeScale(scale);
    this.icon?.setTimeScale(scale);
  }

  private currentFrame(): InkFrame | null {
    if (!this.frame) return null;
    const { progress, time } = this.state;
    const { maxDist } = this.frame;
    const linear = Math.min(1, time / inkParams.duration);
    const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
    // Second term only acts in the last ~3% (≈40ms): a guarantee for unlucky seeds so the
    // final frame is exactly the "to" snapshot before the fade (measured residual is 0).
    const cleanup =
      ramp ** SPREAD.cleanupPow * maxDist * SPREAD.cleanupReach + Math.max(0, (linear - 0.97) / 0.03) * maxDist;
    return { ...this.frame, progress, time, radius: progress * maxDist * SPREAD.growth, cleanup };
  }

  private draw(): void {
    const frame = this.currentFrame();
    if (this.renderer && frame) this.renderer.draw(frame);
  }

  private resizeCanvas(): void {
    const canvas = this.renderer?.canvas;
    if (!canvas) return;
    canvas.style.width = `${document.documentElement.clientWidth}px`;
    canvas.style.height = `${document.documentElement.clientHeight}px`;
    this.renderer?.resize(renderScale());
  }

  private finish(): void {
    const canvas = this.renderer?.canvas;
    this.tween = null;
    if (!canvas) return;
    this.fade = gsap
      .to(canvas, { opacity: 0, duration: FADE_OUT, ease: 'none', onComplete: () => this.hide() })
      .timeScale(inkParams.timeScale);
  }

  private hide(): void {
    this.fade = null;
    this.frame = null;
    this.renderer?.canvas.classList.remove('is-active');
    if (this.captureQueued) this.scheduleCapture(0);
  }

  private cancel(): void {
    if (!this.frame) return;
    this.tween?.kill();
    this.fade?.kill();
    this.tween = null;
    this.hide();
  }

  /** Plain CSS colour transition when WebGL is unavailable, motion is reduced, or capture fails. */
  private crossFade(to: Theme, onThemeChange?: (theme: Theme) => void): void {
    const root = document.documentElement;
    const motion = !reducedMotion.matches;
    root.classList.add('theme-fade');
    root.style.setProperty('--theme-fade', `${CSS_FADE_S}s`);
    applyTheme(to, this.toggleButton);
    onThemeChange?.(to);
    if (motion) {
      this.icon?.morphTo(to, { duration: CSS_FADE_S * 1.6, ease: 'power2.inOut', timeScale: 1 });
    } else {
      this.icon?.set(to);
    }
    window.clearTimeout(this.cssFadeTimer);
    this.cssFadeTimer = window.setTimeout(() => {
      root.classList.remove('theme-fade');
      if (this.captureQueued) this.scheduleCapture(0);
    }, CSS_FADE_S * 1000 + 50);
  }

  /**
   * Fraction of the duration at which the base ink front reaches `target` (the eased
   * radius inverted; slightly early, since the noise lets the front lead).
   */
  private inkArrival(center: Point, maxDist: number, target: Point): number {
    const dist = Math.hypot(target.x - center.x, target.y - center.y);
    if (dist < 28) return 0;
    const p = Math.min(1, dist / (maxDist * SPREAD.growth * 1.15));
    // Inverse of power3.out, capped: the end-of-spread cleanup sweeps the last corners by ~85%.
    return Math.min(0.85, 1 - Math.cbrt(1 - p));
  }

  private toggleCenter(): Point {
    const r = this.toggleButton?.getBoundingClientRect();
    if (!r) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // ---------- Capture scheduling ----------

  private scheduleCapture(delay: number): void {
    if (this.destroyed) return;
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => void this.captureAll(), delay);
  }

  private queueToggle(point?: Point, onThemeChange?: (theme: Theme) => void): void {
    if (this.pendingToggle) {
      this.pendingToggle.count++;
      this.pendingToggle.point = point;
      if (onThemeChange) this.pendingToggle.onThemeChange = onThemeChange;
      return;
    }
    this.pendingToggle = { count: 1, point, onThemeChange };
  }

  private flushPendingToggle(): void {
    const pending = this.pendingToggle;
    this.pendingToggle = null;
    if (pending && pending.count % 2 === 1) {
      this.toggle(pending.point, undefined, pending.onThemeChange, false);
    }
  }

  private async captureAll(): Promise<void> {
    if (this.destroyed) return;
    const renderer = this.renderer;
    if (!renderer || reducedMotion.matches) return;
    if (renderer.isLost) {
      this.flushPendingToggle();
      return;
    }

    // Capturing blocks the main thread; never do it mid-animation (or mid CSS fade, which
    // would bake half-transitioned colours into the snapshot).
    if (this.capturing || this.frame || document.documentElement.classList.contains('theme-fade')) {
      this.captureQueued = true;
      return;
    }

    const scale = renderScale();
    const key = layoutKey(scale);
    const current = getTheme();
    const themes: Theme[] = [current, otherTheme(current)].filter((t) => !renderer.hasValid(t, key));
    this.captureQueued = false;
    if (themes.length === 0) {
      this.flushPendingToggle();
      return;
    }

    const gen = ++this.captureGen;
    this.capturing = true;
    try {
      for (const theme of themes) {
        const snap = await capturePage(theme, scale, renderer.maxTextureSize);
        if (gen !== this.captureGen) return;
        if (snap.key !== layoutKey(renderScale())) {
          // Layout changed while capturing; this snapshot is already stale.
          this.captureQueued = true;
          break;
        }
        renderer.upload(snap);
        if (import.meta.env.DEV) {
          console.debug(
            `[ink] captured ${theme} ${snap.canvas.width}×${snap.canvas.height} in ${snap.ms.toFixed(0)}ms`,
          );
        }
      }
    } catch (err) {
      console.error('[ink] capture failed', err);
    } finally {
      this.capturing = false;
    }
    if (this.captureQueued) this.scheduleCapture(RESIZE_DEBOUNCE_MS);
    else this.flushPendingToggle();
  }
}

function farthestCorner(p: Point): number {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return Math.max(Math.hypot(p.x, p.y), Math.hypot(w - p.x, p.y), Math.hypot(p.x, h - p.y), Math.hypot(w - p.x, h - p.y)) + 4;
}

function randomSeed(): InkFrame['seed'] {
  return { x: Math.random() * 64 - 32, y: Math.random() * 64 - 32, angle: Math.random() * Math.PI * 2 };
}
