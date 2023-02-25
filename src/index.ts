/**
 * This is a blazingly fast reimplementation of the {@link Error} class.
 * In most cases, you don't need the call stack of an {@link Error}.
 * This implementation is a lot faster than the original {@link Error} class because the collection of the call stack is extremely expensive and {@link Panic} doesn't collect the call stack.
 *
 * | Name        | Ops/sec     | Relative margin of error |
 * | ----------- | ----------- | ------------------------ |
 * | new Error() | 231,460     | ±8.64%                   |
 * | new Panic() | 360,287,200 | ±0.92%                   |
 */
export class Panic implements Error {
    public readonly name
    public readonly message: string
    /**
     * Whether to capture the call stack or not.
     * This is `false` by default because it's expensive.
     * If you want to capture the call stack, set this to `true`.
     * This is a static property, so it's shared between all instances of {@link Panic}.
     *
     * If you want to capture the call stack for a single instance, you can use the second parameter of the {@link panic} function.
     * ```TypeScript
     * panic("message", true)
     * ```
     */
    public static captureStackTrace = false
    public readonly stack: string

    public constructor(message: string) {
        this.message = message
        this.name = "Panic"

        if (Panic.captureStackTrace === true) {
            Error.captureStackTrace(this)
        }

        this.stack ||= `${this.name}: ${this.message}`
    }

    public toString(): string {
        return `${this.name}: ${this.message}`
    }
}

/**
 * For performance reasons, you should use this function instead of `throw new Error()`.
 *
 * @throws {@link Panic}
 *
 * @param message The message of the {@link Panic}.
 *
 * | Name              | Ops/sec   | Relative margin of error |
 * | ----------------- | --------- | ------------------------ |
 * | throw new Error() | 139,958   | ±0.38%                   |
 * | panic()           | 3,247,902 | ±0.29%                   |
 */
export const panic = (message: string, captureStackTrace = false) => {
    const p = new Panic(message)

    if (captureStackTrace === true && Panic.captureStackTrace === false) {
        Error.captureStackTrace(p)
    }

    // eslint-disable-next-line no-restricted-syntax
    throw p
}
