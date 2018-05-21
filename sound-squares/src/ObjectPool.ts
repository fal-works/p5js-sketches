export default class ObjectPool<T> {
  protected pooledObjects: T[] = [];
  protected index: number;

  public get length(): number {
    return this.index;
  }

  constructor(factory: () => T, capacity: number = 1024) {
    for (let i = 0; i < capacity; i += 1) {
      this.pooledObjects.push(factory());
    }
    this.index = capacity;
  }

  get(): T {
    this.index -= 1;

    return this.pooledObjects[this.index];
  }

  put(object: T): void {
    this.pooledObjects[this.index] = object;
    this.index += 1;
  }
}
