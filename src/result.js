/**
 * Simple error throwing utility for Result monad
 */
function raise(message) {
  throw new Error(message);
}

/**
 * Represents a result that can be either a success (Ok) or a failure (Fail).
 *
 * This is a monadic type that provides a way to handle errors explicitly without
 * throwing exceptions. It's useful for operations that can fail in expected ways
 * where you want to provide clear error handling and type safety.
 */
class Result {
  /**
   * Type guard that checks if the result is a success (Ok).
   * When this returns true, the result is an Ok instance.
   */
  isOk() {
    return false;
  }

  /**
   * Type guard that checks if the result is a failure (Fail).
   * When this returns true, the result is a Fail instance.
   */
  isFail() {
    return false;
  }

  /**
   * Unwraps the success value.
   * @throws If called on a Fail result
   * @returns The success value
   */
  unwrap() {
    raise('Unwrap not implemented');
  }

  /**
   * Unwraps the error value.
   * @throws If called on an Ok result
   * @returns The error value
   */
  unwrapErr() {
    raise('UnwrapErr not implemented');
  }

  /**
   * Returns the success value if the result is Ok, otherwise returns the provided default value.
   * @param defaultValue - The value to return if the result is Fail
   * @returns The success value or the default value
   */
  orElse(defaultValue) {
    return defaultValue;
  }

  /**
   * Pattern matches on the result and applies the appropriate handler.
   * @param handlers - Object with ok and fail handler functions
   * @param handlers.ok - Function to handle success case
   * @param handlers.fail - Function to handle failure case
   * @returns The result of applying the appropriate handler
   */
  match(handlers) {
    return handlers.fail(this.unwrapErr());
  }

  /**
   * Maps the success value of an Ok result using the provided function.
   * If the result is Fail, the error value is passed through unchanged.
   * @param fn - Function to transform the success value
   * @returns Result<U, E> - Ok<U> with transformed value or Fail<E>
   */
  map(fn) {
    return this;
  }

  /**
   * Given a type guard function for the value, narrows the Result to Ok if the guard passes.
   * If the Result is a Fail, it remains Fail.
   * @param typeGuard - A function that checks if a value passes a condition
   * @returns Result<U, E> - Ok<U> if guard passed, otherwise Fail<E>
   */
  guardType(typeGuard) {
    return this;
  }
}

class Ok extends Result {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return `Ok(${this.value})`;
  }

  isOk() {
    return true;
  }

  isFail() {
    return false;
  }

  unwrap() {
    return this.value;
  }

  unwrapErr() {
    raise('Tried to unwrapErr an Ok result.');
  }

  orElse(defaultValue) {
    return this.value;
  }

  match(handlers) {
    return handlers.ok(this.value);
  }

  map(fn) {
    return new Ok(fn(this.value));
  }

  guardType(typeGuard) {
    if (typeGuard(this.value)) {
      return new Ok(this.value);
    } else {
      return new Fail(`Value ${this.value} did not pass type guard.`);
    }
  }
}

class Fail extends Result {
  constructor(error) {
    super();
    this.error = error;
  }

  toString() {
    return `Fail(${this.error})`;
  }

  isOk() {
    return false;
  }

  isFail() {
    return true;
  }

  unwrap() {
    raise(`Tried to unwrap a ${this}`);
  }

  unwrapErr() {
    return this.error;
  }

  orElse(defaultValue) {
    return defaultValue;
  }

  match(handlers) {
    return handlers.fail(this.error);
  }

  map(fn) {
    return new Fail(this.error);
  }

  guardType(typeGuard) {
    return new Fail(this.error);
  }
}

/**
 * Creates a successful Result containing the provided value.
 * @param {*} t - The success value to wrap in a Result
 * @returns {Result} - A Result representing success
 */
function ok(t) {
  return new Ok(t);
}

/**
 * Creates a Result based on a boolean condition.
 * If the condition is true, returns an Ok result with the provided success value.
 * If the condition is false, returns a Fail result with the provided error value.
 * @param {boolean} condition - The boolean condition to evaluate
 * @param {*} t - The success value to use if the condition is true
 * @param {*} e - The error value to use if the condition is false
 * @returns {Result} - Ok with t if condition is true, Fail with e if false
 */
function okIf(condition, t, e) {
  if (condition) {
    return ok(t);
  } else {
    return fail(e);
  }
}

/**
 * Creates a Result based on whether the provided value is defined.
 * @param {*} t - The value that may be undefined
 * @param {*} err - The error value to use if t is undefined
 * @returns {Result} - Ok if t is defined, Fail with err if undefined
 */
function okIfDefined(t, err) {
  return okIf(t !== undefined, t, err);
}

/**
 * Creates a failure Result containing the provided error.
 * @param {*} e - The error value to wrap in a Result
 * @returns {Result} - A Result representing failure
 */
function fail(e) {
  return new Fail(e);
}

module.exports = {
  Result,
  ok,
  okIf,
  okIfDefined,
  fail,
};
