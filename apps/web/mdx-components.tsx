import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Table from 'components/mdx/table'
import { Link } from 'components/mdx/link'
import Pre from 'components/mdx/pre'
import { Tag } from 'components/mdx/tag'
import LogoASCII from 'components/mdx/logo-ascii'

const components = {
  p: (props) => <p className="mb-4 text-current" {...props} />,
  a: Link,
  pre: Pre,
  Image,
  table: Table,
  h1: (props) => <h1 className="text-2xl font-bold my-8" {...props} />,
  h2: (props) => <h2 className="text-primary-500 text-xl font-bold my-8" {...props} />,
  h3: (props) => <h3 className="text-lg font-bold mt-6 mb-6" {...props} />,
  tr: Table.Tr,
  th: Table.Th,
  td: Table.Td,
  li: ({ className = '', ...restProps }) => (
    <li className={`list-disc list-inside pl-4 mb-4 ${className}`} {...restProps} />
  ),
  ul: ({ className = '', ...restProps }) => (
    <ul className={`list-disc list-inside space-y-2 mb-4 ${className}`} {...restProps} />
  ),
  Tag,
  LogoASCII,
} as MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
