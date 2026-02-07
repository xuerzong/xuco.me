import { Geist, Geist_Mono } from 'next/font/google'

const GeistFont = Geist({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const GeistMonoFont = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

const fonts = { GeistMonoFont, GeistFont }

export default fonts
