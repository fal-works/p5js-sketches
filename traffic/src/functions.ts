export function createGradationRectangle(
  p: p5,
  w: number,
  h: number,
  backgroundColor: p5.Color,
  fromColor: p5.Color,
  toColor: p5.Color,
  gradient: number = 1,
  interval: number = 1
): p5.Graphics {
  const g = p.createGraphics(w, h) as any;
  g.background(backgroundColor);
  g.strokeWeight(interval * 2);

  for (let y = 0; y < h; y += interval) {
    const lerpRatio = Math.pow(y / (h - 1), gradient);
    g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
    g.line(0, y, w - 1, y);
  }

  return g;
}

export interface ObjectPool<T> {
  array: T[];
  size: number;
}

export function createObjectPool<T>(
  instanceFactory: () => T,
  initialSize: number
): ObjectPool<T> {
  const array: T[] = [];
  for (let i = 0; i < initialSize; i++) array.push(instanceFactory());
  return {
    array: array,
    size: array.length
  };
}

export function useObject<T>(pool: ObjectPool<T>): T {
  const nextSize = pool.size - 1;
  pool.size = nextSize;
  return pool.array[nextSize];
}

export function recycleObject<T>(pool: ObjectPool<T>, usedObject: T): void {
  pool.array[pool.size++] = usedObject;
}
