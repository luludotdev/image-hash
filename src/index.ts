import fileType from 'file-type'
import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'
import { distance } from './distance'
import { generateHash } from './hash'

import {
  ERR_INVALID_INPUT,
  ERR_UNRECOGNISED_IMG,
  ERR_UNSUPPORTED_TYPE,
} from './errors'

const readImageData = (bytes: Buffer) => {
  const type = fileType(bytes)
  if (type === undefined) throw ERR_UNRECOGNISED_IMG

  if (type.mime !== 'image/png' && type.mime !== 'image/jpeg') {
    throw ERR_UNSUPPORTED_TYPE
  }

  return type.mime === 'image/png' ? PNG.sync.read(bytes) : jpeg.decode(bytes)
}

export const imageHash = (
  bytes: Buffer,
  precise: boolean = false,
  bits: number = 16
) => {
  if (!(bytes instanceof Buffer)) {
    throw ERR_INVALID_INPUT
  }

  const data = readImageData(bytes)
  return generateHash(data, precise, bits)
}

export const imageHashDistance = (
  a: Buffer,
  b: Buffer,
  precise: boolean = false,
  bits: number = 16
) => {
  const hashA = imageHash(a, precise, bits)
  const hashB = imageHash(b, precise, bits)

  return distance(hashA, hashB)
}

export { distance } from './distance'
