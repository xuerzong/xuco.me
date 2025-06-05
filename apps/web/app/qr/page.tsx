import { QRCodeProvider } from 'components/qr/provider'
import Container from 'components/ui/container'
import { getContent } from 'contents/queries'
import { notFound } from 'next/navigation'

const Page = async () => {
  const { success, content } = await getContent('pages', 'qr')
  if (!success) {
    return notFound()
  }

  return (
    <QRCodeProvider>
      <Container className="mdx max-w-screen-md pb-20">{content.content}</Container>
    </QRCodeProvider>
  )
}

export default Page
