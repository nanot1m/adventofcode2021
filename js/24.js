// @ts-check
// Solution from https://www.reddit.com/r/adventofcode/comments/rnejv5/comment/hpurv4s/?utm_source=share&utm_medium=web2x&context=3
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
})

function part1(input) {
  const lines = input.split("\n")

  const terms = []
  for (let i = 0; i < 14; i++) {
    terms.push([4, 5, 15].map((j) => +lines[18 * i + j].split(" ")[2]))
  }

  const previous = []
  const digits = []
  for (const [i, [a, b, c]] of Object.entries(terms)) {
    if (a === 1) {
      previous.push([i, c])
    } else {
      const [prevI, prevC] = previous.pop()
      const complement = +prevC + b
      digits[prevI] = Math.min(9, 9 - complement)
      digits[i] = digits[prevI] + complement
    }
  }
  return digits.join("")
}

function part2(input) {
  const lines = input.split("\n")

  const terms = []
  for (let i = 0; i < 14; i++) {
    terms.push([4, 5, 15].map((j) => +lines[18 * i + j].split(" ")[2]))
  }

  const previous = []
  const digits = []
  for (const [i, [a, b, c]] of Object.entries(terms)) {
    if (a === 1) {
      previous.push([i, c])
    } else {
      const [prevI, prevC] = previous.pop()
      const complement = +prevC + b
      digits[prevI] = Math.max(1, 1 - complement)
      digits[i] = digits[prevI] + complement
    }
  }
  return digits.join("")
}
