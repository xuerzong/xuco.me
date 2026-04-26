import CONFIG from 'constants/config'
import { getAllContents, getFrontmatter } from 'contents/queries'

export const dynamic = 'force-static'

const getPageUrl = (slug: string[]) => {
  if (slug.length === 1 && slug[0] === 'index') {
    return CONFIG.SITE_URL
  }

  return new URL(slug.join('/'), `${CONFIG.SITE_URL}/`).toString()
}

const getPostUrl = (slug: string[]) => {
  return new URL(`p/${slug.join('/')}`, `${CONFIG.SITE_URL}/`).toString()
}

export async function GET() {
  const [pages, posts] = await Promise.all([getAllContents('pages'), getAllContents('posts')])

  const pageLines = await Promise.all(
    pages.map(async (slug) => {
      const filePath = slug.join('/')
      const data = await getFrontmatter('pages', filePath)
      const title = data.title || (slug[0] === 'index' ? 'Home' : slug.join('/'))
      const description = data.description ? ` - ${data.description}` : ''
      return `- ${title}: ${getPageUrl(slug)}${description}`
    })
  )

  const postLines = await Promise.all(
    posts.map(async (slug) => {
      const data = await getFrontmatter('posts', slug.join('/'))
      const title = data.title || slug[slug.length - 1]
      const description = data.description ? ` - ${data.description}` : ''
      return `- ${title}: ${getPostUrl(slug)}${description}`
    })
  )

  const content = [
    `# ${CONFIG.SITE_TITLE}`,
    '',
    `> ${CONFIG.SITE_DESCRIPTION}`,
    '',
    `Site: ${CONFIG.SITE_URL}`,
    `Author: ${CONFIG.WEB_AUTHOR}`,
    '',
    '## Pages',
    ...pageLines,
    '',
    '## Posts',
    ...postLines,
  ].join('\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
