// @ts-check

import { solution } from "./solution.js"

solution({
  solve(input) {
    const lines = input
      .trim()
      .split("\n")
      .map((x) => x.trim())
    return [() => part1(lines), () => part2(lines)]
  },
})

/**
 * @param {string[]} input
 */
function part1(input) {
  const mostCommonBits = Array.from(input[0], (_, i) =>
    findMostCommonBitAtPos(input, i),
  )
  const leastCommonBits = mostCommonBits.map((bit) => (bit === 0 ? 1 : 0))
  return (
    parseInt(leastCommonBits.join(""), 2) * parseInt(mostCommonBits.join(""), 2)
  )
}

/**
 * @param {string[]} input
 */
function part2(input) {
  let prevLines = input
  for (let i = 0; i < input[0].length; i++) {
    if (prevLines.length === 1) {
      break
    }
    const bit = findMostCommonBitAtPos(prevLines, i)

    prevLines = prevLines.filter((line) => line[i] === bit.toString())
  }
  const oxygenGeneratorRate = prevLines[0]

  prevLines = input
  for (let i = 0; i < input[0].length; i++) {
    if (prevLines.length === 1) {
      break
    }
    const bit = findMostCommonBitAtPos(prevLines, i) === 1 ? 0 : 1
    prevLines = prevLines.filter((line) => line[i] === bit.toString())
  }
  const co2ScrubberRate = prevLines[0]

  return parseInt(co2ScrubberRate, 2) * parseInt(oxygenGeneratorRate, 2)
}

/**
 *
 * @param {string[]} lines
 * @param {number} pos
 * @returns
 */
function findMostCommonBitAtPos(lines, pos) {
  const sum = lines.reduce((acc, line) => acc + Number(line[pos]), 0)
  return sum >= lines.length / 2 ? 1 : 0
}
