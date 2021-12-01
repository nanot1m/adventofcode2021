// @ts-check
import { fetchFromAoC } from "./input.js"
import { zip } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    const xs = input.split("\n").map((x) => parseInt(x, 10))
    return [() => part1(xs), () => part2(xs)]
  },
})

/**
 * @param {number[]} xs
 */
function part1(xs) {
  return zip(xs, xs.slice(1))
    .map(([a, b]) => (a < b ? 1 : 0))
    .reduce((a, b) => a + b, 0)
}

/**
 * @param {number[]} xs
 */
function part2(xs) {
  return zip(xs, xs.slice(3))
    .map(([a, b]) => (a < b ? 1 : 0))
    .reduce((a, b) => a + b, 0)
}
