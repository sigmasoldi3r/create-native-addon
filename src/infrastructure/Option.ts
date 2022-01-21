/**
 * Option represents a value that might be present, or might
 * not.
 *
 * This is used despite of having the null value in order to
 * represent a "missing" value, which could be also null as
 * a valid, present value.
 */
export default abstract class Option<T> {
  /**
   * Gets the optional value, if present. Will throw if not.
   */
  abstract get(): T

  /**
   * Gets the value of this optional, if present. Else will
   * return the supplied value.
   */
  getOr(elseValue: T): T {
    if (this.isPresent()) {
      return this.get()
    }
    return elseValue
  }

  /**
   * Runs the function passing the unwrapped value, if the
   * value is present.
   */
  ifPresent(run: (value: T) => void) {
    if (this.isPresent()) {
      run(this.get())
    }
  }

  /**
   * Returns true if the value is present, can be used for
   * pattern matching.
   */
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
