interface TagProps {
  color: 'green' | 'red'
}
import { cn } from 'libs/utils/cn'

export const Tag: React.FC<React.PropsWithChildren<TagProps>> = ({ color, ...restProps }) => {
  return (
    <span
      className="text-xs px-1 py-px rounded"
      style={{
        color: color === 'green' ? 'var(--success)' : 'var(--danger)',
      }}
      {...restProps}
    />
  )
}
