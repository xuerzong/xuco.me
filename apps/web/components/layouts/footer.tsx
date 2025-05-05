import Container from 'components/ui/container'
import NextLink from 'next/link'
import CONFIG from 'constants/config'

const footerLinks = [
  [
    {
      name: '首页',
      path: '/',
    },
    {
      name: '关于',
      path: '/about',
    },
    {
      name: '装备',
      path: '/uses',
    },
  ],
  [
    {
      name: 'GitHub',
      path: `https://github.com/${CONFIG.GITHUB}`,
    },
  ],
]

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3">
      {footerLinks.map((footerLink, footerLinkKey) => (
        <ul key={footerLinkKey}>
          {footerLink.map((link, linkKey) => (
            <li className="py-2 cursor-pointer" key={linkKey}>
              <NextLink href={link.path}>
                <span>{link.name}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

const FooterBanner = () => {
  return (
    <span className="inline-flex items-center space-x-2 font-bold text-sm">
      <span>©{new Date().getFullYear()} </span>
      <span className="uppercase">{CONFIG.WEB_AUTHOR}</span>
    </span>
  )
}

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <Container className="max-w-screen-md flex flex-col space-y-8 py-12">
        <FooterLinks />
        <FooterBanner />
      </Container>
    </footer>
  )
}
