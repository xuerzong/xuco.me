import CONFIG from 'constants/config'

const robots = () => {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
    host: CONFIG.SITE_URL,
  }
}

export default robots
