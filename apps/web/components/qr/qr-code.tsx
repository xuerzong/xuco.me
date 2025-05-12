'use client'

import { getQRAsSVG } from 'libs/qr/api'
import { DEFAULT_SIZE } from 'libs/qr/const'
import { QRPropsSVG } from 'libs/qr/types'
import { useEffect, useState } from 'react'

export const QrCode: React.FC<QRPropsSVG> = (props) => {
  const { size = DEFAULT_SIZE } = props
  const [qrcode, setQrcode] = useState<JSX.Element | null>(null)
  useEffect(() => {
    getQRAsSVG(props).then(setQrcode)
  }, [props])

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      {qrcode}
    </div>
  )
}
