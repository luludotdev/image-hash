import fileType from 'file-type'
import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'
import { generateHash } from './hash'

const readImageData = async (bytes: Buffer) => {
  const type = fileType(bytes)
  if (type === undefined) throw new Error('Unrecognised file type!')

  if (type.mime !== 'image/png' && type.mime !== 'image/jpeg') {
    throw new Error('Unsupported image type!')
  }

  return type.mime === 'image/png' ? PNG.sync.read(bytes) : jpeg.decode(bytes)
}

export const imageHash = async (
  bytes: Buffer,
  precise: boolean,
  bits: number = 16
) => {
  const data = await readImageData(bytes)
  return generateHash(data, precise, bits)
}
