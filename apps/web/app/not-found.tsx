import type { Metadata } from 'next'
import Container from 'components/ui/container'

export const metadata: Metadata = {
  title: 'Not Found',
  description: '页面找不到了...',
}

const NotFound = () => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h1>页面找不到了...</h1>
      <div className="my-16">
        <a href="/" className="py-2 px-4 text-sm bg-primary text-primary-foreground rounded">
          返回首页
        </a>
      </div>
    </Container>
  )
}

export default NotFound
