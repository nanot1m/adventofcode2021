// @ts-check

import { readBlocks } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

/**
 *
 * @param {string} input
 * @returns {{coords: Array<[number, number]>, foldInstructions: Array<[string, number]>}}
 */
function parseInput(input) {
  const [coordsLines, foldInstructionsLines] = readBlocks(input.trim())
  const coords = coordsLines
    .split("\n")
    .map((line) => line.split(",").map(Number))
  const foldInstructions = foldInstructionsLines
    .split("\n")
    .map((line) => line.substring("fold along ".length).split("="))
    .map(([overCoord, value]) => [overCoord, Number(value)])
  // @ts-ignore
  return { coords, foldInstructions }
}

/**
 * @param {string} input
 */
function part1(input) {
  const { coords, foldInstructions } = parseInput(input)

  foldInstructions.slice(0, 1).forEach((f) => {
    fold(coords, f)
  })

  return coords.reduce((acc, coord) => acc.add(coord.join(",")), new Set()).size
}

/**
 * @param {string} input
 */
function part2(input) {
  const { coords, foldInstructions } = parseInput(input)

  foldInstructions.forEach((f) => {
    fold(coords, f)
  })

  const xSet = new Set()
  const ySet = new Set()
  const map = new Set()
  coords.forEach(([x, y]) => {
    map.add(`${x},${y}`)
    xSet.add(x)
    ySet.add(y)
  })
  const minX = Math.min(...xSet)
  const maxX = Math.max(...xSet)
  const minY = Math.min(...ySet)
  const maxY = Math.max(...ySet)

  let lines = "\n"
  for (let y = minY; y <= maxY; y++) {
    let line = ""
    for (let x = minX; x <= maxX; x++) {
      line += map.has(`${x},${y}`) ? "█" : "."
    }
    lines += line + "\n"
  }
  return lines
}

/**
 * @param {[number, number][]} coords
 * @param {[string, number]} foldInstruction
 */
function fold(coords, [overCoord, value]) {
  if (overCoord === "x") {
    for (const coord of coords) {
      if (coord[0] >= value) {
        coord[0] = value * 2 - coord[0]
      }
    }
  }
  if (overCoord === "y") {
    for (const coord of coords) {
      if (coord[1] >= value) {
        coord[1] = value * 2 - coord[1]
      }
    }
  }
}
