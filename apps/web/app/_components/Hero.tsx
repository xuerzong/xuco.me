'use client'

import { motion, type Variants } from 'framer-motion'
import NextImage from 'next/image'

import Container from 'components/ui/container'
import { Fragment } from 'react'
import { GridPattern } from '@/components/ui/grid-pattern'

const animation: Variants = {
  initial: { opacity: 0, translateY: 32 },
  animate: { opacity: 1, translateY: 0 },
}

export const Hero: React.FC = () => {
  return (
    <Fragment>
      <Container className="max-w-screen-md relative flex flex-col-reverse justify-center md:justify-start md:flex-row items-center py-12">
        <div className="flex flex-col mr-0 md:mr-auto items-center md:items-start">
          <motion.h2 className="text-4xl mb-8 font-bold" {...animation} transition={{ delay: 0.1 }}>
            <NextImage
              src="/images/emoji/wave.png"
              alt="wave"
              width={32}
              height={32}
              className="inline-block mr-2"
            />
            <span>我叫</span>
            <span className="relative inline-block text-primary">徐聪</span>
          </motion.h2>

          <motion.p className="mb-1" {...animation} transition={{ delay: 0.2 }}>
            我希望所有爱我的人和我爱的人
            <span className="text-primary">身体健康</span>,
          </motion.p>

          <motion.p className="mb-8" {...animation} transition={{ delay: 0.2 }}>
            还有就是<span className="text-primary">世界和平</span>。
          </motion.p>
        </div>
        <motion.div className="relative" {...animation}>
          <NextImage
            className="relative mb-8 z-10"
            width={180}
            height={180}
            src="/static/assets/images/avatar.png"
            alt="avatar"
          />
        </motion.div>
      </Container>
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className="stroke-primary/20 [mask-image:radial-gradient(360px_circle_at_top,white,transparent)]"
      />
    </Fragment>
  )
}
