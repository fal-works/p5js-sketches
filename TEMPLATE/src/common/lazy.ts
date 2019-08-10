/**
 * -----------------------------------------------------------------------------
 * @module common/lazy
 */

export class Lazy<T> {
  public value: T | undefined = undefined;

  public constructor(readonly factory: () => T) {}

  public get(): T {
    return this.value || (this.value = this.factory());
  }

  public clear(): Lazy<T> {
    this.value = undefined;
    return this;
  }
}

export const lazy = <T>(factory: () => T): Lazy<T> => new Lazy(factory);
