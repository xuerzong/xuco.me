import { type PropsWithChildren, forwardRef } from 'react'
import { cn } from 'libs/utils/cn'

interface Props {
  className?: string
}

export const Container = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ className, ...restProps }, ref) => {
    return <div ref={ref} className={cn('max-w-5xl mx-auto px-4', className)} {...restProps} />
  }
)

Container.displayName = 'Container'

export default Container
