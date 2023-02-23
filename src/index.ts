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

export const panic = (message: string) => {
    // eslint-disable-next-line no-restricted-syntax
    throw new Panic(message)
}
