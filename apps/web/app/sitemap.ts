import type { MetadataRoute } from 'next'
import CONFIG from 'constants/config'
import { getAllContents } from 'contents/queries'

export const dynamic = 'force-static'

const getPagePath = (slug: string[]) => {
  if (slug.length === 1 && slug[0] === 'index') {
    return ''
  }

  return slug.join('/')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([getAllContents('pages'), getAllContents('posts')])

  const pageEntries = pages.map((slug) => ({
    url: new URL(getPagePath(slug), `${CONFIG.SITE_URL}/`).toString(),
  }))

  const postEntries = posts.map((slug) => ({
    url: new URL(`p/${slug.join('/')}`, `${CONFIG.SITE_URL}/`).toString(),
  }))

  return [...pageEntries, ...postEntries]
}
