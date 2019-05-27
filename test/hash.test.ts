import test from 'ava'
import { imageHash, imageHashDistance } from '../src'
import { fetchImages } from './helpers'

const images = fetchImages()

test.todo('only accepts buffer types')
test.todo('accepts .png files')
test.todo('accepts .jpeg files')
test.todo('fails on other image file types')

test.todo('resolves the correct hashes')
test.todo('resized image similarity is < 3')
