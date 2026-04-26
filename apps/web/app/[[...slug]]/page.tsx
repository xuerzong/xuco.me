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

const getFilePath = (slug: string[] | undefined) => {
  return !slug || slug.length === 0 ? 'index' : slug.join('/')
}

const getOgImagePath = (slug: string[] | undefined) => {
  return `/og/${getFilePath(slug)}`
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params
  const filePath = getFilePath(slug)
  const imagePath = getOgImagePath(slug)

  const frontmatter = await getFrontmatter('pages', filePath)

  if (!frontmatter) return {}

  return {
    ...frontmatter,
    openGraph: {
      ...frontmatter,
      images: [{ url: imagePath }],
    },
    twitter: {
      ...frontmatter,
      images: [imagePath],
    },
  } as Metadata
}

export const generateStaticParams = async () => {
  const pages = await getAllContents('pages')
  return [
    { slug: [] as string[] },
    ...pages.map((slug) => ({
      slug: slug[slug.length - 1] === 'index' ? slug.slice(0, -1) : slug,
    })),
  ]
}

const Page = async ({ params }: Props) => {
  const { slug } = await params
  const filePath = getFilePath(slug)

  const { success, content } = await getContent('pages', filePath)

  if (!success) {
    return notFound()
  }

  return <Container className="mdx max-w-2xl pb-20">{content.content}</Container>
}

export default Page
