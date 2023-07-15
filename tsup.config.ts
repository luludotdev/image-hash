import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

export function createTsupConfig({
  entry = ['./src/index.ts'],
  external = [],
  noExternal = [],
  platform = 'node',
  format = 'esm',
  target = 'es2021',
  skipNodeModulesBundle = true,
  clean = true,
  shims = true,
  splitting = false,
  keepNames = true,
  dts = true,
  sourcemap = true,
}: Omit<Options, 'minify'> = {}) {
  return defineConfig(options => ({
    entry,
    external,
    noExternal,
    platform,
    format,
    skipNodeModulesBundle,
    target,
    clean,
    shims,
    minify: !options.watch,
    splitting,
    keepNames,
    dts,
    sourcemap,
  }))
}

export default createTsupConfig({
  shims: false,
})
