const { Panic } = require("..")

test("name", async () => {
    expect(new Panic().name).toBe("Panic")
})

test("message", async () => {
    const msg = Math.random().toString(36).substring(2)
    expect(new Panic(msg).message).toBe(msg)
})

test("stack", async () => {
    expect(new Panic().stack).toBeTruthy()

    expect(new Panic().stack).toMatch(/Panic\.test\.js/)

    {
        const p = new Panic()

        expect(p.stack).toEqual(p.stack)
    }
})
