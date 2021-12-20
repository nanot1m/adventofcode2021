// @ts-check

import { iterate, last, range } from "./itertools.js"
import { readBlocks, sum } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => solve(input, 2), () => solve(input, 50)]
  },
  submit: { 1: false, 2: false },
})

function createImageMap() {
  const map = {}
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  return {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} value
     */
    set(x, y, value) {
      map[x] ??= {}
      map[x][y] = value

      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    },
    /**
     * @param {number} x
     * @param {number} y
     */
    get(x, y) {
      if (x < minX || x > maxX || y < minY || y > maxY) {
        return this.defaultValue
      }
      return map[x]?.[y] ?? 0
    },
    [Symbol.iterator]: function* () {
      for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
          yield /** @type {const} */ ([x, y, this.get(x, y)])
        }
      }
    },
    defaultValue: 0,
  }
}

/** @typedef {ReturnType<typeof createImageMap>} ImageMap */

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {ImageMap} imageMap
 * @param {string} algorithm
 * @returns
 */
const getPixelNextState = (x, y, imageMap, algorithm) => {
  let result = ""
  for (let yy = y - 1; yy <= y + 1; yy++) {
    for (let xx = x - 1; xx <= x + 1; xx++) {
      result += Number(imageMap.get(xx, yy))
    }
  }
  return algorithm[parseInt(result, 2)] === "#" ? 1 : 0
}

/**
 *
 * @param {ImageMap} imageMap
 * @param {string} algorithm
 * @returns
 */
function step(imageMap, algorithm) {
  const nextMap = createImageMap()
  for (const [x, y] of imageMap) {
    nextMap.set(x, y, getPixelNextState(x, y, imageMap, algorithm))
  }
  nextMap.defaultValue = imageMap.defaultValue === 1 ? 0 : 1
  return nextMap
}

/**
 *
 * @param {string} input
 * @param {number} steps
 * @returns
 */
function solve(input, steps) {
  const [algorithm, inputImage] = readBlocks(input.trim())
  const image = inputImage.split("\n")

  let imageMap = createImageMap()
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      imageMap.set(x, y, image[y][x] === "#" ? 1 : 0)
    }
  }

  for (const _ of range(0, steps)) {
    imageMap = step(imageMap, algorithm)
  }

  return sum([...imageMap].map(([, , value]) => value))
}
