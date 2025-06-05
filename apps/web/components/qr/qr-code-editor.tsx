'use client'

import { Input } from 'components/ui/input'
import { useQRCode } from './provider'

export const QRCodeEditor: React.FC = () => {
  const { value, onChange } = useQRCode()
  return (
    <div className="flex flex-col items-center space-y-4 sticky top-[64px] z-10">
      <div className="flex flex-col space-y-2 w-full p-6 bg-accent rounded">
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium">字符串</label>
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            placeholder="请输入"
          />
        </div>
      </div>
    </div>
  )
}
