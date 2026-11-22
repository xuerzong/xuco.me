import CONFIG from 'constants/config'
import { getAllContents, getMetadata } from 'libs/content'
import { createOgImage } from 'app/og-image'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const pages = await getAllContents('pages')
  return pages.map((slug) => ({ slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const filePath = slug.join('/')
  const metadata = await getMetadata('pages', filePath)
  const title = metadata.title || CONFIG.SITE_TITLE
  const description = metadata.description || CONFIG.SITE_DESCRIPTION
  const eyebrow = slug.length === 1 && slug[0] === 'index' ? 'Home' : `/${slug.join('/')}`

  return createOgImage({ title, description, eyebrow })
}
