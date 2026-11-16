import gsap from 'gsap';
import type { Theme } from './theme';
import { iconShapePath, iconShapePoints } from './iconShape';

interface Point {
  x: number;
  y: number;
}

interface IconPose {
  rays: { scale: number; opacity: number; rotation: number };
  rotation: number;
}

const POSE: Record<Theme, IconPose> = {
  light: { rays: { scale: 1, opacity: 1, rotation: 0 }, rotation: 0 },
  dark: { rays: { scale: 0.2, opacity: 0, rotation: -60 }, rotation: -25 },
};

export interface MorphOptions {
  duration: number;
  ease: string;
  timeScale: number;
  chromeDelay?: number;
  chromeFrom?: ChromeColors;
}

export interface ChromeColors {
  backgroundColor: string;
  borderColor: string;
  color: string;
}

/** Animates the toggle's masked crescent, eight sun rays, and button chrome. */
export class ThemeIcon {
  private readonly button: HTMLElement;
  private readonly icon: SVGSVGElement | null;
  private readonly body: SVGPathElement | null;
  private readonly rays: SVGLineElement[];
  private timeline: gsap.core.Timeline | null = null;
  private currentPoints: Point[];
  private readonly rayPoses: IconPose['rays'][];

  constructor(button: HTMLElement) {
    this.button = button;
    this.icon = button.querySelector('svg');
    this.body = button.querySelector('.theme-toggle__body');
    this.rays = Array.from(button.querySelectorAll<SVGLineElement>('.theme-toggle__rays line'));
    this.currentPoints = iconShapePoints('light');
    this.rayPoses = this.rays.map(() => ({ ...POSE.light.rays }));
  }

  kill(): void {
    this.timeline?.kill();
    this.timeline = null;
  }

  setTimeScale(scale: number): void {
    this.timeline?.timeScale(scale);
  }

  readChrome(): ChromeColors {
    const cs = getComputedStyle(this.button);
    return { backgroundColor: cs.backgroundColor, borderColor: cs.borderTopColor, color: cs.color };
  }

  set(theme: Theme): void {
    this.kill();
    const pose = POSE[theme];
    this.currentPoints = iconShapePoints(theme);
    this.body?.setAttribute('d', iconShapePath(this.currentPoints));
    this.rayPoses.forEach((ray, index) => {
      Object.assign(ray, pose.rays);
      this.updateRay(index);
    });
    if (this.icon) gsap.set(this.icon, { rotation: pose.rotation, transformOrigin: '50% 50%' });
    gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' });
  }

  morphTo(theme: Theme, opts: MorphOptions): void {
    this.kill();
    const pose = POSE[theme];
    const timeline = gsap.timeline({ defaults: { duration: opts.duration, ease: opts.ease } });

    const targetPoints = iconShapePoints(theme);
    if (this.body) {
      const progress = { value: 0 };
      const startPoints = this.currentPoints.map(({ x, y }) => ({ x, y }));
      timeline.to(progress, {
        value: 1,
        onUpdate: () => {
          this.currentPoints = startPoints.map((point, index) => ({
            x: point.x + (targetPoints[index]!.x - point.x) * progress.value,
            y: point.y + (targetPoints[index]!.y - point.y) * progress.value,
          }));
          this.body?.setAttribute('d', iconShapePath(this.currentPoints));
        },
        onComplete: () => {
          this.currentPoints = targetPoints;
          this.body?.setAttribute('d', iconShapePath(targetPoints));
        },
      }, 0);
    }
    this.rayPoses.forEach((ray, index) => {
      timeline.to(ray, {
        ...pose.rays,
        onUpdate: () => this.updateRay(index),
      }, opts.duration * 0.035 * index);
    });
    if (this.icon) timeline.to(this.icon, { rotation: pose.rotation, transformOrigin: '50% 50%' }, 0);

    if (opts.chromeFrom) {
      Object.assign(this.button.style, opts.chromeFrom);
      const delay = opts.chromeDelay ?? 0;
      const swap = Math.min(0.18, opts.duration * 0.15);
      timeline.to(
        this.button,
        {
          backgroundColor: () => this.targetChrome().backgroundColor,
          borderColor: () => this.targetChrome().borderColor,
          color: () => this.targetChrome().color,
          duration: swap,
          ease: 'power1.out',
          onComplete: () => gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' }),
        },
        delay,
      );
    } else {
      gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' });
    }

    timeline.timeScale(opts.timeScale);
    this.timeline = timeline;
  }

  private targetChrome(): ChromeColors {
    const saved = this.button.getAttribute('style') ?? '';
    this.button.style.removeProperty('background-color');
    this.button.style.removeProperty('border-color');
    this.button.style.removeProperty('color');
    const target = this.readChrome();
    this.button.setAttribute('style', saved);
    return target;
  }

  private updateRay(index: number): void {
    const ray = this.rays[index];
    const pose = this.rayPoses[index];
    if (!ray || !pose) return;
    ray.setAttribute(
      'transform',
      `translate(12 12) rotate(${pose.rotation}) scale(${pose.scale}) translate(-12 -12)`,
    );
    ray.setAttribute('opacity', String(pose.opacity));
  }
}
