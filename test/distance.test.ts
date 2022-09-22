import { test, expect } from 'vitest'
import { distance } from '../src/distance.js'

test('calculates string distances', () => {
  const actual = distance('distance', 'distacne')
  expect(actual).toBe(2)
})

test('works on zero-length strings', () => {
  const string = 'distance'

  const d1 = distance(string, '')
  const d2 = distance('', string)

  expect(d1).toBe(string.length)
  expect(d2).toBe(string.length)
  expect(d1).toBe(d2)
})
