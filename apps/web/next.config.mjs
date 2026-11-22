import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createMDX from '@next/mdx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  turbopack: { root: path.resolve(__dirname, '..', '..') },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-prism-plus'],
  },
})

export default withMDX(nextConfig)
