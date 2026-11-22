import type { Metadata } from 'next'

type Options = {
  title: string
  description?: string
  image: string
}

export const createMetadata = ({ title, description, image }: Options): Metadata => ({
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: image }],
  },
  twitter: {
    title,
    description,
    images: [image],
  },
})
