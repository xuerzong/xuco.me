import fs from 'node:fs'
import path from 'node:path'
import mdxComponents from 'components/mdx'
import { mdx, frontmatter } from '@xuerzong/mdx'
import { flattenArray } from 'libs/utils/array'

type ContentType = 'pages' | 'posts'

const contentDir = path.resolve(process.cwd(), 'contents')

const isMissingContentError = (error: unknown) => {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

const readFileContent = (type: ContentType, slug: string) => {
  const filePath = path.resolve(contentDir, type, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    const error = new Error(`Content file not found: ${type}/${slug}.mdx`)
    Object.assign(error, { code: 'ENOENT' })
    throw error
  }

  return fs.readFileSync(filePath, 'utf-8')
}

export const getAllContents = async (type: ContentType) => {
  const rootDir = path.resolve(contentDir, type)

  const getFileName = (filePath: string): string[] => {
    const fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) {
      const files = fs.readdirSync(filePath)
      const fileNames = files.map((file) => getFileName(path.resolve(filePath, file)))
      return flattenArray<string>(fileNames)
    } else {
      return [filePath]
    }
  }
  return getFileName(rootDir)
    .map((p) => path.relative(rootDir, p).replace(/.mdx$/, ''))
    .map((p) => p.split('/'))
}

type Content = {
  frontmatter: Record<string, string>
  content: React.JSX.Element
}

type ContentResult =
  | {
      success: false
      content?: Content
    }
  | {
      success: true
      content: Content
    }

export const getContent = async (
  type: ContentType = 'pages',
  slug: string
): Promise<ContentResult> => {
  try {
    const content = readFileContent(type, slug)
    const markdownContent = await mdx(content, mdxComponents)
    return { success: true, content: markdownContent }
  } catch (error) {
    if (!isMissingContentError(error)) {
      console.error(error)
    }
    return { success: false }
  }
}

export const getFrontmatter = async (type: ContentType = 'pages', slug: string) => {
  try {
    const content = readFileContent(type, slug)
    return frontmatter(content)
  } catch (error) {
    return {} as Frontmatter
  }
}
