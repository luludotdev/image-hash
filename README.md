# 🖼 Image Hash

![Node.js CI](https://github.com/luludotdev/image-hash/workflows/Node.js%20CI/badge.svg?branch=master)
[![NPM version](https://img.shields.io/npm/v/@luludev/image-hash.svg?maxAge=3600)](https://www.npmjs.com/package/@luludev/image-hash)
[![NPM downloads](https://img.shields.io/npm/dt/@luludev/image-hash.svg?maxAge=3600)](https://www.npmjs.com/package/@luludev/image-hash)

> Generate perceptual hashes for PNG or JPEG images

## 💾 Installation

The package is on the NPM registry as `@luludev/image-hash`. Simply install it with your NPM client of choice.

## 🔧 Usage

```ts
import { imageHash } from '@luludev/image-hash'

// Resolve
const imageBuffer = fs.readFileSync('./example.png')
const hash = imageHash(imageBuffer)
// => ffee6f66ea356e6c6d5...
```

Only PNG or JPEG type images can be used.
