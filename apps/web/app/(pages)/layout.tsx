import Container from 'components/ui/container'

const PagesLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Container className="mdx max-w-2xl pb-20">{children}</Container>
}

export default PagesLayout
