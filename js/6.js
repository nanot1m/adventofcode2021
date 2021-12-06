// @ts-check

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
  return simulate(input, 80)
}

/**
 * @param {number[]} input
 */
function part2(input) {
  return simulate(input, 256)
}
/**
 *
 * @param {number[]} fishStates
 * @param {number} days
 * @returns {number}
 */
function simulate(fishStates, days) {
  const fishCountsByState = Array(9).fill(0)
  fishStates.forEach((fishState) => {
    fishCountsByState[fishState]++
  })
  while (days--) {
    const fishCount = fishCountsByState.shift()
    fishCountsByState[6] += fishCount
    fishCountsByState.push(fishCount)
  }
  return fishCountsByState.reduce((a, b) => a + b)
}
