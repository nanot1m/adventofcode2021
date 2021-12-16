// @ts-check

import { range } from "./itertools.js"
import { solution } from "./solution.js"

solution({
  solve(input) {
    return [() => part1(input), () => part2(input)]
  },
  submit: { 1: false, 2: false },
})

const PACKET_TYPE_SUM = 0
const PACKET_TYPE_PRODUCT = 1
const PACKET_TYPE_MIN = 2
const PACKET_TYPE_MAX = 3
const PACKET_TYPE_LITERAL_VALUE = 4
const PACKET_TYPE_GT = 5
const PACKET_TYPE_LT = 6
const PACKET_TYPE_EQ = 7

/**
 * @param {string} input
 */
function part1(input) {
  const binary = convertHexStrToBinaryStr(input.trim())
  const { packet } = parsePacket(binary, 0)

  let result = 0
  for (const p of traversePackets([packet])) {
    result += p.version
  }

  return result
}

/**
 * @param {string} input
 */
function part2(input) {
  const binary = convertHexStrToBinaryStr(input.trim())
  return calc(parsePacket(binary, 0).packet)
}

/**
 * @typedef {object} Packet
 * @property {number} version
 * @property {number} packetType
 * @property {number} [value]
 * @property {Packet[]} [packets]
 */

/**
 *
 * @param {string} binary
 * @param {number} pos
 * @returns
 */
function parsePacket(binary, pos) {
  const version = parseInt(binary.slice(pos, pos + 3), 2)
  const packetType = parseInt(binary.slice(pos + 3, pos + 6), 2)
  pos += 6
  return packetType === PACKET_TYPE_LITERAL_VALUE
    ? parsePacketLiteral(binary, pos, version, packetType)
    : parsePacketOperator(binary, pos, version, packetType)
}

/**
 *
 * @param {string} binary
 * @param {number} pos
 * @param {number} version
 * @param {number} packetType
 * @returns {{packet: Packet, pos: number}}
 */
function parsePacketOperator(binary, pos, version, packetType) {
  const packets = []
  const lengthTypeId = binary[pos]
  pos++
  if (lengthTypeId === "0") {
    const length = parseInt(binary.slice(pos, pos + 15), 2)
    pos += 15
    const target = pos + length
    while (pos < target) {
      const result = parsePacket(binary, pos)
      pos = result.pos
      packets.push(result.packet)
    }
  }
  if (lengthTypeId === "1") {
    const count = parseInt(binary.slice(pos, pos + 11), 2)
    pos += 11
    for (const _ of range(0, count)) {
      const result = parsePacket(binary, pos)
      pos = result.pos
      packets.push(result.packet)
    }
  }
  return {
    packet: { version, packetType, packets },
    pos,
  }
}

/**
 *
 * @param {string} binary
 * @param {number} pos
 * @param {number} version
 * @param {number} packetType
 * @returns {{packet: Packet, pos: number}}
 */
function parsePacketLiteral(binary, pos, version, packetType) {
  let isLastGroup = false
  let value = ""
  while (!isLastGroup) {
    isLastGroup = binary[pos] === "0"
    value += binary.slice(pos + 1, pos + 5)
    pos += 5
  }

  return {
    packet: { version, packetType, value: parseInt(value, 2) },
    pos,
  }
}

/**
 * @param {string} input
 */
function convertHexStrToBinaryStr(input) {
  return input
    .split("")
    .map((ch) => parseInt(ch, 16).toString(2).padStart(4, "0"))
    .join("")
}

/**
 * @param {Packet[]} packets
 * @returns
 */
function* traversePackets(packets) {
  if (packets == null) return
  for (const packet of packets) {
    yield packet
    yield* traversePackets(packet.packets)
  }
}

/**
 *
 * @param {Packet} p
 * @returns
 */
function calc(p) {
  switch (p.packetType) {
    case PACKET_TYPE_SUM:
      return p.packets.reduce((acc, packet) => acc + calc(packet), 0)
    case PACKET_TYPE_PRODUCT:
      return p.packets.reduce((acc, packet) => acc * calc(packet), 1)
    case PACKET_TYPE_MIN:
      return p.packets.reduce((acc, p) => Math.min(acc, calc(p)), Infinity)
    case PACKET_TYPE_MAX:
      return p.packets.reduce((acc, p) => Math.max(acc, calc(p)), -Infinity)
    case PACKET_TYPE_LITERAL_VALUE:
      return p.value
    case PACKET_TYPE_GT:
      return calc(p.packets[0]) > calc(p.packets[1])
    case PACKET_TYPE_LT:
      return calc(p.packets[0]) < calc(p.packets[1])
    case PACKET_TYPE_EQ:
      return calc(p.packets[0]) === calc(p.packets[1])
  }
  throw new Error("Unknown packet type: " + p.packetType)
}
