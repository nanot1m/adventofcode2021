// @ts-check

import { range } from "./itertools.js"
import { readBlocks } from "./lib.js"
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
  const [tpl, rulesStr] = readBlocks(input.trim())
  const rules = rulesStr
    .split("\n")
    .map((line) => line.split(" -> "))
    .reduce((acc, [input, output]) => {
      acc[input] = output
      return acc
    }, {})

  let counts = {}
  for (let i = 0; i < tpl.length - 1; i++) {
    counts[tpl[i] + tpl[i + 1]] = (counts[tpl[i] + tpl[i + 1]] || 0) + 1
  }

  for (const _ of range(0, steps)) {
    let next = {}
    for (const key in counts) {
      next[key[0] + rules[key]] = (next[key[0] + rules[key]] || 0) + counts[key]
      next[rules[key] + key[1]] = (next[rules[key] + key[1]] || 0) + counts[key]
    }
    counts = next
  }

  const frequencies = { [tpl[0]]: 1, [tpl[tpl.length - 1]]: 1 }
  for (const key in counts) {
    frequencies[key[0]] = (frequencies[key[0]] || 0) + counts[key]
    frequencies[key[1]] = (frequencies[key[1]] || 0) + counts[key]
  }

  const freqValues = Object.values(frequencies)
  return (Math.max(...freqValues) - Math.min(...freqValues)) / 2
}
