// @ts-check

import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
})

/**
 * @param {string} input
 */
function part1(input) {
  const map2d = parseInput(input)
    .filter(isVerticalOrHorizontal)
    .reduce(fillMap, {})
  return Object.values(map2d).filter((v) => v > 1).length
}

/**
 * @param {string} input
 */
function part2(input) {
  const map2d = parseInput(input).reduce(fillMap, {})
  return Object.values(map2d).filter((v) => v > 1).length
}

/**
 * @typedef {[number, number, number, number]} LineSegment
 */

/**
 * @param {Record<string, number>} map2d
 * @param {LineSegment} line
 */
function fillMap(map2d, [x1, y1, x2, y2]) {
  const dx = Math.sign(x2 - x1)
  const dy = Math.sign(y2 - y1)

  let x = x1
  let y = y1
  while (x !== x2 + dx || y !== y2 + dy) {
    map2d[`${x},${y}`] = map2d[`${x},${y}`] || 0
    map2d[`${x},${y}`]++
    x += dx
    y += dy
  }

  return map2d
}

/**
 *
 * @param {string} input
 * @returns
 */
function parseInput(input) {
  return input.trim().split("\n").map(parseLine)
}

/**
 * Function parses line "973,543 -> 601,915"
 * and returns tupple [973, 543, 601, 915]
 *
 * @param {string} line
 *
 * @returns {LineSegment}
 */
function parseLine(line) {
  const [start, end] = line.trim().split(" -> ")
  const [x1, y1] = start.split(",").map(Number)
  const [x2, y2] = end.split(",").map(Number)
  return [x1, y1, x2, y2]
}

/**
 *
 * @param {LineSegment} line
 */
function isVerticalOrHorizontal(line) {
  return line[0] === line[2] || line[1] === line[3]
}
