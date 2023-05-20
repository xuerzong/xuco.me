export function getQueryString(params: object = {}): string {
  return Object.keys(params)
    .reduce((arr: string[], key: string) => {
      if (params[key] !== undefined) {
        return arr.concat(`${key}=${encodeURIComponent(params[key])}`)
      }
      return arr
    }, [])
    .join('&')
}

export function buildUrl(url: string, params: object = {}): string {
  const queryString = getQueryString(params)
  return `${url}${queryString && '?' + queryString}`
}

export function safeDecodeURI(s: string): string {
  try {
    return decodeURI(s)
  } catch (e) {
    console.error(e)
  }
  return s
}

export const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  }
  return ''
}
