// @ts-check

import { Range } from "immutable"
import { range } from "./itertools.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    console.log(input)
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

/**
 * @param {string} input
 */
function part1(input) {
  return [...maxHeights(input)].reduce((a, b) => Math.max(a, b), 0)
}

/**
 * @param {string} input
 */
function part2(input) {
  return [...maxHeights(input)].length
}

/**
 * @param {string} input
 */
function* maxHeights(input) {
  const [xTargetStr, yTargetStr] = input
    .trim()
    .substring("target area: ".length)
    .split(", ")

  const [minX, maxX] = xTargetStr.substring(2).split("..").map(Number)
  const [minY, maxY] = yTargetStr.substring(2).split("..").map(Number)

  /**
   * @param {object} params
   * @param {{ x: number; y: number; }} params.pos
   * @param {{ x: number; y: number; }} params.velocity
   */
  function step({ pos: p, velocity: v }) {
    return {
      pos: { x: p.x + v.x, y: p.y + v.y },
      velocity: { x: v.x - Math.sign(v.x), y: v.y - 1 },
    }
  }

  /**
   * @param {{ x: number; y: number; }} pos
   */
  function posInRect(pos) {
    return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY
  }

  /**
   * @param {{ x: number; y: number; }} pos
   * @param {{ y: number; }} velocity
   */
  function posIsOutOfRect(pos, velocity) {
    if (velocity.y < 0) {
      return pos.y < minY
    }
    return pos.x > maxX
  }

  /**
   * @param {{ x: number; y: number; }} velocity
   */
  function simulate(velocity) {
    let maxHeight = 0
    let current = { pos: { x: 0, y: 0 }, velocity }
    while (!posInRect(current.pos) && !posIsOutOfRect(current.pos, velocity)) {
      current = step(current)
      maxHeight = Math.max(maxHeight, current.pos.y)
    }
    return { valid: posInRect(current.pos), maxHeight }
  }

  for (const x of range(0, 600)) {
    for (const y of range(-200, 200)) {
      const { valid, maxHeight } = simulate({ x, y })
      if (valid) {
        yield maxHeight
      }
    }
  }
}
