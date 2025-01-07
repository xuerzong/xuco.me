const path = require('node:path')

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
