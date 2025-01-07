'use client'

import { motion, type Variants } from 'framer-motion'
import NextImage from 'next/image'
import NextLink from 'next/link'

import Container from '@/components/Container'
import GridBackground from '@/components/GridBackground'
import { GithubIcon, XIcon } from '@/components/Icon'
import { SOCIAL_LINKS } from '@/constants/config'

const animation: Variants = {
  initial: { opacity: 0, translateY: 32 },
  animate: { opacity: 1, translateY: 0 },
}

const Hero: React.FC = () => {
  return (
    <GridBackground>
      <Container className="max-w-screen-md relative flex flex-col items-center justify-center py-32 min-h-screen">
        <motion.div className="relative" {...animation}>
          <NextImage
            className="relative mb-8 z-10"
            width={320}
            height={320}
            src="/static/assets/images/avatar.png"
            alt="avatar"
          />
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-300 dark:bg-primary-700 blur-3xl rounded-full" /> */}
        </motion.div>

        <motion.h2
          className="text-5xl md:text-7xl mb-12"
          {...animation}
          transition={{ delay: 0.1 }}
        >
          I am
          <span className="relative inline-block mx-2 py-2 font-bold text-primary">Xu Cong</span>
        </motion.h2>

        <motion.p
          className="mb-1 text-sm md:text-lg text-center"
          {...animation}
          transition={{ delay: 0.2 }}
        >
          I hope that the people I love and those who love me are in{' '}
          <span className="text-primary underline">good health</span>,
        </motion.p>

        <motion.p
          className="mb-8 text-sm md:text-lg text-center"
          {...animation}
          transition={{ delay: 0.2 }}
        >
          and that there is <span className="text-primary underline">peace</span> in the world.
        </motion.p>

        <motion.div {...animation} transition={{ delay: 0.3 }}>
          <ul className="flex items-center space-x-4">
            <li title="github" className="cursor-pointer">
              <NextLink href={`${SOCIAL_LINKS.GITHUB}`} target="_blank">
                <GithubIcon className="w-5 h-5 text-current" />
              </NextLink>
            </li>
            <li title="x" className="cursor-pointer">
              <NextLink href={`${SOCIAL_LINKS.TWITTER}`} target="_blank">
                <XIcon className="w-4 h-4 text-current" />
              </NextLink>
            </li>
          </ul>
        </motion.div>
      </Container>
    </GridBackground>
  )
}

export default Hero
