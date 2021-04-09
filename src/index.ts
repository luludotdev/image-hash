import fileType from 'file-type'
import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'
import { distance } from './distance.js'
import {
  ERR_INVALID_INPUT,
  ERR_UNRECOGNISED_IMG,
  ERR_UNSUPPORTED_TYPE,
} from './errors.js'
import { generateHash } from './hash.js'

const readImageData = async (bytes: Buffer) => {
  const type = await fileType.fromBuffer(bytes)
  if (type === undefined) throw ERR_UNRECOGNISED_IMG

  if (type.mime !== 'image/png' && type.mime !== 'image/jpeg') {
    throw ERR_UNSUPPORTED_TYPE
  }

  return type.mime === 'image/png' ? PNG.sync.read(bytes) : jpeg.decode(bytes)
}

export const imageHash = async (bytes: Buffer, precise = false, bits = 16) => {
  if (!(bytes instanceof Buffer)) {
    throw ERR_INVALID_INPUT
  }

  const data = await readImageData(bytes)
  return generateHash(data, precise, bits)
}

export const imageHashDistance = async (
  a: Buffer,
  b: Buffer,
  precise = false,
  bits = 16
) => {
  const hashA = await imageHash(a, precise, bits)
  const hashB = await imageHash(b, precise, bits)

  return distance(hashA, hashB)
}

export { distance } from './distance.js'
