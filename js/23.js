// @ts-check

import { range } from "./itertools.js"
import { PriorityQueue } from "./priority-queue.js"
import { solution } from "./solution.js"

const MOVE_VALUES = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
}

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
  const finalState = getKey(
    parseInput(
      `
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########
`.trim(),
    ),
  )
  return dijkstra(parseInput(input), 2, finalState)
}

/**
 * @param {string} input
 */
function part2(input) {
  input = input
    .trim()
    .split("\n")
    .slice(0, 3)
    .concat(["  #D#C#B#A#", "  #D#B#A#C#"])
    .concat(input.trim().split("\n").slice(3))
    .join("\n")

  const finalState = getKey(
    parseInput(
      `
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########
  `.trim(),
    ),
  )
  return dijkstra(parseInput(input), 4, finalState)
}

function parseInput(input) {
  const map2d = input
    .trim()
    .split("\n")
    .map((line) => line.split(""))

  return map2d
}

/**
 * @param {number} x
 * @param {number} y
 * @param {string[][]} map2d
 */
const getDistanceMap = (x, y, map2d) => {
  /** @type {Array<Array<string | number>>} */
  const distanceMap = map2d.map((line) => [...line])
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, 0],
    [0, -1],
    [0, 1],
  ]
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} distance
   */
  const recur = (x, y, distance) => {
    deltas.forEach(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      if (distanceMap[ny][nx] === ".") {
        distanceMap[ny][nx] = distance + 1
        recur(nx, ny, distance + 1)
      }
    })
  }
  recur(x, y, 0)
  return distanceMap
}

const roomXs = new Set([3, 5, 7, 9])
const xToRoom = { 3: "A", 5: "B", 7: "C", 9: "D" }
/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string[][]} map2d
 */
const getAvailableMoves = (x, y, map2d, roomCapacity) => {
  const distanceMap = getDistanceMap(x, y, map2d)
  const moves = []

  const key = map2d[y][x]
  const inHallway = y === 1

  for (const y of range(1, map2d.length - 1)) {
    for (const x of range(1, map2d[0].length - 1)) {
      const distance = distanceMap[y][x]
      if (typeof distance !== "number") continue

      if (inHallway) {
        // It's only allowed to move from hallway to room
        if (y === 1) continue

        if (xToRoom[x] !== key) continue

        // Check if room is free or occupied with right keys
        const isFree = [...range(y, 2 + roomCapacity)].every(
          (y) => map2d[y][x] === ".",
        )

        // If room is free occupy last place
        if (isFree && y !== 2 + roomCapacity - 1) continue

        if (!isFree) {
          const validRoom = [...range(y + 1, 2 + roomCapacity)].every(
            (y) => map2d[y][x] === key,
          )
          if (!validRoom) continue
        }
      } else {
        // It's only allowed to move from room to hallway
        if (y !== 1) continue
        if (roomXs.has(x)) continue
      }
      moves.push({ x, y, distance })
    }
  }

  return moves
}

/**
 * @param {string[][]} map2d
 * @returns
 */
const getKey = (map2d) => map2d.map((line) => line.join("")).join("\n")

/**
 * @param {string[][]} map2d
 * @param {number} roomCapacity
 * @param {string} finalState
 * @returns
 */
function dijkstra(map2d, roomCapacity, finalState) {
  /** @type {PriorityQueue<{map2d: string[][], value: number}>} */
  const queue = new PriorityQueue((a, b) => a.value - b.value)
  const visited = new Set()

  queue.push({ map2d, value: 0 })

  while (!queue.isEmpty()) {
    const { map2d, value } = queue.pop()
    const key = getKey(map2d)
    if (visited.has(key)) continue
    visited.add(key)

    if (key === finalState) return value

    const amphipods = []
    for (const y of range(1, map2d.length - 1)) {
      for (const x of range(1, map2d[0].length - 1)) {
        if (map2d[y][x] in MOVE_VALUES) {
          amphipods.push({ x, y, name: map2d[y][x] })
        }
      }
    }

    for (const { x, y, name } of amphipods) {
      const moves = getAvailableMoves(x, y, map2d, roomCapacity)
      for (const move of moves) {
        const newMap2d = map2d.map((line) => [...line])
        newMap2d[y][x] = "."
        newMap2d[move.y][move.x] = name
        queue.push({
          map2d: newMap2d,
          value: value + MOVE_VALUES[name] * move.distance,
        })
      }
    }
  }

  return null
}
