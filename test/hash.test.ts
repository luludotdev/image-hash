import test from 'ava'
import { imageHash, imageHashDistance } from '../src'
import {
  ERR_INVALID_INPUT,
  ERR_UNRECOGNISED_IMG,
  ERR_UNSUPPORTED_TYPE,
} from '../src/errors'
import {
  fetchImages,
  IMAGE_HASH,
  sha1,
  SMALL_HASH,
  UNRELATED_HASH,
  UNRELATED_HASH_STRICT,
} from './helpers'

const images = fetchImages()

test('only accepts buffer types', t => {
  // @ts-ignore
  t.throws(() => imageHash('e'), ERR_INVALID_INPUT.message)

  // @ts-ignore
  t.throws(() => imageHash(5), ERR_INVALID_INPUT.message)

  // @ts-ignore
  t.throws(() => imageHash([5]), ERR_INVALID_INPUT.message)

  t.notThrows(() => imageHash(images.png))
})

test('accepts .png files', t => {
  t.notThrows(() => imageHash(images.png))
})

test('accepts .jpeg files', t => {
  t.notThrows(() => imageHash(images.jpeg))
})

test('fails on other image file types', t => {
  t.throws(() => imageHash(images.tiff), ERR_UNSUPPORTED_TYPE.message)
})

test('fails on unrecognised image types', t => {
  t.throws(() => imageHash(Buffer.from([])), ERR_UNRECOGNISED_IMG.message)
})

test('resolves the correct hashes', t => {
  const png = imageHash(images.png)
  const smaller = imageHash(images.smaller)
  const unrelated = imageHash(images.unrelated)

  t.is(png, IMAGE_HASH)
  t.is(smaller, SMALL_HASH)
  t.is(unrelated, UNRELATED_HASH)
})

test('resolves the correct hashes (strict)', t => {
  const png = imageHash(images.png, true)
  const smaller = imageHash(images.smaller, true)
  const unrelated = imageHash(images.unrelated, true)

  t.is(png, IMAGE_HASH)
  t.is(smaller, SMALL_HASH)
  t.is(unrelated, UNRELATED_HASH_STRICT)
})

test('similar images resolve to the same hash', t => {
  const shaPNG = sha1(images.png)
  const shaJPEG = sha1(images.jpeg)
  t.assert(shaPNG !== shaJPEG)

  const png = imageHash(images.png)
  const jpeg = imageHash(images.jpeg)
  t.assert(png === jpeg)
})

test('resized image similarity is < 3', t => {
  const distance = imageHashDistance(images.png, images.smaller)
  t.assert(distance < 3)
})

test('hash length is calculated correctly', t => {
  const png16 = imageHash(images.png, false, 16)
  t.is(png16.length, 64)

  const png24 = imageHash(images.png, false, 24)
  t.is(png24.length, 144)
})
