import CONFIG from 'constants/config'
import { getAllContents, getFrontmatter } from 'contents/queries'
import { createOgImage } from 'app/og-image'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const pages = await getAllContents('pages')
  return pages.map((slug) => ({ slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const filePath = slug.join('/')
  const frontmatter = await getFrontmatter('pages', filePath)
  const title = frontmatter.title || CONFIG.SITE_TITLE
  const description = frontmatter.description || CONFIG.SITE_DESCRIPTION
  const eyebrow = slug.length === 1 && slug[0] === 'index' ? 'Home' : `/${slug.join('/')}`

  return createOgImage({ title, description, eyebrow })
}
