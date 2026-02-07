import { CodeIcon, HeartIcon, MapPinIcon } from 'lucide-react'
import NextImage from 'next/image'
import { cn } from 'libs/utils/cn'
import { Container } from 'components/ui/container'
import { Globe } from 'components/ui/globe'
import { Marquee } from 'components/ui/marquee'

const stacks = [
  'javascript',
  'typescript',
  'react',
  'nextjs',
  'vue',
  'postgresql',
  'mysql',
  'prisma',
]

const hobbies = [
  {
    name: 'Photography',
    icon: (
      <NextImage
        src="/images/emoji/camera.png"
        width={32}
        height={32}
        alt="camera"
        className="w-6 h-6 inline-block"
      />
    ),
  },
  {
    name: 'Biking',
    icon: (
      <NextImage
        src="/images/emoji/man-biking.png"
        width={32}
        height={32}
        alt="biking"
        className="w-6 h-6 inline-block"
      />
    ),
  },
  {
    name: 'Walking',
    icon: (
      <NextImage
        src="/images/emoji/walking.png"
        width={32}
        height={32}
        alt="walking"
        className="w-6 h-6 inline-block"
      />
    ),
  },
  {
    name: 'Cooking',
    icon: (
      <NextImage
        src="/images/emoji/fried_egg.png"
        width={32}
        height={32}
        alt="cooking"
        className="w-6 h-6 inline-block"
      />
    ),
  },
]

const secs = [
  {
    key: 'location',
    name: 'Beijing',
    icon: <MapPinIcon className="w-6 h-6 inline-block" />,
    className: 'col-span-3 md:col-span-2 pb-0',
    children: (
      <div className="relative h-[320px] overflow-hidden">
        <Globe className="w-[320px] md:w-[480px]  top-0 left-1/2 -translate-x-1/2" />
      </div>
    ),
  },
  {
    key: 'hobby',
    name: 'Hobbies',
    icon: <HeartIcon className="w-6 h-6 inline-block" />,
    className: 'col-span-3 md:col-span-1',
    children: (
      <div className="flex flex-col space-y-4">
        {hobbies.map((hobby) => (
          <div
            key={hobby.name}
            className="bg-background border-1 border-transparent rounded p-4 flex items-center space-x-2 hover:border-primary hover:text-primary"
          >
            {hobby.icon}
            <span>{hobby.name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'stack',
    name: 'Stack',
    icon: <CodeIcon className="w-6 h-6 inline-block" />,
    className: 'col-span-3 md:col-span-3',
    children: (
      <Marquee pauseOnHover className="[--duration:20s] mb-4">
        {stacks.map((stack) => (
          <div
            key={stack}
            className="h-[64px] w-[64px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
          >
            <NextImage width={48} height={48} src={`/images/stack/${stack}.svg`} alt={stack} />
          </div>
        ))}
      </Marquee>
    ),
  },
]

export const About = () => {
  return (
    <Container className="max-w-3xl py-6">
      <h2 className="flex items-center justify-center text-xl font-bold space-x-2 mb-8">
        <span className="text-primary">-</span>
        <span>About Me</span>
        <span className="text-primary">-</span>
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {secs.map((sec) => (
          <div key={sec.key} className={cn('bg-primary-foreground p-6 rounded', sec.className)}>
            <div className="flex items-center space-x-2 font-bold mb-6">
              {sec.icon}
              <span>{sec.name}</span>
            </div>
            {sec.children}
          </div>
        ))}
      </div>
    </Container>
  )
}
