import Table from './table.new'
import Image from 'next/image'
import { Link } from './link.new'
import Pre from './pre.new'
import H2 from './h2.new'
import H3 from './h3.new'
import P from './p.new'
import { Li } from './li'
import { Ul } from './ul'
import * as qr from '../qr'

type MDXComponents = any

const mdxComponents = {
  p: P,
  a: Link,
  pre: Pre,
  Image,
  table: Table,
  h2: H2,
  h3: H3,
  tr: Table.Tr,
  th: Table.Th,
  td: Table.Td,
  li: Li,
  ul: Ul,
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => {
    return <ol className={`list-decimal list-inside space-y-2 mb-4`} {...props} />
  },
  ...qr,
} as MDXComponents

export default mdxComponents
