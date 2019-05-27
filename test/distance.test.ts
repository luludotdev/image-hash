import test from 'ava'
import { distance } from '../src/distance'

test('calculates string distances', t => {
  const d = distance('distance', 'distacne')
  t.is(d, 2)
})

test('works on zero-length strings', t => {
  const str = 'distance'

  const d1 = distance(str, '')
  const d2 = distance('', str)

  t.assert(d1 === str.length)
  t.assert(d2 === str.length)
  t.assert(d1 === d2)
})
