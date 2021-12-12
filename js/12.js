// @ts-check
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
})

/**
 * @param {string} input
 * @returns {Record<string, string[]>}
 */
function parse(input) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split("-"))
    .reduce((map, [a, b]) => {
      if (!map[a]) map[a] = []
      if (b !== "start") map[a].push(b)
      if (!map[b]) map[b] = []
      if (a !== "start") map[b].push(a)
      return map
    }, {})
}

/**
 * @param {string} input
 */
function part1(input) {
  const map = parse(input)
  return lookup(map, "start", new Set(), true)
}

/**
 * @param {string} input
 */
function part2(input) {
  const map = parse(input)
  return lookup(map, "start", new Set(), false)
}

/**
 * @param {Record<string, string[]>} map
 * @param {string} current
 * @param {Set<string>} visited
 * @param {boolean} reused
 * @returns
 */
function lookup(map, current, visited, reused) {
  let result = 0
  for (const next of map[current]) {
    if (next === "end") {
      result += 1
    } else if (next.toUpperCase() === next) {
      result += lookup(map, next, visited, reused)
    } else if (visited.has(next)) {
      if (!reused) {
        result += lookup(map, next, visited, true)
      }
    } else {
      visited.add(next)
      result += lookup(map, next, visited, reused)
      visited.delete(next)
    }
  }
  return result
}
