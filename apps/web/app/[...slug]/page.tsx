import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllContents, getFrontmatter, getContent } from 'contents/queries'
import Container from 'components/ui/container'

interface Params {
  slug: string[]
}

interface Props {
  params: Promise<Params>
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug = [] } = await params
  const frontmatter = await getFrontmatter('pages', slug.join('/'))
  return {
    ...frontmatter,
    openGraph: { ...frontmatter },
    twitter: { ...frontmatter },
  } as Metadata
}

export const generateStaticParams = async () => {
  const pages = await getAllContents('pages')
  return pages.map((slug) => ({ slug }))
}

const Page = async ({ params }: Props) => {
  const { slug = [] } = await params
  const { success, content } = await getContent('pages', slug.join('/'))

  if (!success) {
    return notFound()
  }

  return (
    <>
      <Container className="mdx max-w-screen-md pb-20">{content.content}</Container>
    </>
  )
}

export default Page
