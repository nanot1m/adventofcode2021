// @ts-check

import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

/**
 * @param {string} input
 */
function part1(input) {
  const lines = input.trim().split("\n")
  const scores = { ")": 3, "]": 57, "}": 1197, ">": 25137 }
  return lines
    .map(processLine)
    .filter((x) => !x.valid)
    .reduce((acc, { brace }) => acc + scores[brace], 0)
}

/**
 * @param {string} input
 */
function part2(input) {
  const lines = input.trim().split("\n")
  const scores = { "(": 1, "[": 2, "{": 3, "<": 4 }
  const results = lines
    .map(processLine)
    .filter((r) => r.valid)
    .map((r) => r.stack.reduceRight((acc, brace) => 5 * acc + scores[brace], 0))
    .sort((a, b) => a - b)
  return results[Math.floor(results.length / 2)]
}

const braces = { "{": "}", "[": "]", "(": ")", "<": ">" }

/**
 * @param {string} line
 * @returns
 */
function processLine(line) {
  const stack = []
  for (const brace of line) {
    if (brace in braces) {
      stack.push(brace)
    } else if (braces[stack.pop()] !== brace) {
      return { valid: false, brace }
    }
  }
  return { valid: true, stack }
}
