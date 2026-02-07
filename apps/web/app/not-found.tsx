import type { Metadata } from 'next'
import Container from 'components/ui/container'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'This page is not found...',
}

const NotFound = () => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h1>This page is not found...</h1>
      <div className="my-16">
        <a href="/" className="py-2 px-4 text-sm bg-primary text-white rounded">
          Go Back
        </a>
      </div>
    </Container>
  )
}

export default NotFound
