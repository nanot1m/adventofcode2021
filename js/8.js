// @ts-check

import { solution } from "./solution.js"

solution({
  solve(input) {
    const data = input.trim().split("\n").map(parseLine)
    return [() => part1(data), () => part2(data)]
  },
})

/**
 *
 * @param {string} line
 * @returns
 */
function parseLine(line) {
  const [patternStr, outputStr] = line.trim().split(" | ")
  const pattern = patternStr.split(/\s+/)
  const output = outputStr.split(/\s+/)
  return { pattern, output }
}

/**
 * @param {Array<ReturnType<typeof parseLine>>} input
 */
function part1(input) {
  return input
    .map((i) => i.output)
    .flat()
    .filter((x) => [2, 4, 3, 7].includes(x.length)).length
}

/**
 * @param {Array<ReturnType<typeof parseLine>>} input
 */
function part2(input) {
  /**
   * @param {string} str
   */
  function sortStr(str) {
    return [...str].sort().join("")
  }

  /**
   * @param {string[]} pattern
   */
  function createPatternDecoder(pattern) {
    const one = pattern.find((x) => x.length === 2)
    const four = pattern.find((x) => x.length === 4)
    const seven = pattern.find((x) => x.length === 3)
    const eight = pattern.find((x) => x.length === 7)

    const candidatesForSix = pattern.filter((x) => x.length === 6)
    const six = candidatesForSix.find((pattern) => {
      return ![...one].every((letter) => pattern.includes(letter))
    })

    const candidatesForNine = pattern.filter((x) => x.length === 6 && x !== six)
    const nine = candidatesForNine.find((pattern) => {
      return [...four].every((letter) => pattern.includes(letter))
    })
    const zero = candidatesForNine.find((pattern) => pattern !== nine)

    const candidatesForThree = pattern.filter((x) => x.length === 5)
    const three = candidatesForThree.find((pattern) => {
      return [...one].every((letter) => pattern.includes(letter))
    })

    const candidatesForFive = pattern.filter(
      (x) => x.length === 5 && x !== three,
    )
    const five = candidatesForFive.find((pattern) => {
      return [...pattern].every((letter) => six.includes(letter))
    })
    const two = candidatesForFive.find((pattern) => pattern !== five)

    const patternsToNumbers = {
      [sortStr(zero)]: 0,
      [sortStr(one)]: 1,
      [sortStr(two)]: 2,
      [sortStr(three)]: 3,
      [sortStr(four)]: 4,
      [sortStr(five)]: 5,
      [sortStr(six)]: 6,
      [sortStr(seven)]: 7,
      [sortStr(eight)]: 8,
      [sortStr(nine)]: 9,
    }

    return (/** @type {string} */ pattern) =>
      patternsToNumbers[sortStr(pattern)]
  }

  return input
    .map((i) => i.output.map(createPatternDecoder(i.pattern)).join(""))
    .map(Number)
    .reduce((a, b) => a + b, 0)
}
