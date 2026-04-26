import { getAllContents, getFrontmatter } from 'contents/queries'
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
  const frontmatter = await getFrontmatter('posts', slug.join('/'))

  return createOgImage({
    title: frontmatter.title || slug[slug.length - 1],
    description: frontmatter.description,
    eyebrow: `/p/${slug.join('/')}`,
  })
}