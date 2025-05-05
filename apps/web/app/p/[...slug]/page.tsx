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
  const pages = await getAllContents('posts')
  return pages.map((slug) => ({ slug }))
}

const Page = async ({ params }: Props) => {
  const { slug = [] } = await params
  const { success, content } = await getContent('posts', slug.join('/'))

  if (!success) {
    return notFound()
  }

  return (
    <>
      <div className="sticky top-12 z-10 py-2 bg-background border-b border-border">
        <Container className="max-w-screen-md">
          <h1 className="text-3xl font-bold">{content.frontmatter.title}</h1>
        </Container>
      </div>
      <Container className="mdx max-w-screen-md space-x-4 pt-6 pb-20">
        <div>{content.content}</div>
      </Container>
    </>
  )
}

export default Page
