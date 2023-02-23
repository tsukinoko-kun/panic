const { Panic, panic } = require("..")

test("name", () => {
    expect(new Panic().name).toBe("Panic")
})

test("message", () => {
    const msg = Math.random().toString(36).substring(2)
    expect(new Panic(msg).message).toBe(msg)
})

test("stack", () => {
    expect(new Panic().stack).toBeTruthy()

    expect(new Panic().stack).toMatch(/Panic\.test\.js/)

    {
        const p = new Panic()

        expect(p.stack).toEqual(p.stack)
    }
})

test("panic function", () => {
    expect(() => panic("meep")).toThrow(Panic)
    expect(() => panic("meep")).toThrow("meep")
})
