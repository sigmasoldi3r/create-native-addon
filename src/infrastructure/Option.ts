/**
 * Option represents a value that might be present, or might
 * not.
 *
 * This is used despite of having the null value in order to
 * represent a "missing" value, which could be also null as
 * a valid, present value.
 */
export default abstract class Option<T> {
  abstract get(): T
  getOr(elseValue: T): T {
    if (this.isPresent()) {
      return this.get()
    }
    return elseValue
  }
  abstract isPresent(): this is Some<T>
}

export class Some<T> extends Option<T> {
  constructor(private readonly value: T) {
    super()
  }
  override get(): T {
    return this.value
  }
  override isPresent() {
    return true
  }
}

export class None<T> extends Option<T> {
  override get(): T {
    throw new Error('Not present')
  }
  override isPresent() {
    return false
  }
}

export function some<T>(value: T): Option<T> {
  return new Some(value)
}

export function none<T = any>(): Option<T> {
  return new None()
}
