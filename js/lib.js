// @ts-check

/**
 * @param {T[]} xs
 * @param {(arg: T) => string | number} fn
 *
 * @template T
 */
export function minBy(xs, fn) {
  return xs.reduce((a, b) => (fn(a) < fn(b) ? a : b))
}

/**
 * @param {number[]} xs
 */
export function min(xs) {
  return minBy(xs, (x) => x)
}

/**
 *
 * @param {T[]} xs
 * @param {T[][]} yss
 * @returns {T[][]}
 *
 * @template T
 */
export function zip(xs, ...yss) {
  const minLength = minBy(yss, (ys) => ys.length).length
  return xs.slice(0, minLength).map((val, i) =>
    yss.reduce(
      (a, arr) => {
        a.push(arr[i])
        return a
      },
      [val],
    ),
  )
}

/**
 * @param {string} input
 */
export function readLines(input) {
  return input.split("\n")
}

/**
 * @param {string} input
 */
export function readBlocks(input) {
  return input.split("\n\n")
}
