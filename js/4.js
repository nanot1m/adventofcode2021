// @ts-check

import { solution } from "./solution.js"

solution({
  solve(input) {
    const parsedInput = parseBingoInput(input)
    return [() => part1(parsedInput), () => part2(parsedInput)]
  },
})

/**
 *
 * @param {string} input
 * @returns
 */
function parseBingoInput(input) {
  const lines = input.split("\n").map((line) => line.trim())
  const numbers = lines.shift().split(",")
  lines.shift()

  const cards = []

  let card = []
  for (const line of lines) {
    if (line === "") {
      cards.push(card)
      card = []
      continue
    }
    const values = line.split(/\s+/)
    card.push(values)
  }
  return { numbers, cards }
}

/**
 *
 * @param {string[][]} card
 */
function checkBingoCard(card) {
  for (const row of card) {
    if (row.every((value) => value === "X")) {
      return true
    }
  }
  for (let i = 0; i < card[0].length; i++) {
    const column = card.map((row) => row[i])
    if (column.every((value) => value === "X")) {
      return true
    }
  }
  return false
}

/**
 * @param {ReturnType<typeof parseBingoInput>} input
 */
function part1({ numbers, cards }) {
  for (const number of numbers) {
    for (const card of cards) {
      for (const row of card) {
        const idx = row.findIndex((value) => value === number)
        if (idx !== -1) {
          row[idx] = "X"
        }
      }

      if (checkBingoCard(card)) {
        const unmarkedNumbers = card
          .flat()
          .filter((value) => value !== "X")
          .map(Number)
        const sum = unmarkedNumbers.reduce((a, b) => a + b, 0)
        return sum * Number(number)
      }
    }
  }

  return null
}

/**
 * @param {ReturnType<typeof parseBingoInput>} input
 */
function part2({ numbers, cards }) {
  let winners = []
  for (const number of numbers) {
    for (const card of cards) {
      for (const row of card) {
        const idx = row.findIndex((value) => value === number)
        if (idx !== -1) {
          row[idx] = "X"
        }
      }

      if (checkBingoCard(card) && !winners.includes(card)) {
        winners.push(card)
      }
    }

    if (cards.length === winners.length) {
      const unmarkedNumbers = winners[winners.length - 1]
        .flat()
        .filter((value) => value !== "X")
        .map(Number)
      const sum = unmarkedNumbers.reduce((a, b) => a + b, 0)
      return sum * Number(number)
    }
  }

  return null
}
