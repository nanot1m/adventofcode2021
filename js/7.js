// @ts-check

import { map, range } from "./itertools.js"
import { sum } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    const numbers = input.trim().split(",").map(Number)
    return [() => part1(numbers), () => part2(numbers)]
  },
})

/**
 * @param {number[]} input
 */
function part1(input) {
  return solve(input, (d) => d)
}

/**
 * @param {number[]} input
 */
function part2(input) {
  return solve(input, (d) => ((1 + d) * d) / 2)
}

/**
 * @param {number[]} input
 * @param {(distance: number) => number} countFuel
 */
function solve(input, countFuel) {
  const min = input.reduce((a, b) => Math.min(a, b))
  const max = input.reduce((a, b) => Math.max(a, b))

  /** @param {number} i */
  const fuelToPos = (i) => sum(input.map((b) => countFuel(Math.abs(i - b))))
  return Math.min(...map(range(min, max + 1), fuelToPos))
}
