// @ts-check

import { range } from "./itertools.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

/** @typedef {ReturnType<typeof parse>} Map2d */

/**
 * @param {string} input
 */
function parse(input) {
  const map = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number))
  return map
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns
 */
function getAdjacents(x, y) {
  return [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
    [x + 1, y + 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x - 1, y - 1],
  ]
}

/**
 * @param {Map2d} map2d
 */
function step(map2d) {
  const height = map2d.length
  const width = map2d[0].length
  const flashed = new Set()

  function process(/** @type {number} */ x, /** @type {number} */ y) {
    if (flashed.has(`${x},${y}`)) return

    if (map2d[y][x] < 9) {
      map2d[y][x] += 1
      return
    }

    map2d[y][x] = 0
    flashed.add(`${x},${y}`)

    getAdjacents(x, y)
      .filter(([x, y]) => map2d[y]?.[x] != null)
      .forEach(([x, y]) => process(x, y))
  }

  for (const y of range(0, height)) {
    for (const x of range(0, width)) {
      process(x, y)
    }
  }

  return flashed.size
}

/**
 * @param {string} input
 */
function part1(input) {
  const map2d = parse(input)
  let flashes = 0
  for (const _ of range(0, 100)) {
    flashes += step(map2d)
  }
  return flashes
}

/**
 * @param {string} input
 */
function part2(input) {
  const map2d = parse(input)
  for (let n of range(0, Infinity)) {
    if (step(map2d) === 100) return n
  }
}
