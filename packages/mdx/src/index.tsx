import * as React from 'react'
import { type Pluggable } from 'unified'
import { compile, UseMdxComponents } from '@mdx-js/mdx'
import { VFile, type VFileCompatible } from 'vfile'
import { matter } from 'vfile-matter'
import * as jsxDevRuntime from 'react/jsx-dev-runtime'
import * as jsxRuntime from 'react/jsx-runtime'

export type Frontmatter = Record<string, any>

export type MDXComponents = ReturnType<UseMdxComponents>

export type MarkdownOptions = {
  components?: MDXComponents
  remarkPlugins?: Pluggable[]
  rehypePlugins?: Pluggable[]
}

const comileMdxFrontmatter = async (source: VFileCompatible) => {
  const vfile = new VFile(source)
  matter(vfile)
  return vfile.data.matter as Frontmatter
}

const compileMdx = async (source: VFileCompatible, options: MarkdownOptions = {}) => {
  const vfile = new VFile(source)
  matter(vfile, { strip: true })
  const frontmatter = vfile.data.matter as Frontmatter

  const isDev = process.env.NODE_ENV !== 'production'

  const compiledSource = await compile(vfile, {
    outputFormat: 'function-body',
    development: isDev,
    remarkPlugins: options.remarkPlugins ?? [],
    rehypePlugins: options.rehypePlugins ?? [],
  })
    .then((content) => content)
    .catch((e) => {
      console.log(e)
      throw new Error('UnexpectedMdxError')
    })

  const hydateFn = new Function('jsxRuntime', 'frontmatter', compiledSource.toString())
  const MDXComponent = hydateFn(isDev ? jsxDevRuntime : jsxRuntime, frontmatter)
    .default as React.ElementType

  return { content: <MDXComponent components={options.components} />, frontmatter }
}

export const frontmatter = async (source: string) => {
  return comileMdxFrontmatter(source)
}

export const mdx = async (source: string, components: MDXComponents = {}) => {
  const { default: rehypePrism } = await import('rehype-prism-plus')
  const { default: remarkGfm } = await import('remark-gfm')
  return compileMdx(source, {
    components,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  })
}
