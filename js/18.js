// @ts-check

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
  const finalSum = input
    .trim()
    .split("\n")
    .map(parseLine)
    .reduce((a, b) => rest(sumLines(a, b)))
  return calcMagnitude(finalSum)
}

/**
 * @param {string} input
 */
function part2(input) {
  const lines = input.trim().split("\n")

  let maxMagnitude = 0

  for (const lineA of lines) {
    for (const lineB of lines) {
      if (lineA === lineB) continue
      const sum = rest(sumLines(parseLine(lineA), parseLine(lineB)))
      const magnitude = calcMagnitude(sum)
      if (magnitude > maxMagnitude) {
        maxMagnitude = magnitude
      }
    }
  }

  return maxMagnitude
}

/**
 * @typedef {object} Node
 * @property {number | null} value
 * @property {Node | null} left
 * @property {Node | null} right
 */

/**
 * @param {Node} node
 */
function calcMagnitude(node) {
  if (!node) return 0
  if (node.value != null) return node.value
  const { left, right } = node
  return calcMagnitude(left) * 3 + calcMagnitude(right) * 2
}

/**
 *
 * @param {number | null} value
 * @returns {Node}
 */
function createNode(value) {
  return {
    value,
    left: null,
    right: null,
  }
}

/**
 *
 * @param {string} line
 * @returns
 */
function parseLine(line) {
  return toTree(JSON.parse(line))
}

/**
 * @typedef {Array<number | RecursiveArray>} RecursiveArray
 */

/**
 *
 * @param {RecursiveArray | number} pair
 * @returns {Node}
 */
function toTree(pair) {
  if (pair == null) return null
  if (typeof pair === "number") return createNode(pair)
  const [left, right] = pair
  const root = createNode(null)
  root.left = toTree(left)
  root.right = toTree(right)
  return root
}

/**
 *
 * @param {Node} a
 * @param {Node} b
 * @returns
 */
function sumLines(a, b) {
  const root = createNode(null)
  root.left = a
  root.right = b
  return root
}

/**
 * @param {Node} tree
 * @returns {Node[]}
 */
function treeToValueNodes(tree) {
  if (!tree) return []
  if (tree.value != null) return [tree]
  return [...treeToValueNodes(tree.left), ...treeToValueNodes(tree.right)]
}

/**
 *
 * @param {Node} tree
 * @returns {Node}
 */
function rest(tree) {
  while (true) {
    let actionApplied = false

    const explodeResult = explode(tree, 0)
    if (explodeResult) {
      actionApplied = true
      const [node, left, right] = explodeResult
      const valueNodes = treeToValueNodes(tree)
      const idx = valueNodes.indexOf(node)
      if (valueNodes[idx - 1] && left) {
        valueNodes[idx - 1].value += left.value
      }
      if (valueNodes[idx + 1] && right) {
        valueNodes[idx + 1].value += right.value
      }
    } else {
      actionApplied = split(tree)
    }

    if (!actionApplied) {
      break
    }
  }

  return tree
}

/**
 * @param {Node} node
 * @param {number} depth
 * @returns {[Node, Node | null, Node | null] | null}
 */
function explode(node, depth) {
  if (!node) return null

  if (node.value == null && depth >= 4) {
    const { left, right } = node
    node.value = 0
    node.left = null
    node.right = null
    return [node, left, right]
  }

  if (node.value == null) {
    return explode(node.left, depth + 1) || explode(node.right, depth + 1)
  }

  return null
}

/**
 *
 * @param {Node} node
 * @returns
 */
function split(node) {
  if (!node) return false
  if (node.value != null && node.value > 9) {
    const num = node.value
    node.value = null
    node.left = createNode(Math.floor(num / 2))
    node.right = createNode(Math.ceil(num / 2))
    return true
  }

  return split(node.left) || split(node.right)
}
