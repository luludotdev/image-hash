# 🖼 Image Hash
[![NPM version](https://img.shields.io/npm/v/@lolpants/image-hash.svg?maxAge=3600)](https://www.npmjs.com/package/@lolpants/image-hash)
[![NPM downloads](https://img.shields.io/npm/dt/@lolpants/image-hash.svg?maxAge=3600)](https://www.npmjs.com/package/@lolpants/image-hash)
[![Build status](https://travis-ci.com/lolPants/image-hash.svg)](https://travis-ci.com/lolPants/image-hash)
[![Dependencies](https://img.shields.io/david/lolpants/image-hash.svg?maxAge=3600)](https://david-dm.org/lolpants/image-hash)
[![Coverage Status](https://coveralls.io/repos/github/lolPants/image-hash/badge.svg?branch=master)](https://coveralls.io/github/lolPants/image-hash?branch=master)

_Generate perceptual hashes for PNG or JPEG images._  
Written in TypeScript, compiled down to ES5 for use in any Node.js version!

## 💾 Installation
The package is on the NPM registry as `@lolpants/image-hash`. Simply install it with your NPM client of choice.

## 🔧 Usage
```ts
// Import (CommonJS)
const { imageHash } = require('@lolpants/image-hash')

// Import (ESM)
import { imageHash } from '@lolpants/image-hash'

// Resolve
const imageBuffer = fs.readFileSync('./example.png')
const hash = imageHash(imageBuffer)
// => ffee6f66ea356e6c6d5...
```

Only PNG or JPEG type images can be used.
