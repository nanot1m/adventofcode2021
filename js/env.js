import { existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");

if (existsSync(envPath)) {
  readFileSync(envPath, "utf8")
    .split("\n")
    .map((line) => line.slice(0, line.indexOf("#")))
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split("=").map((x) => x.trim()))
    .forEach(([key, value]) => (process.env[key] = value));
}
