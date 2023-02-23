import { Panic, panic } from ".."

test("name", () => {
    expect(new Panic("message").name).toBe("Panic")
})

test("message", () => {
    const msg = Math.random().toString(36).substring(2)
    expect(new Panic(msg).message).toBe(msg)
})

test("stack", () => {
    expect(new Panic("message").stack).toBeTruthy()

    expect(new Panic("message").stack).toMatch(/Panic\.test\.ts/)

    {
        const p = new Panic("message")

        expect(p.stack).toEqual(p.stack)
    }
})

test("panic function", () => {
    expect(() => panic("meep")).toThrow(Panic)
    expect(() => panic("meep")).toThrow("meep")
})
