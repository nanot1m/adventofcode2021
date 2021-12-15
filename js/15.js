// @ts-check
import { PriorityQueue } from "./priority-queue.js"
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
  const map2d = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number))

  return findShortestPath(map2d)
}

/**
 *
 * @param {number[][]} map
 * @param {*} startPos
 * @param {*} endPos
 * @returns
 */
function findShortestPath(
  map,
  startPos = [0, 0],
  endPos = [map[0].length - 1, map.length - 1],
) {
  /** @type {PriorityQueue<[number, number, number]>} */
  const queue = new PriorityQueue((a, b) => a[2] - b[2])
  queue.push([startPos[0], startPos[1], 0])

  const visited = new Set()

  while (!queue.isEmpty()) {
    const [x1, y1, l] = queue.pop()
    if (y1 === endPos[1] && x1 === endPos[0]) return l

    for (const [x, y] of getAdjacents(x1, y1)) {
      if (map[y]?.[x] == null || visited.has(`${x},${y}`)) continue
      visited.add(`${x},${y}`)
      queue.push([x, y, l + map[y][x]])
    }
  }
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
 * @param {string} input
 */
function part2(input) {
  const map2d = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number))

  const largerMap2d = Array.from(Array(map2d.length * 5), (_, y) =>
    Array.from(Array(map2d[0].length * 5), (_, x) => {
      const origValue = map2d[y % map2d.length][x % map2d[0].length]
      const dx = Math.trunc(x / map2d[0].length)
      const dy = Math.trunc(y / map2d.length)
      return ((origValue - 1 + dx + dy) % 9) + 1
    }),
  )

  return findShortestPath(largerMap2d)
}
