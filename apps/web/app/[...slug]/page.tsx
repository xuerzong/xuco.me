import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllContents, getPageContent, getPageFrontmatter } from '@/contents/queries'
import Hero from '@/components/Hero'
import Container from '@/components/Container'

interface Params {
  slug: string[]
}

interface Props {
  params: Params
}

export const generateMetadata = async ({ params }: Props) => {
  const slug = params.slug || []
  const frontmatter = await getPageFrontmatter(slug.join('/'))
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
  const slug = params.slug || []
  const { success, content } = await getPageContent(slug.join('/'))

  if (!success) {
    return notFound()
  }

  return (
    <>
      <Hero title={content.frontmatter.title} description={content.frontmatter.description} />
      <Container className="mdx max-w-screen-md pb-20">{content.content}</Container>
    </>
  )
}

export default Page
