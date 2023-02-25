import { Panic, panic } from ".."

test("name", () => {
    expect(new Panic("message").name)
        .toBe("Panic")
})

test("message", () => {
    const msg = Math.random()
        .toString(36)
        .substring(2)

    expect(new Panic(msg).message)
        .toBe(msg)
})

test("panic function", () => {
    expect(() => panic("meep"))
        .toThrow(Panic)
    expect(() => panic("meep"))
        .toThrow("meep")
    expect(() => panic("meep", true))
        .toThrow(Panic)
    expect(() => panic("meep", true))
        .toThrow("meep")

    {
        let caught = false
        try {
            panic("with stack", true)
        }
        catch (e) {
            expect((e as Panic).stack)
                .toMatch(/Panic\.test\.ts/)
            caught = true
        }
        expect(caught).toBe(true)
    }

    {
        let caught = false
        try {
            panic("no stack")
        }
        catch (e) {
            expect((e as Panic).stack)
                .toBe("Panic: no stack")

            caught = true
        }
        expect(caught).toBe(true)
    }
})

test("toString", () => {
    expect(new Panic("message").toString())
        .toBe("Panic: message")
})

test("stack", () => {
    Panic.captureStackTrace = true

    expect(new Panic("message").stack)
        .toBeTruthy()

    expect(new Panic("message").stack)
        .toMatch(/Panic\.test\.ts/)

    {
        const p = new Panic("message")

        expect(p.stack).toEqual(p.stack)
    }

    Panic.captureStackTrace = false
})
