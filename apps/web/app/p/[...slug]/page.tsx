import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllContents, getContent, getFrontmatter } from 'contents/queries'
import Container from 'components/ui/container'

interface Params {
  slug: string[]
}

interface Props {
  params: Promise<Params>
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug = [] } = await params
  const frontmatter = await getFrontmatter('posts', slug.join('/'))
  return {
    ...frontmatter,
    openGraph: { ...frontmatter },
    twitter: { ...frontmatter },
  } as Metadata
}

export const generateStaticParams = async () => {
  const posts = await getAllContents('posts')
  return posts.map((slug) => ({ slug }))
}

const Page = async ({ params }: Props) => {
  const { slug = [] } = await params
  const { success, content } = await getContent('posts', slug.join('/'))
  if (!success) {
    return notFound()
  }

  return (
    <>
      <Container className="mdx max-w-2xl space-x-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">{content.frontmatter.title}</h1>
        <div>{content.content}</div>
      </Container>
    </>
  )
}

export default Page
