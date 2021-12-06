// @ts-check

import { first, iterate, skip } from "./itertools.js"
import { inc, rotate, sum, update } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    const fishes = input.split(",").map(Number)
    return [() => part1(fishes), () => part2(fishes)]
  },
})

/**
 * @param {number[]} input
 */
function part1(input) {
  return solve(input, 80)
}

/**
 * @param {number[]} input
 */
function part2(input) {
  return solve(input, 256)
}

/**
 *
 * @param {number[]} states
 * @param {number} days
 * @returns {number}
 */
function solve(states, days) {
  const xs = states.reduce(
    (acc, state) => update(acc, state, inc),
    Array.from(Array(9), () => 0),
  )

  /** @param {number[]} $ */
  const step = ($) => update(rotate($, 1), 6, (x) => x + first($))
  return sum(first(skip(iterate(xs, step), days)))
}
