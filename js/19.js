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
 * @param {string} input
 */
function part1(input) {
  const scanners = locateScanners(input)
  return new Set([...scanners.values()].flat().map((x) => x.join())).size
}

/**
 * @param {string} input
 */
function part2(input) {
  const scanners = locateScanners(input)
  const points = [...scanners.keys()].map((x) => x.split(",").map(Number))

  let max = 0
  for (const pointA of points) {
    for (const pointB of points) {
      if (pointA === pointB) continue

      const dist =
        Math.abs(pointA[0] - pointB[0]) +
        Math.abs(pointA[1] - pointB[1]) +
        Math.abs(pointA[2] - pointB[2])

      if (dist > max) max = dist
    }
  }

  return max
}

/**
 *
 * @param {string} input
 * @returns
 */
function locateScanners(input) {
  const scanners = readBlocks(input.trim()).map(parseScanner)
  const knownScanners = new Map([["0,0,0", scanners.shift()]])
  const unknownScanners = new Set(scanners)
  const queue = ["0,0,0"]

  while (queue.length > 0) {
    const knownScanner = knownScanners.get(queue.shift())
    for (const unknownScanner of unknownScanners) {
      const result = tryRotateAndLocate(knownScanner, unknownScanner)
      if (result) {
        const key = result.distance.join(",")
        knownScanners.set(key, result.scanner)
        queue.push(key)
        unknownScanners.delete(unknownScanner)
      }
    }
  }

  return knownScanners
}

/**
 * @param {[number, number, number][]} knownScanner
 * @param {[number, number, number][]} unknownScanner
 * @returns {{distance: [number, number, number], scanner: [number, number, number][]} | null}
 */
function tryRotateAndLocate(knownScanner, unknownScanner) {
  for (const rotatedScanner of scannerRotations(unknownScanner)) {
    const distance = tryGetScannerDistance(knownScanner, rotatedScanner)
    if (distance) {
      return {
        distance,
        scanner: rotatedScanner.map((b) => [
          b[0] + distance[0],
          b[1] + distance[1],
          b[2] + distance[2],
        ]),
      }
    }
  }
  return null
}

/**
 *
 * @param {[number, number, number][]} scannerA
 * @param {[number, number, number][]} scannerB
 * @returns {[number, number, number] | null}
 */
function tryGetScannerDistance(scannerA, scannerB) {
  const matchingCounts = {}
  for (const beaconA of scannerA) {
    for (const beaconB of scannerB) {
      const relative = /** @type {[number, number, number]} */ ([
        beaconA[0] - beaconB[0],
        beaconA[1] - beaconB[1],
        beaconA[2] - beaconB[2],
      ])
      const key = relative.join(",")
      matchingCounts[key] = (matchingCounts[key] || 0) + 1
      if (matchingCounts[key] === 12) {
        return relative
      }
    }
  }
  return null
}

/**
 *
 * @param {string} block
 * @returns {[number, number, number][]}
 */
function parseScanner(block) {
  return block
    .split("\n")
    .slice(1)
    .map(
      (line) =>
        /** @type {[number, number, number]} */ (line.split(",").map(Number)),
    )
}

/**
 * @type {Array<(arg: [number, number, number]) => [number, number, number]>}
 */
const rotations = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [-x, z, y],

  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [z, -y, x],

  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [y, x, -z],

  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [-x, y, -z],

  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [-y, -z, x],

  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-y, -x, -z],
]

/**
 *
 * @param {[number, number, number][]} scanner
 * @returns
 */
function* scannerRotations(scanner) {
  for (const rotation of rotations) {
    yield scanner.map(rotation)
  }
}
