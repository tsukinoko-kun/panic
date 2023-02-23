/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */

const Benchmark = require("benchmark")
const { Panic } = require("..")

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
        .run({ async: true })
}

console.log("## Performance tests\n")

testAsync(
    "Constructor",
    [
        "new Error()",
        function() {
            new Error()
        },
    ],
    [
        "new Panic()",
        function() {
            new Panic()
        },
    ]
)
    .then((suite) => {
        suite.on("complete", () => {
            testAsync(
                "Get call stack",
                [
                    "new Error().stack",
                    function() {
                        new Error().stack
                    }
                ],
                [
                    "new Panic().stack",
                    function() {
                        new Panic().stack
                    }
                ]
            )
        })
    })
