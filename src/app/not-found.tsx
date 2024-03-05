import Container from '@/components/Container'

const NotFound = () => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h1>This page is not found...</h1>
      <div className="my-16">
        <a href="/" className="py-2 px-4 bg-primary-600 text-white">
          Go Back
        </a>
      </div>
    </Container>
  )
}

export default NotFound
