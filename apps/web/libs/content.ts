import fs from 'node:fs'
import path from 'node:path'
import { flattenArray } from 'libs/utils/array'

type ContentType = 'pages' | 'posts'

export type ContentMetadata = {
  title?: string
  description?: string
}

const appDir = path.resolve(process.cwd(), 'app')

const contentDirs: Record<ContentType, string> = {
  pages: path.resolve(appDir, '(pages)'),
  posts: path.resolve(appDir, '(posts)', 'p'),
}

const getPagePath = (type: ContentType, slug: string) => {
  if (type === 'pages' && slug === 'index') {
    return path.resolve(contentDirs.pages, 'page.mdx')
  }

  return path.resolve(contentDirs[type], slug, 'page.mdx')
}

const getPageFiles = (filePath: string): string[] => {
  const fileStat = fs.statSync(filePath)

  if (fileStat.isDirectory()) {
    const files = fs.readdirSync(filePath)
    return flattenArray<string>(files.map((file) => getPageFiles(path.resolve(filePath, file))))
  }

  return path.basename(filePath) === 'page.mdx' ? [filePath] : []
}

export const getAllContents = async (type: ContentType) => {
  return getPageFiles(contentDirs[type])
    .map((p) => path.relative(contentDirs[type], path.dirname(p)))
    .map((p) => (p === '' ? 'index' : p))
    .map((p) => p.split(path.sep))
}

const importContent = async (type: ContentType, slug: string) => {
  if (type === 'pages') {
    const pagePath = slug === 'index' ? '' : `${slug}/`
    return import(`../app/(pages)/${pagePath}page.mdx`)
  }

  return import(`../app/(posts)/p/${slug}/page.mdx`)
}

export const getMetadata = async (
  type: ContentType = 'pages',
  slug: string
): Promise<ContentMetadata> => {
  if (!fs.existsSync(getPagePath(type, slug))) {
    return {}
  }

  try {
    const { metadata } = await importContent(type, slug)
    return (metadata ?? {}) as ContentMetadata
  } catch (error) {
    return {}
  }
}
