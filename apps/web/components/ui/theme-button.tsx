'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { SunIcon, MoonIcon } from 'lucide-react'

enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export const ThemeButton: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const isDarkTheme = theme === Theme.Dark || resolvedTheme === Theme.Dark

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative z-40 md:z-0 p-2 bg-gray-200 dark:bg-gray-900 rounded"
      aria-label="theme-btn"
      onClick={() => setTheme(isDarkTheme ? Theme.Light : Theme.Dark)}
    >
      {isDarkTheme ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
    </motion.button>
  )
}
