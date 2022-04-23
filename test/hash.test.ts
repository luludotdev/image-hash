/* eslint-disable ava/assertion-arguments */
import test from 'ava'
import { Buffer } from 'node:buffer'
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

test('only accepts buffer types', async t => {
  await t.throwsAsync(
    // @ts-expect-error Invalid Input
    async () => imageHash('e'),
    undefined,
    ERR_INVALID_INPUT.message
  )

  await t.throwsAsync(
    // @ts-expect-error Invalid Input
    async () => imageHash(5),
    undefined,
    ERR_INVALID_INPUT.message
  )

  await t.throwsAsync(
    // @ts-expect-error Invalid Input
    async () => imageHash([5]),
    undefined,
    ERR_INVALID_INPUT.message
  )

  await t.notThrowsAsync(async () => imageHash(images.png))
})

test('accepts .png files', async t => {
  await t.notThrowsAsync(async () => imageHash(images.png))
})

test('accepts .jpeg files', async t => {
  await t.notThrowsAsync(async () => imageHash(images.jpeg))
})

test('fails on other image file types', async t => {
  await t.throwsAsync(
    async () => imageHash(images.tiff),
    undefined,
    ERR_UNSUPPORTED_TYPE.message
  )
})

test('fails on unrecognised image types', async t => {
  await t.throwsAsync(
    async () => imageHash(Buffer.from([])),
    undefined,
    ERR_UNRECOGNISED_IMG.message
  )
})

test('resolves the correct hashes', async t => {
  const png = await imageHash(images.png)
  const smaller = await imageHash(images.smaller)
  const unrelated = await imageHash(images.unrelated)

  t.is(png, IMAGE_HASH)
  t.is(smaller, SMALL_HASH)
  t.is(unrelated, UNRELATED_HASH)
})

test('resolves the correct hashes (strict)', async t => {
  const png = await imageHash(images.png, true)
  const smaller = await imageHash(images.smaller, true)
  const unrelated = await imageHash(images.unrelated, true)

  t.is(png, IMAGE_HASH)
  t.is(smaller, SMALL_HASH)
  t.is(unrelated, UNRELATED_HASH_STRICT)
})

test('similar images resolve to the same hash', async t => {
  const shaPNG = sha1(images.png)
  const shaJPEG = sha1(images.jpeg)
  t.assert(shaPNG !== shaJPEG)

  const png = await imageHash(images.png)
  const jpeg = await imageHash(images.jpeg)
  t.assert(png === jpeg)
})

test('resized image similarity is < 3', async t => {
  const distance = await imageHashDistance(images.png, images.smaller)
  t.assert(distance < 3)
})

test('hash length is calculated correctly', async t => {
  const png16 = await imageHash(images.png, false, 16)
  t.is(png16.length, 64)

  const png24 = await imageHash(images.png, false, 24)
  t.is(png24.length, 144)
})
