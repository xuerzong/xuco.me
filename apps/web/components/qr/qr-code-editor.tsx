'use client'

import { Input } from 'components/ui/input'
import { QrCode } from './qr-code'
import { useState } from 'react'

export const QrCodeEditor = () => {
  const [value, setValue] = useState('hello world')
  return (
    <div className="flex flex-col items-center space-y-4">
      <QrCode className="shrink-0" value={value} />

      <div className="flex flex-col space-y-2 w-full p-6 bg-accent rounded">
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium">字符串</label>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder="请输入"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium">字符串</label>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder="请输入"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium">字符串</label>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder="请输入"
          />
        </div>
      </div>
    </div>
  )
}
