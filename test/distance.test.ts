import test from 'ava'
import { distance } from '../src/distance'

test('calculates string distances', t => {
  const d = distance('distance', 'distacne')
  t.is(d, 2)
})
