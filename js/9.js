// @ts-check
import { range } from "./itertools.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    const map2d = parse(input)
    return [() => part1(map2d), () => part2(map2d)]
  },
})

/**
 * @param {string} input
 */
function parse(input) {
  const map = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number))
  return {
    height: map.length,
    width: map[0].length,
    get: (/** @type {number} */ x, /** @type {number} */ y) => map[y]?.[x],
  }
}

/** @typedef {ReturnType<typeof parse>} Map2d */

/**
 * @param {Map2d} map2d
 */
function part1(map2d) {
  return [...lowerMinimums(map2d)]
    .map(([x, y]) => map2d.get(x, y) + 1)
    .reduce((acc, value) => acc + value, 0)
}

/**
 * @param {Map2d} map2d
 */
function part2(map2d) {
  return [...lowerMinimums(map2d)]
    .map(([x, y]) => getBasinSize(x, y, map2d.get))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, value) => acc * value, 1)
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
  ]
}

/**
 * @param {Map2d} map2d
 */
function* lowerMinimums(map2d) {
  const { get, height, width } = map2d
  for (const y of range(0, height)) {
    for (const x of range(0, width)) {
      if (isLowerMinimum(x, y, get)) yield [x, y]
    }
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {Map2d['get']} get
 */
function isLowerMinimum(x, y, get) {
  return getAdjacents(x, y)
    .map(([x, y]) => get(x, y))
    .filter((v) => v != null)
    .every((v) => v > get(x, y))
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {Map2d['get']} get
 */
function getBasinSize(x, y, get) {
  const basin = []
  const queue = [[x, y]]

  const visited = new Set()

  while (queue.length > 0) {
    const [x0, y0] = queue.shift()
    if (visited.has(`${x0},${y0}`)) continue

    visited.add(`${x0},${y0}`)
    basin.push([x0, y0])

    for (const [x, y] of getAdjacents(x0, y0)) {
      if (get(x, y) !== 9 && get(x, y) > get(x0, y0)) queue.push([x, y])
    }
  }

  return basin.length
}
