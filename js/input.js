// @ts-check
import "./env.js"
import { get } from "https"
import { dirname, join } from "path"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { fileURLToPath } from "url"

const SESSION = process.env.SESSION

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
    `day${dayN}.input.txt`,
  )
  let input = readFileSync(name, "utf8")
  if (trim) input = input.trim()
  return input
}

/**
 * @template T
 */
export class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} statusMessage
   * @param {T} body
   */
  constructor(statusCode, statusMessage, body) {
    super(`${statusCode} ${statusMessage}`)
    this.statusCode = statusCode
    this.statusMessage = statusMessage
    this.body = body
  }
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
      ].join(" "),
    )
    process.exit(1)
  }

  return new Promise((resolve, reject) => {
    let text = ""
    const req = get(
      `https://adventofcode.com/2021/day/${dayN}/input`,
      { headers: { cookie: `session=${SESSION}` } },
      (res) => {
        res.on("data", (chunk) => {
          text += chunk
        })
        res.on("end", () => {
          if (res.statusCode > 399) {
            reject(new HttpError(res.statusCode, res.statusMessage, text))
            return
          }
          resolve(trim ? text.trim() : text)
        })
        res.on("error", reject)
      },
    )
    req.on("error", reject)
    req.end()
  })
}

/**
 *
 * @param {string|number} dayN
 * @param {boolean} trim
 * @returns
 */
export async function cachedFetchFromAoC(dayN, trim = false) {
  const name = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "input",
    `day${dayN}.input.txt`,
  )
  if (existsSync(name)) {
    return readFromFileSystem(dayN, trim)
  }

  const input = await fetchFromAoC(dayN, trim)
  mkdirSync(dirname(name), { recursive: true })
  writeFileSync(name, input)
  return input
}
