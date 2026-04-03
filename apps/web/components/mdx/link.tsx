import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'
import { cn } from 'libs/utils/cn'
import { CornerRightUpIcon } from 'lucide-react'

export const Link: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  className,
  ...restProps
}) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')
  const aClassName = 'underline underline-offset-4'

  if (isInternalLink) {
    return (
      <NextLink href={href}>
        <span className={cn(className, aClassName)} {...restProps} />
      </NextLink>
    )
  }
  if (isAnchorLink) {
    return <a href={href} className={cn(className, aClassName)} {...restProps} />
  }

  return (
    <span className="inline-flex items-center">
      <a
        target="_blank"
        rel="noreferrer"
        href={href}
        className={cn(className, aClassName)}
        {...restProps}
      />
      <CornerRightUpIcon className="w-4 h-4 ml-1" strokeWidth={3} />
    </span>
  )
}

export default Link
