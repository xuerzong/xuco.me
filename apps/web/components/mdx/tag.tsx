interface TagProps {
  color: 'green' | 'yellow' | 'red'
}

import { cn } from 'libs/utils/cn'

export const Tag: React.FC<React.PropsWithChildren<TagProps>> = ({ color, ...restProps }) => {
  return (
    <span
      className={cn('text-xs font-bold font-mono px-1 rounded', {
        'bg-green-300 text-green-900': color === 'green',
        'bg-yellow-300 text-yellow-900': color === 'yellow',
        'bg-red-300 text-red-900': color === 'red',
      })}
      {...restProps}
    />
  )
}
