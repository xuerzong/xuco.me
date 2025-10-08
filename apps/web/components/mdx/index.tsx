import Table from './table'
import Image from 'next/image'
import { Link } from './link'
import Pre from './pre'

type MDXComponents = any

const mdxComponents = {
  p: (props) => <p className="mb-4 text-current" {...props} />,
  a: Link,
  pre: Pre,
  Image,
  table: Table,
  h2: (props) => <h2 className="text-primary-500 text-2xl font-bold mt-8 mb-8" {...props} />,
  h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
  tr: Table.Tr,
  th: Table.Th,
  td: Table.Td,
  li: ({ className = '', ...restProps }) => (
    <li className={`list-disc list-inside pl-4 text-sm ${className}`} {...restProps} />
  ),
  ul: ({ className = '', ...restProps }) => (
    <ul className={`list-disc list-inside space-y-2 ${className}`} {...restProps} />
  ),
} as MDXComponents

export default mdxComponents
