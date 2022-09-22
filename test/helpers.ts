import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const fetchImages = () => {
  const base = join('test', 'images')

  const png = readFileSync(join(base, 'test.png'))
  const smaller = readFileSync(join(base, 'test-smaller.png'))
  const jpeg = readFileSync(join(base, 'test.jpg'))
  const tiff = readFileSync(join(base, 'test.tif'))
  const unrelated = readFileSync(join(base, 'unrelated.jpg'))

  return { png, smaller, jpeg, tiff, unrelated }
}

export const IMAGE_HASH =
  'ffffffffffffffffffffffffffffffff04201ff01ff81ff83ffc3ff80ff00000'

export const SMALL_HASH =
  'fffffffffffffffff7efffffffffffff04201ff01ff81ff83ffc3ff80ff00000'

export const UNRELATED_HASH =
  '0fc01fc03fe03fe07b70f860fc60fc80fffc7ffc03a000000ff80ff807f003f0'

export const UNRELATED_HASH_STRICT =
  '0fc01fc03fe03fe07970f860fc60fcc0fffc7ffc038000400ff80ff807f003f0'

export const sha1 = (bytes: Buffer) => {
  const hash = createHash('sha1')
  hash.update(bytes)

  return hash.digest('hex')
}
