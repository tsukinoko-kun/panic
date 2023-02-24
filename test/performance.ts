/* eslint-disable max-lines-per-function */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */

const Benchmark = require("benchmark")
const { Panic, panic } = require("..")

/**
 * @param {string} title
 * @param  {...Array<[String, ()=>void]>} tests
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
            const result = this.map((test) => [
                test.name,
                test.hz.toLocaleString("en", { maximumFractionDigits: 0 }),
                `±${test.stats.rme.toFixed(2)}%`,
            ])
            const header = ["Name", "Ops/sec", "Relative margin of error"]
            console.log(markdownTable([header, ...result]))
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
        "Get call stack",
        [
            "new Error().stack",
            function() {
                new Error("error message").stack
            }
        ],
        [
            "new Panic().stack",
            function() {
                new Panic("error message").stack
            }
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
})()
