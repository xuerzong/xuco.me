import type { MetadataRoute } from 'next'
import CONFIG from 'constants/config'

const sitemap = async () => {
  const routes = ['/', '/uses', '/guestbook']

  return [
    ...routes.map((route) => ({
      url: `${CONFIG.SITE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    })),
  ] as MetadataRoute.Sitemap
}

export default sitemap
