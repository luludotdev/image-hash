import test from 'ava'
import { imageHash, imageHashDistance } from '../src'
import { ERR_INVALID_INPUT, ERR_UNSUPPORTED_TYPE } from '../src/errors'
import {
  fetchImages,
  IMAGE_HASH,
  sha1,
  SMALL_HASH,
  UNRELATED_HASH,
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

test('resolves the correct hashes', t => {
  const png = imageHash(images.png)
  const smaller = imageHash(images.smaller)
  const unrelated = imageHash(images.unrelated)

  t.is(png, IMAGE_HASH)
  t.is(smaller, SMALL_HASH)
  t.is(unrelated, UNRELATED_HASH)
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
