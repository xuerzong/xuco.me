import Table from './table'
import Image from 'next/image'
import { Link } from './link'
import Pre from './pre'
import H2 from './h2'
import H3 from './h3'
import P from './p'
import { Li } from './li'
import { Ul } from './ul'

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
} as MDXComponents

export default mdxComponents
