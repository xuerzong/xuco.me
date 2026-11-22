import { getAllContents, getMetadata } from 'libs/content'
import { createOgImage } from 'app/og-image'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const posts = await getAllContents('posts')
  return posts.map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const metadata = await getMetadata('posts', slug.join('/'))

  return createOgImage({
    title: metadata.title || slug[slug.length - 1],
    description: metadata.description,
    eyebrow: `/p/${slug.join('/')}`,
  })
}
