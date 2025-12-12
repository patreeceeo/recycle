// Type definitions for Result monad
export type Result<T, E> = {
  isOk(): this is { unwrap(): T; unwrapErr(): never };
  isFail(): this is { unwrap(): never; unwrapErr(): E };
  unwrap(): T;
  unwrapErr(): E;
  orElse(defaultValue: T): T;
  match<R>(handlers: { ok: (value: T) => R; fail: (error: E) => R }): R;
  map<U>(fn: (value: T) => U): Result<U, E>;
  guardType<U extends T>(typeGuard: (value: T) => value is U): Result<U, E>;
};

// Module declaration for the result.js file
declare module './result.js' {
  export { Result, ok, okIf, okIfDefined, fail };
}
