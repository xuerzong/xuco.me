'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { qrcodegen } from 'libs/qr/codegen'
import { getFeatureFunctions, Position, QRConfig } from './utils'
import { QRCode } from './qr'

interface QRCodeContextState {
  qr: QRCode
  value: string
  onChange: (value: string) => void
  QRCodeCells: number[][]
  QR_CONFIG: QRConfig
  isInSpecialRegion: (type: string, position: Position) => boolean
}

const QRCodeContext = React.createContext<QRCodeContextState | null>(null)

export const QRCodeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [QRCodeValue, setQRCodeValue] = useState('Hello world'.repeat(10))

  const qr = useMemo(() => {
    return new QRCode(QRCodeValue)
  }, [QRCodeValue])

  const cells = useMemo(() => {
    return qr.cells
  }, [qr])

  const QR_CONFIG = useMemo(() => {
    return {
      size: cells.length,
      cellSize: 20,
    }
  }, [cells])

  // @ts-ignore
  const value: QRCodeContextState = {
    qr,
    QRCodeCells: cells,
    value: QRCodeValue,
    onChange: (value: string) => {
      setQRCodeValue(value)
    },
    QR_CONFIG,
  }
  return <QRCodeContext.Provider value={value}>{children}</QRCodeContext.Provider>
}

export const useQRCode = () => {
  const context = React.useContext(QRCodeContext)
  if (context === null) {
    throw new Error('useQRCode must be used in <QRCodeProvider />')
  }
  return context
}
