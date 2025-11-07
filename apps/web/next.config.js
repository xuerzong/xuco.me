const path = require('node:path')

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname, '..', '..') },
}

module.exports = nextConfig
