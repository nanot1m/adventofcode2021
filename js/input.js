// @ts-check
import "./env.js";
import { get } from "https";
import { dirname, join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";

const SESSION = process.env.SESSION;

/**
 *
 * @param {string|number} dayN
 * @param {boolean} trim
 * @returns
 */
export function readFromFileSystem(dayN, trim = true) {
  const name = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "input",
    `day${dayN}.input.txt`
  );
  let input = readFileSync(name, "utf8");
  if (trim) input = input.trim();
  return input;
}

/**
 *
 * @param {string|number} dayN
 * @param {boolean} trim
 * @returns
 */
export function fetchFromAoC(dayN, trim = true) {
  if (SESSION == null) {
    console.error(
      [
        'Environment variable "SESSION" is not provided.',
        "Please login at https://adventofcode.com/2021/auth/login",
        'and set value from cookie "session" as an env variable "SESSION"',
      ].join(" ")
    );
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    let text = "";
    const req = get(
      `https://adventofcode.com/2021/day/${dayN}/input`,
      { headers: { cookie: `session=${SESSION}` } },
      (res) => {
        if (res.statusCode > 399) {
          reject(new Error(`HTTP error: ${res.statusCode}`));
          return;
        }
        res.on("data", (chunk) => {
          text += chunk;
        });
        res.on("end", () => {
          resolve(trim ? text.trim() : text);
        });
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.end();
  });
}

/**
 *
 * @param {string|number} dayN
 * @param {boolean} trim
 * @returns
 */
export async function cachedFetchFromAoC(dayN, trim = true) {
  const name = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "input",
    `day${dayN}.input.txt`
  );
  if (existsSync(name)) {
    return readFromFileSystem(dayN, trim);
  }

  const input = await fetchFromAoC(dayN, trim);
  mkdirSync(dirname(name), { recursive: true });
  writeFileSync(name, input);
  return input
}