/* eslint-disable id-length */

import type { Buffer } from 'node:buffer'
import type { RawImageData } from 'jpeg-js'
import type { PNG } from 'pngjs'

// Code modified from https://github.com/danm/image-hash
// Licensed under the MIT License
// https://github.com/danm/image-hash/blob/master/LICENSE

const median = (data: number[]) => {
  const mdarr = [...data].sort((a, b) => a - b)
  if (mdarr.length % 2 === 0) {
    return (mdarr[mdarr.length / 2] + mdarr[mdarr.length / 2 + 1]) / 2
  }

  return mdarr[Math.floor(mdarr.length / 2)]
}

const translateBlocksToBits = (blocks: number[], pixelsPerBlock: number) => {
  const newblocks = blocks
  const halfBlockValue = (pixelsPerBlock * 256 * 3) / 2
  const bandsize = blocks.length / 4

  for (let i = 0; i < 4; i += 1) {
    const m = median(blocks.slice(i * bandsize, (i + 1) * bandsize))

    for (let j = i * bandsize; j < (i + 1) * bandsize; j += 1) {
      const v = blocks[j]

      newblocks[j] = Number(
        v > m || (Math.abs(v - m) < 1 && m > halfBlockValue),
      )
    }
  }
}

const bitsToHexhash = (bitsArray: number[]) => {
  const hex = []
  for (let i = 0; i < bitsArray.length; i += 4) {
    const nibble = bitsArray.slice(i, i + 4)
    hex.push(Number.parseInt(nibble.join(''), 2).toString(16))
  }

  return hex.join('')
}

type ImageData = PNG | RawImageData<Buffer>
type HashFunction = (data: ImageData, bits: number) => string

const bmvbhashEven: HashFunction = (data, bits) => {
  const blocksizeX = Math.floor(data.width / bits)
  const blocksizeY = Math.floor(data.height / bits)

  const result: number[] = []

  for (let y = 0; y < bits; y += 1) {
    for (let x = 0; x < bits; x += 1) {
      let total = 0

      for (let iy = 0; iy < blocksizeY; iy += 1) {
        for (let ix = 0; ix < blocksizeX; ix += 1) {
          const cx = x * blocksizeX + ix
          const cy = y * blocksizeY + iy
          const ii = (cy * data.width + cx) * 4

          const alpha = data.data[ii + 3]
          total +=
            alpha === 0
              ? 765
              : data.data[ii] + data.data[ii + 1] + data.data[ii + 2]
        }
      }

      result.push(total)
    }
  }

  translateBlocksToBits(result, blocksizeX * blocksizeY)
  return bitsToHexhash(result)
}

const bmvbhash: HashFunction = (data, bits) => {
  const result: number[] = []
  let weightTop
  let weightBottom
  let weightLeft
  let weightRight
  let blockTop
  let blockBottom
  let blockLeft
  let blockRight
  let yMod
  let yFrac
  let yInt
  let xMod
  let xFrac
  let xInt
  const blocks: number[][] = []

  const evenX = data.width % bits === 0
  const evenY = data.height % bits === 0

  if (evenX && evenY) {
    return bmvbhashEven(data, bits)
  }

  for (let i = 0; i < bits; i += 1) {
    blocks.push([])
    for (let j = 0; j < bits; j += 1) {
      blocks[i].push(0)
    }
  }

  const blockWidth = data.width / bits
  const blockHeight = data.height / bits

  for (let y = 0; y < data.height; y += 1) {
    if (evenY) {
      blockBottom = Math.floor(y / blockHeight)
      blockTop = blockBottom
      weightTop = 1
      weightBottom = 0
    } else {
      yMod = (y + 1) % blockHeight
      yFrac = yMod - Math.floor(yMod)
      yInt = yMod - yFrac

      weightTop = 1 - yFrac
      weightBottom = yFrac

      if (yInt > 0 || y + 1 === data.height) {
        blockBottom = Math.floor(y / blockHeight)
        blockTop = blockBottom
      } else {
        blockTop = Math.floor(y / blockHeight)
        blockBottom = Math.ceil(y / blockHeight)
      }
    }

    for (let x = 0; x < data.width; x += 1) {
      const ii = (y * data.width + x) * 4
      const alpha = data.data[ii + 3]
      const avgvalue =
        alpha === 0
          ? 765
          : data.data[ii] + data.data[ii + 1] + data.data[ii + 2]

      if (evenX) {
        blockRight = Math.floor(x / blockWidth)
        blockLeft = blockRight
        weightLeft = 1
        weightRight = 0
      } else {
        xMod = (x + 1) % blockWidth
        xFrac = xMod - Math.floor(xMod)
        xInt = xMod - xFrac

        weightLeft = 1 - xFrac
        weightRight = xFrac

        if (xInt > 0 || x + 1 === data.width) {
          blockRight = Math.floor(x / blockWidth)
          blockLeft = blockRight
        } else {
          blockLeft = Math.floor(x / blockWidth)
          blockRight = Math.ceil(x / blockWidth)
        }
      }

      blocks[blockTop][blockLeft] += avgvalue * weightTop * weightLeft
      blocks[blockTop][blockRight] += avgvalue * weightTop * weightRight
      blocks[blockBottom][blockLeft] += avgvalue * weightBottom * weightLeft
      blocks[blockBottom][blockRight] += avgvalue * weightBottom * weightRight
    }
  }

  for (let i = 0; i < bits; i += 1) {
    for (let j = 0; j < bits; j += 1) {
      result.push(blocks[i][j])
    }
  }

  translateBlocksToBits(result, blockWidth * blockHeight)
  return bitsToHexhash(result)
}

export const generateHash = (
  imgData: ImageData,
  precise: boolean,
  bits: number,
) => (precise ? bmvbhash(imgData, bits) : bmvbhashEven(imgData, bits))
