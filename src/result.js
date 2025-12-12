/**
 * Simple error throwing utility for Result monad
 * @param {string} message - Error message to throw
 * @returns {never} - Never returns, always throws
 */
function raise(message) {
  throw new Error(message);
}

/**
 * Represents a result that can be either a success (Ok) or a failure (Fail).
 * This is a monadic type that helps handle errors without exceptions.
 */
class Result {
  /**
   * Type guard that checks if the result is a success (Ok).
   * @returns {boolean} True if the result is Ok, false if Fail
   */
  isOk() {
    return false;
  }

  /**
   * Type guard that checks if the result is a failure (Fail).
   * @returns {boolean} True if the result is Fail, false if Ok
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
   * @param {*} defaultValue - The value to return if the result is Fail
   * @returns The success value or the default value
   */
  orElse(defaultValue) {
    return defaultValue;
  }

  /**
   * Pattern matches on the result and applies the appropriate handler.
   * @param {Object} handlers - Object with ok and fail handler functions
   * @param {Function} handlers.ok - Function called if result is Ok
   * @param {Function} handlers.fail - Function called if result is Fail
   * @returns The result of applying the appropriate handler
   */
  match(handlers) {
    return handlers.fail(this.unwrapErr());
  }

  /**
   * Maps the success value of an Ok result using the provided function.
   * If the result is Fail, the error value is passed through unchanged.
   * @param {Function} fn - Function to transform the success value
   * @returns A new Result with the transformed value
   */
  map(fn) {
    return this;
  }

  /**
   * Given a type guard function for the value, narrows the Result to Ok if the guard passes.
   * @param {Function} typeGuard - A function that checks if a value passes a condition
   * @returns A new Result with the narrowed type if the guard passes
   */
  guardType(typeGuard) {
    return this;
  }
}

/**
 * Ok class - represents a successful Result containing a value
 */
class Ok extends Result {
  /**
   * @param {*} value - The success value
   */
  constructor(value) {
    super();
    /** @private */
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

/**
 * Fail class - represents a failed Result containing an error
 */
class Fail extends Result {
  /**
   * @param {*} error - The error value
   */
  constructor(error) {
    super();
    /** @private */
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
 * @param {*} value - The success value to wrap in a Result
 * @returns An Ok Result containing the value
 */
function ok(value) {
  return new Ok(value);
}

/**
 * Creates a Result based on a boolean condition.
 * If the condition is true, returns an Ok result with the provided success value.
 * If the condition is false, returns a Fail result with the provided error value.
 * @param {boolean} condition - The boolean condition to evaluate
 * @param {*} successValue - The success value to use if the condition is true
 * @param {*} errorValue - The error value to use if the condition is false
 * @returns Ok with successValue if condition is true, Fail with errorValue if false
 */
function okIf(condition, successValue, errorValue) {
  if (condition) {
    return ok(successValue);
  } else {
    return fail(errorValue);
  }
}

/**
 * Creates a Result based on whether the provided value is defined.
 * @param {*} value - The value that may be undefined
 * @param {*} errorValue - The error value to use if value is undefined
 * @returns Ok if value is defined, Fail with errorValue if undefined
 */
function okIfDefined(value, errorValue) {
  return okIf(value !== undefined, value, errorValue);
}

/**
 * Creates a failure Result containing the provided error.
 * @param {*} error - The error value to wrap in a Result
 * @returns A Fail Result containing the error
 */
function fail(error) {
  return new Fail(error);
}

module.exports = {
  Result,
  ok,
  okIf,
  okIfDefined,
  fail,
};
