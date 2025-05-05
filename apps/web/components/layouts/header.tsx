'use client'

import NextLink from 'next/link'
import cls from 'classnames'

import Container from 'components/ui/container'
import CONFIG from 'constants/config'
import { ThemeButton } from '../ui/theme-button'
import { ClientOnly } from '../client-only'

export const Header = () => {
  return (
    <header
      className={cls(
        'fixed w-full z-50 overflow-hidden h-12 bg-background/20 border-b border-border transition-height duration-150',
        'backdrop-blur-md backdrop-filter'
      )}
    >
      <Container className="flex items-center h-full">
        <NextLink href="/">
          <h1 className="font-bold w-32 uppercase">{CONFIG.WEB_AUTHOR}</h1>
        </NextLink>

        <ClientOnly>
          <div className="md:w-32 text-right ml-auto">
            <ThemeButton />
          </div>
        </ClientOnly>
      </Container>
    </header>
  )
}
