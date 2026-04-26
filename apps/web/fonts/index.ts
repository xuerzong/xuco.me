import { Geist, Geist_Mono, Roboto } from 'next/font/google'

const GeistFont = Geist({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const GeistMonoFont = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

const RobotoFont = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const fonts = { GeistMonoFont, GeistFont, RobotoFont }

export default fonts
