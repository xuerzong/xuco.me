import type { Metadata } from 'next'
import ThemeProvider from 'libs/providers/theme'
import fonts from 'fonts'
import CONFIG from 'constants/config'
import 'styles/index.css'
import Script from 'next/script'
import { Header } from 'components/layouts/header'
import { Footer } from 'components/layouts/footer'

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

interface LayoutProps {
  params: Promise<{}>
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = async ({ children }) => {
  return (
    <html lang="en-US" className={fonts.GeistFont.className} suppressHydrationWarning>
      <body className={`${fonts.GeistMonoFont.variable} bg-background text-foreground`}>
        <Script
          src="https://umami.xuco.me/script.js"
          data-website-id="59860341-b1d7-416c-869d-81daceda703e"
        />
        <ThemeProvider>
          <Header />
          <main className="pt-12">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default Layout
