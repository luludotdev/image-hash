import { readFileSync } from 'fs'
import { join } from 'path'

export const fetchImages = () => {
  const base = join(__dirname, 'images')

  const png = readFileSync(join(base, 'test.png'))
  const smaller = readFileSync(join(base, 'test-smaller.png'))
  const jpeg = readFileSync(join(base, 'test.jpg'))
  const tiff = readFileSync(join(base, 'test.tif'))

  return { png, smaller, jpeg, tiff }
}
