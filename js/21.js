// @ts-check

import { List, Range, Seq } from "immutable"
import { range } from "./itertools.js"
import { add, sum, zip } from "./lib.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    console.log(input)
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

function cached(fn) {
  /** @type {Record<string, any>} */
  const cache = {}
  return (...args) => {
    const key = args.join()
    if (key in cache) {
      return cache[key]
    }
    const result = fn(...args)
    cache[key] = result
    return result
  }
}

/**
 * @param {string} input
 */
function part1(input) {
  const players = input
    .trim()
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map(Number)
    .map((x) => ({ pos: x, score: 0 }))

  let dice = 1
  let count = 0
  while (true) {
    let player = players.shift()
    let rolls = 0
    for (let _ of range(0, 3)) {
      rolls += dice
      count++
      dice = (dice % 100) + 1
    }
    player.pos = ((player.pos + rolls - 1) % 10) + 1
    player.score += player.pos
    if (player.score >= 1000) {
      return players.shift().score * count
    }
    players.push(player)
  }
}

const solve = cached((p1, s1, p2, s2) =>
  s2 >= 21
    ? List.of(0, 1)
    : Range(3, 10)
        .zip(Seq([1, 3, 6, 7, 6, 3, 1]))
        .map(([d, n]) => [((p1 + d - 1) % 10) + 1, n])
        .map(([p, n]) => solve(p2, s2, p, s1 + p).map((x) => x * n))
        .reduce((a, b) => a.zipWith(add, b.reverse()), List.of(0, 0)),
)

/**
 * @param {string} input
 */
function part2(input) {
  const [p1, p2] = input
    .trim()
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map(Number)

  return Math.max(...solve(p1, 0, p2, 0))
}
