// @ts-check

import { range } from "./itertools.js"
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
    .map((line) => line.split(""))
  const width = map2d[0].length
  const height = map2d.length

  let curMap = map2d
  function moveRight() {
    let didMove = false
    const nextMap = curMap.map((line) => line.slice())
    for (const y of range(0, height)) {
      for (const x of range(0, width)) {
        const nextX = (x + 1) % width
        if (curMap[y][x] === ">" && curMap[y][nextX] === ".") {
          nextMap[y][x] = "."
          nextMap[y][nextX] = ">"
          didMove = true
        }
      }
    }
    curMap = nextMap
    return didMove
  }

  function moveDown() {
    let didMove = false
    const nextMap = curMap.map((line) => line.slice())
    for (const y of range(0, height)) {
      for (const x of range(0, width)) {
        const nextY = (y + 1) % height
        if (curMap[y][x] === "v" && curMap[nextY][x] === ".") {
          nextMap[y][x] = "."
          nextMap[nextY][x] = "v"
          didMove = true
        }
      }
    }
    curMap = nextMap
    return didMove
  }

  let result = 0
  let didMove = true
  while (didMove) {
    didMove = false
    if (moveRight()) {
      didMove = true
    }
    if (moveDown()) {
      didMove = true
    }
    result++
  }
  return result
}

/**
 * @param {string} input
 */
function part2(input) {
  return null
}
