import type { Theme } from './theme';

/**
 * Full-document snapshots of the page in a given theme.
 *
 * We capture the whole document (not just the viewport) so a snapshot stays valid
 * while the user scrolls; the shader picks the visible window using the live scroll
 * offset. The theme is applied to html2canvas' *cloned* document via `onclone`, so the
 * live page never flickers during pre-capture.
 */

export interface Snapshot {
  theme: Theme;
  canvas: HTMLCanvasElement;
  /** Texture pixels per CSS pixel. */
  scale: number;
  /** Layout this snapshot is valid for; see {@link layoutKey}. */
  key: string;
  ms: number;
}

const BACKGROUND: Record<Theme, string> = {
  light: '#f5f7fb',
  dark: '#080d18',
};

const MODERN_COLOR = /color\(srgb|oklab|oklch|\blab\(|\blch\(|color-mix\(/i;
const COLOR_PROPERTIES = [
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'box-shadow',
  'color',
  'text-decoration-color',
  'text-shadow',
  '-webkit-text-stroke-color',
];

const isCoarsePointer = (): boolean => window.matchMedia('(pointer: coarse)').matches;

/** Device-pixel ratio used for both the snapshots and the overlay canvas. */
export function renderScale(): number {
  const cap = isCoarsePointer() ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function documentSize(): { width: number; height: number } {
  const el = document.documentElement;
  return { width: el.clientWidth, height: Math.max(el.scrollHeight, el.clientHeight) };
}

/**
 * Identifies the layout a snapshot depends on. Viewport height is deliberately
 * excluded (mobile URL-bar show/hide changes it without reflowing the document).
 */
export function layoutKey(scale: number): string {
  const { width, height } = documentSize();
  return `${width}x${height}@${scale}`;
}

function legacyColors(value: string): string {
  return value.replace(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%)?)?\s*\)/gi,
    (_match, red: string, green: string, blue: string, alpha?: string, alphaPercent?: string) => {
      const channels = [red, green, blue].map((channel) =>
        Math.round(Math.max(0, Math.min(1, Number(channel))) * 255),
      );
      const opacity = alpha === undefined ? 1 : Number.parseFloat(alpha) / (alphaPercent ? 100 : 1);
      return opacity >= 1
        ? `rgb(${channels.join(', ')})`
        : `rgba(${channels.join(', ')}, ${Math.max(0, Math.min(1, opacity))})`;
    },
  );
}

function compatibleColors(
  value: string,
  context: CanvasRenderingContext2D,
  cache: Map<string, string>,
): string {
  const functions = /\b(?:oklab|oklch|lab|lch|color|color-mix)\(/gi;
  let result = '';
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = functions.exec(value))) {
    let depth = 1;
    let end = match.index + match[0].length;
    for (; end < value.length && depth > 0; end++) {
      if (value[end] === '(') depth++;
      else if (value[end] === ')') depth--;
    }
    if (depth !== 0) continue;

    const color = value.slice(match.index, end);
    if (!CSS.supports('color', color)) continue;

    let converted = cache.get(color);
    if (!converted) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      converted = `rgba(${red}, ${green}, ${blue}, ${alpha! / 255})`;
      cache.set(color, converted);
    }
    result += `${value.slice(cursor, match.index)}${converted}`;
    cursor = end;
    functions.lastIndex = end;
  }

  return cursor === 0 ? value : `${result}${value.slice(cursor)}`;
}

export async function capturePage(theme: Theme, scale: number, maxTextureSize: number): Promise<Snapshot> {
  const t0 = performance.now();
  const key = layoutKey(scale);
  const { width, height } = documentSize();

  // Never exceed what the GPU can hold; the shader handles scale != canvas DPR.
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  // Lazy-loaded: html2canvas is ~200 KB and only needed after first paint.
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme],
    x: 0,
    y: 0,
    width,
    height,
    scrollX: 0,
    scrollY: 0,
    // The clone iframe renders without a scrollbar, so give it the live page's
    // scrollbar-less width; otherwise centred content shifts by half a scrollbar.
    windowWidth: width,
    windowHeight: document.documentElement.clientHeight,
    logging: false,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.classList.remove('reveal-ready');
      doc.documentElement.classList.remove('theme-fade');
      const view = doc.defaultView;
      if (!view) return;
      const pseudoRules: string[] = [];
      const snapshotStyles = doc.createElement('style');
      snapshotStyles.textContent =
        '*,*::before,*::after{animation:none!important;transition:none!important}';
      doc.head.append(snapshotStyles);
      doc.documentElement.dataset.theme = theme;
      const colorCanvas = doc.createElement('canvas');
      colorCanvas.width = 1;
      colorCanvas.height = 1;
      const colorContext = colorCanvas.getContext('2d', { willReadFrequently: true });
      if (!colorContext) throw new Error('Canvas 2D is unavailable for snapshot color conversion');
      const colorCache = new Map<string, string>();
      doc.querySelectorAll('style').forEach((style) => {
        style.textContent = compatibleColors(
          legacyColors(style.textContent ?? ''),
          colorContext,
          colorCache,
        );
      });
      const elements: Array<HTMLElement | SVGElement> = [
        doc.documentElement,
        doc.body,
        ...doc.body.querySelectorAll<HTMLElement | SVGElement>('*'),
      ];

      elements.forEach((element, index) => {
        Array.from(element.attributes).forEach(({ name, value }) => {
          if (MODERN_COLOR.test(value)) {
            element.setAttribute(name, compatibleColors(legacyColors(value), colorContext, colorCache));
          }
        });

        const computed = view.getComputedStyle(element);
        for (const property of COLOR_PROPERTIES) {
          const value = computed.getPropertyValue(property);
          if (MODERN_COLOR.test(value)) {
            element.style.setProperty(
              property,
              compatibleColors(legacyColors(value), colorContext, colorCache),
              'important',
            );
          }
        }

        for (const pseudo of ['::before', '::after']) {
          const pseudoStyle = view.getComputedStyle(element, pseudo);
          const declarations = COLOR_PROPERTIES
            .map((property) => [property, pseudoStyle.getPropertyValue(property)] as const)
            .filter(([, value]) => MODERN_COLOR.test(value))
            .map(
              ([property, value]) =>
                `${property}:${compatibleColors(legacyColors(value), colorContext, colorCache)} !important`,
            );
          if (declarations.length === 0) continue;

          const targetId = `ink-snapshot-${index}`;
          element.setAttribute('data-ink-snapshot-target', targetId);
          pseudoRules.push(
            `[data-ink-snapshot-target="${targetId}"]${pseudo}{${declarations.join(';')}}`,
          );
        }
      });

      if (pseudoRules.length > 0) {
        const compatibility = doc.createElement('style');
        compatibility.textContent = pseudoRules.join('\n');
        doc.head.append(compatibility);
      }
      // The live toggle is drawn above the overlay, so leave a hole for it. `visibility`
      // (not data-html2canvas-ignore) keeps its box in the layout so the nav doesn't shift.
      doc.querySelectorAll<HTMLElement>('[data-ink-live]').forEach((el) => {
        el.style.visibility = 'hidden';
      });
    },
  });

  return { theme, canvas, scale: safeScale, key, ms: performance.now() - t0 };
}
