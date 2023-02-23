/**
 * This is a blazingly fast reimplementation of the `Error` class.
 * In most cases, you don't need the call stack of an `Error`.
 * This implementation is a lot faster than the original `Error` class because the collection of the call stack is extremely expensive and `Panic` only collects the call stack when you access its `stack` property.
 *
 * | Name        | Ops/sec     | Relative margin of error |
 * | ----------- | ----------- | ------------------------ |
 * | new Error() | 231,460     | ±8.64%                   |
 * | new Panic() | 360,287,200 | ±0.92%                   |
 */
export class Panic implements Error {
    /** @internal */
    protected _stack: string | undefined = undefined
    public readonly name = "Panic"
    public readonly message: string

    public constructor(message: string) {
        this.message = message
    }

    public get stack(): string {
        if (typeof this._stack == "string") {
            return this._stack
        }

        const fullStack = new Error().stack
        if (!fullStack) {
            return (this._stack = "")
        }
        const i = fullStack.indexOf("\n", 9)
        return (this._stack =
            "Panic: " + this.message + fullStack.substring(i))
    }
}

/**
 *
 * @param message The message of the panic.
 *
 * | Name              | Ops/sec   | Relative margin of error |
 * | ----------------- | --------- | ------------------------ |
 * | throw new Error() | 139,958   | ±0.38%                   |
 * | panic()           | 3,247,902 | ±0.29%                   |
 */
export const panic = (message: string) => {
    // eslint-disable-next-line no-restricted-syntax
    throw new Panic(message)
}
