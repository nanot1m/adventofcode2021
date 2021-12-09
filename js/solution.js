// @ts-check
import { performance } from "perf_hooks"
import { parse } from "path"
import { cachedFetchFromAoC, submitAndLog } from "./input.js"

const currentDay = parse(process.argv[1]).name

const WIDTH = 66

const drawLine = (/** @type {0 | 1 | 2} */ type) => {
  let [l, r] = type === 1 ? ["╭", "╮"] : type === 2 ? ["╰", "╯"] : ["├", "┤"]
  console.log(
    `${l}${Array(WIDTH - 2)
      .fill("─")
      .join("")}${r}`,
  )
}

const drawText = (/** @type {string} */ text) =>
  console.log(`│ ${text.padEnd(WIDTH - 4, " ")} │`)

/**
 * @param {Object} config
 * @param {(day: number) => string | Promise<string>} [config.input]
 * @param {(input: string) => Array<() => any>} config.solve
 * @param {Record<number, boolean>} [config.submit]
 * @param {(day: number, level: number, result: string) => void} [config.submitFn]
 */
export async function solution({
  input = cachedFetchFromAoC,
  solve,
  submit = { 1: false, 2: false },
  submitFn = submitAndLog,
}) {
  await Promise.resolve()
    .then(() => {
      drawLine(1)
      drawText("Advent of Code. Day " + currentDay)
      drawLine()
      return input(Number(currentDay))
    })
    .then(solve)
    .then(async (solutions) => {
      const results = []
      await solutions.reduce((acc, solution, idx) => {
        let now = 0
        return acc
          .then(() => {
            now = performance.now()
          })
          .then(solution)
          .then((result) => {
            results.push(result)
            drawText(`Part ${idx + 1}`)
            drawText("")
            drawText(`Result: ${result}`)
            drawText(`  Time: ${(performance.now() - now).toFixed(0)}ms`)
            drawLine(idx === solutions.length - 1 ? 2 : 0)
          })
      }, Promise.resolve())
      return results
    })
    .then((results) => {
      let promises = Promise.resolve()
      if (results[0] != null && submit[1]) {
        promises = promises.then(() => submitFn(+currentDay, 1, results[0]))
      }
      if (results[1] != null && submit[2]) {
        promises = promises
          .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
          .then(() => submitFn(+currentDay, 2, results[1]))
      }
      return promises
    })
    .catch(console.error)
}
