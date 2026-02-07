'use client'

import { type PropsWithChildren } from 'react'

import { ThemeProvider as NextThemeProvider } from 'next-themes'

const themeProviderProps = {
  attribute: 'class',
  defaultTheme: 'system',
  storageKey: 'xuerzong-com-theme',
  enableSystem: true,
}

const ThemeProvider: React.FC<PropsWithChildren> = (props) => {
  return <NextThemeProvider {...props} {...themeProviderProps} />
}

export default ThemeProvider
