// @ts-check

import { solution } from "./solution.js"

/**
 * @typedef {'forward' | 'up' | 'down'} Direction
 */

solution({
  solve(input) {
    /**
     * @param {string} dir
     * @returns {asserts dir is Direction}
     */
    function assertDir(dir) {
      if (!["forward", "up", "down"].includes(dir))
        throw new Error(`Invalid direction: ${dir}`)
    }

    const commands = input
      .split("\n")
      .map((line) => line.split(" "))
      .map(([dir, value]) => {
        assertDir(dir)
        return ({ dir, value: Number(value) })
      })
    return [() => part1(commands), () => part2(commands)]
  },
})

/**
 * @param {Array<{dir: Direction, value: number}>} input
 */
function part1(input) {
  const { x, y } = input.reduce(
    (acc, { dir, value }) => {
      if (dir === "forward") acc.x += value
      if (dir === "up") acc.y -= value
      if (dir === "down") acc.y += value
      return acc
    },
    { x: 0, y: 0 },
  )
  return x * y
}

/**
 * @param {Array<{dir: Direction, value: number}>} input
 */
function part2(input) {
  const { x, y } = input.reduce(
    (acc, { dir, value }) => {
      if (dir === "forward") {
        acc.x += value
        acc.y += acc.aim * value
      }
      if (dir === "up") acc.aim -= value
      if (dir === "down") acc.aim += value
      return acc
    },
    { x: 0, y: 0, aim: 0 },
  )
  return x * y
}
