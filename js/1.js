// @ts-check

import { cachedFetchFromAoC } from "./input.js";
import { solution } from "./solution.js";

solution({
  input: cachedFetchFromAoC,
  solve(input) {
    const xs = input.split("\n");
    return [() => part1(xs), () => part2(xs)];
  },
});

/**
 * @param {string[]} xs
 */
function part1(xs) {
  console.log(arguments);
  return null;
}

/**
 * @param {string[]} xs
 */
function part2(xs) {
  console.log(arguments);
  return null;
}
