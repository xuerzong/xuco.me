import { type Metadata } from 'next'
import { About } from './_components/about'
import { Contact } from './_components/contact'
import { Hero } from './_components/hero.new'

export const generateMetadata = async () => {
  return {} as Metadata
}

const Page = async () => {
  return (
    <>
      <Hero />
      <About />
      <Contact />
    </>
  )
}

export default Page
