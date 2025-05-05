import Container from 'components/ui/container'

interface PostHeaderProps {
  title: string
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title }) => {
  return (
    <div className="sticky top-12 z-10 py-2 bg-background border-b border-border">
      <Container>
        <h1 className="text-xl font-bold">{title}</h1>
      </Container>
    </div>
  )
}
