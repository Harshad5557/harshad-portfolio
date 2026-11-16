import type { Theme } from './theme';

interface Point {
  x: number;
  y: number;
}

const STEPS = 96;
const SUN_RADIUS = 5;
const MOON_RADIUS = 8;
const CUTOUT_RADIUS = 9;
const MOON_CENTER = { x: 12, y: 12 };
const CUTOUT_CENTER = { x: 16.5, y: 8 };

function circlePoint(center: Point, radius: number, angle: number): Point {
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}

function sunPoints(): Point[] {
  return Array.from({ length: STEPS }, (_, index) =>
    circlePoint(MOON_CENTER, SUN_RADIUS, (index / STEPS) * Math.PI * 2),
  );
}

function moonPoints(): Point[] {
  const dx = CUTOUT_CENTER.x - MOON_CENTER.x;
  const dy = CUTOUT_CENTER.y - MOON_CENTER.y;
  const distance = Math.hypot(dx, dy);
  const outerAngle = Math.atan2(dy, dx);
  const outerHalfAngle = Math.acos(
    (distance ** 2 + MOON_RADIUS ** 2 - CUTOUT_RADIUS ** 2) /
      (2 * distance * MOON_RADIUS),
  );
  const innerAngle = Math.atan2(-dy, -dx);
  const innerHalfAngle = Math.acos(
    (distance ** 2 + CUTOUT_RADIUS ** 2 - MOON_RADIUS ** 2) /
      (2 * distance * CUTOUT_RADIUS),
  );
  const outerStart = outerAngle + outerHalfAngle;
  const outerSweep = Math.PI * 2 - outerHalfAngle * 2;
  const innerStart = innerAngle + innerHalfAngle;
  const innerSweep = innerHalfAngle * 2;
  const outerLength = MOON_RADIUS * outerSweep;
  const innerLength = CUTOUT_RADIUS * innerSweep;
  const outerSteps = Math.round(STEPS * outerLength / (outerLength + innerLength));
  const innerSteps = STEPS - outerSteps;

  const outer = Array.from({ length: outerSteps }, (_, index) =>
    circlePoint(MOON_CENTER, MOON_RADIUS, outerStart + outerSweep * index / outerSteps),
  );
  const inner = Array.from({ length: innerSteps }, (_, index) =>
    circlePoint(CUTOUT_CENTER, CUTOUT_RADIUS, innerStart - innerSweep * index / innerSteps),
  );
  return [...outer, ...inner];
}

const SHAPES: Record<Theme, Point[]> = {
  light: sunPoints(),
  dark: moonPoints(),
};

export function iconShapePoints(theme: Theme): Point[] {
  return SHAPES[theme].map(({ x, y }) => ({ x, y }));
}

export function iconShapePath(points: Point[]): string {
  return `${points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(3)},${y.toFixed(3)}`).join('')}Z`;
}
