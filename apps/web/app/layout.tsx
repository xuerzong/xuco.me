import type { Metadata } from 'next'
import ThemeProvider from '@/libs/providers/theme'
import fonts from '@/fonts'
import CONFIG from '@/constants/config'
import Header from './_components/Header'
import 'styles/index.css'
import Footer from './_components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: {
    default: CONFIG.SITE_TITLE,
    template: `%s | ${CONFIG.SITE_TITLE}`,
  },
  description: CONFIG.SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  creator: 'xuerzong',
  openGraph: {
    title: CONFIG.SITE_TITLE,
    description: CONFIG.SITE_DESCRIPTION,
    url: CONFIG.SITE_URL,
    siteName: CONFIG.SITE_TITLE,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.SITE_TITLE,
    description: CONFIG.SITE_DESCRIPTION,
    site: `@${CONFIG.TWITTER}`,
    siteId: CONFIG.TWITTER_ID,
    creator: `@${CONFIG.TWITTER}`,
    creatorId: CONFIG.TWITTER_ID,
  },
}

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="en" className={fonts.RecursiveFont.className} suppressHydrationWarning>
      <body
        className={`${fonts.JetBrainsMono.variable} bg-white text-slate-900 dark:bg-dark dark:text-slate-50`}
      >
        <Script
          src="https://umami.xuco.me/script.js"
          data-website-id="59860341-b1d7-416c-869d-81daceda703e"
        />
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default Layout
