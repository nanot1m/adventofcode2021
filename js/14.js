// @ts-check
import { List, Map, Range } from "immutable"
import { inc, readBlocks } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => solve(input, 10), () => solve(input, 40)]
  },
  submit: { 1: false, 2: false },
})

/**
 *
 * @param {string} input
 * @param {number} steps
 * @returns
 */
function solve(input, steps) {
  const [templateStr, rulesStr] = readBlocks(input.trim())

  /** @type {Map<string, string>} */
  const rules = rulesStr
    .split("\n")
    .map((line) => line.split(" -> "))
    .reduce((acc, [from, to]) => acc.set(from, to), Map())
  const template = List(templateStr)

  /** @type {Map<string, number>} */
  const initCounts = template
    .zipWith((a, b) => `${a}${b}`, template.skip(1))
    .reduce((acc, key) => acc.update(key, 0, inc), Map())

  const initFrequencies = Map([
    [template.first(), 1],
    [template.last(), 1],
  ])

  const counts = Range()
    .take(steps)
    .reduce((counts) => step(counts, rules), initCounts)

  const frequencies = counts.reduce((frequencies, value, key) => {
    return frequencies
      .update(key[0], 0, (c) => c + value)
      .update(key[1], 0, (c) => c + value)
  }, initFrequencies)

  const freqValues = frequencies.valueSeq()
  return (freqValues.max() - freqValues.min()) / 2
}

/**
 *
 * @param {Map<string, number>} counts
 * @param {Map<string, string>} rules
 */
function step(counts, rules) {
  return counts.reduce((nextCounts, value, key) => {
    return nextCounts
      .update(key[0] + rules.get(key), 0, (c) => c + value)
      .update(rules.get(key) + key[1], 0, (c) => c + value)
  }, Map())
}
