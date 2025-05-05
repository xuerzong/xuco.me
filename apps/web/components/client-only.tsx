'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  fallback?: React.ReactNode
}

export const ClientOnly: React.FC<React.PropsWithChildren<ClientOnlyProps>> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
