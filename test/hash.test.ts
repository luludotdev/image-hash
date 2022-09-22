import { Buffer } from 'node:buffer'
import { test, expect, assert } from 'vitest'
import {
  ERR_INVALID_INPUT,
  ERR_UNRECOGNISED_IMG,
  ERR_UNSUPPORTED_TYPE,
} from '../src/errors.js'
import { imageHash, imageHashDistance } from '../src/index.js'
import {
  fetchImages,
  IMAGE_HASH,
  sha1,
  SMALL_HASH,
  UNRELATED_HASH,
  UNRELATED_HASH_STRICT,
} from './helpers.js'

const images = fetchImages()

test('only accepts buffer types', async () => {
  await expect(
    // @ts-expect-error Invalid Input
    imageHash('e'),
  ).rejects.toThrow(ERR_INVALID_INPUT.message)

  await expect(
    // @ts-expect-error Invalid Input
    async () => imageHash(5),
  ).rejects.toThrowError(ERR_INVALID_INPUT.message)

  await expect(
    // @ts-expect-error Invalid Input
    async () => imageHash([5]),
  ).rejects.toThrowError(ERR_INVALID_INPUT.message)
})

test('fails on unsupported image file types', async () => {
  await expect(async () => imageHash(images.tiff)).rejects.toThrowError(
    ERR_UNSUPPORTED_TYPE.message,
  )
})

test('fails on unrecognised image types', async () => {
  await expect(async () => imageHash(Buffer.from([]))).rejects.toThrowError(
    ERR_UNRECOGNISED_IMG.message,
  )
})

test('resolves the correct hashes', async () => {
  await expect(imageHash(images.png)).resolves.toBe(IMAGE_HASH)
  await expect(imageHash(images.smaller)).resolves.toBe(SMALL_HASH)
  await expect(imageHash(images.unrelated)).resolves.toBe(UNRELATED_HASH)
})

test('resolves the correct hashes (strict)', async () => {
  await expect(imageHash(images.png, true)).resolves.toBe(IMAGE_HASH)
  await expect(imageHash(images.smaller, true)).resolves.toBe(SMALL_HASH)
  await expect(imageHash(images.unrelated, true)).resolves.toBe(
    UNRELATED_HASH_STRICT,
  )
})

test('similar images resolve to the same hash', async () => {
  const shaPNG = sha1(images.png)
  const shaJPEG = sha1(images.jpeg)
  assert(shaPNG !== shaJPEG)

  const png = await imageHash(images.png)
  const jpeg = await imageHash(images.jpeg)
  assert(png === jpeg)
})

test('resized image similarity is < 3', async () => {
  const distance = await imageHashDistance(images.png, images.smaller)
  expect(distance).toBeLessThan(3)
})

test('hash length is calculated correctly', async () => {
  const png16 = await imageHash(images.png, false, 16)
  expect(png16.length).toBe(64)

  const png24 = await imageHash(images.png, false, 24)
  expect(png24.length).toBe(144)
})
