import { Container } from 'components/ui/container'
import { MailIcon } from 'lucide-react'

export const Contact = () => {
  return (
    <Container className="max-w-screen-md py-6">
      <h2 className="flex items-center justify-center text-xl font-bold space-x-2 mb-8">
        <span className="text-primary">-</span>
        <span>联系我</span>
        <span className="text-primary">-</span>
      </h2>
      <div className="flex flex-col items-center space-y-1 mb-8">
        <div className="inline-flex items-center space-x-2">
          <MailIcon className="w-4 h-4 inline-block" />
          <a href="mailto:hi@xuco.me">hi@xuco.me</a>
        </div>
      </div>
    </Container>
  )
}
