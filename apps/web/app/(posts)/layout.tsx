import Container from 'components/ui/container'

const PostsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Container className="mdx max-w-2xl space-x-4 pt-6 pb-20">{children}</Container>
}

export default PostsLayout
