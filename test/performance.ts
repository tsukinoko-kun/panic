/* eslint-disable max-lines-per-function */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */

const Benchmark = require("benchmark")
const { Panic, panic } = require("..")

/**
 * @param {string} title
 * @param {...Array<[String, ()=>void]>} tests
 */
const testAsync = async (title, ...tests) => {
    console.log(`### ${title}\n`)
    const { markdownTable } = await import("markdown-table")

    const suite = new Benchmark.Suite()

    for (const [name, fn] of tests) {
        suite.add(name, fn)
    }

    return await suite
        .on("complete", function() {
            const header = ["Name", "Ops/sec", "Relative margin of error"]
            const result = this.map((test) => [
                test.name,
                test.hz.toLocaleString("en", { maximumFractionDigits: 0 }),
                `±${test.stats.rme.toFixed(2)}%`,

            ])
            console.log(markdownTable([header, ...result], { align: ["l", "r", "r", "r"] }))
            console.log()
        })
        .run({ async: false, defer: true })
}

(async () => {
    console.log("## Performance tests\n")

    await testAsync(
        "Constructor",
        [
            "new Error()",
            function() {
                new Error("error message")
            },
        ],
        [
            "new Panic()",
            function() {
                new Panic("error message")
            },
        ]
    )

    await testAsync(
        "throw",
        [
            "throw new Error()",
            function() {
                try {
                    throw new Error("error message")
                }
                catch (e) {
                    return e.message
                }
            }
        ],
        [
            "panic()",
            function() {
                try {
                    panic("error message")
                }
                catch (e) {
                    return e.message
                }
            }
        ]
    )

    await testAsync(
        "throw with captureStackTrace enabled",
        [
            "throw new Error()",
            function() {
                try {
                    throw new Error("error message")
                }
                catch (e) {
                    return e.message
                }
            }
        ],
        [
            "panic()",
            function() {
                try {
                    panic("error message", true)
                }
                catch (e) {
                    return e.message
                }
            }
        ]
    )
})()
