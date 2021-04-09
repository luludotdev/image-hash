import test from 'ava'
import { distance } from '../src/distance.js'

test('calculates string distances', t => {
  const d = distance('distance', 'distacne')
  t.is(d, 2)
})

test('works on zero-length strings', t => {
  const string = 'distance'

  const d1 = distance(string, '')
  const d2 = distance('', string)

  t.assert(d1 === string.length)
  t.assert(d2 === string.length)
  t.assert(d1 === d2)
})
