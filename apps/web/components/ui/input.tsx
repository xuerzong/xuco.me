import React from 'react'
import { cn } from 'libs/utils/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...restProps }, ref) => {
  return (
    <input
      ref={ref}
      {...restProps}
      className={cn(
        'border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary',
        className
      )}
    />
  )
})
