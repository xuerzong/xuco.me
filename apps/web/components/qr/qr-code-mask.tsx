'use client'
import { useMemo } from 'react'
import { BinaryCode } from './binary-code'
import { maskMatrix, maskFunctions, featureFunctions } from './utils'
import { qrcodegen } from 'libs/qr/codegen'

interface QRCodeMarkProps {
  value: string
}

export const QRCodeMarkCell: React.FC<QRCodeMarkProps> = ({ value = '' }) => {
  if (!maskFunctions[value]) {
    return null
  }
  return (
    <BinaryCode
      value={maskMatrix.map((row, i) =>
        row.map((_, j) => {
          return maskFunctions[value]({ i, j }) ? 1 : 0
        })
      )}
    />
  )
}

const features = ['finders', 'separators', 'timingPatterns', 'formatInformation', 'darkModule']

export const QRCodeMask: React.FC<QRCodeMarkProps> = ({ value = '011' }) => {
  const cells = useMemo(
    () =>
      qrcodegen.QrCode.encodeText('hello world', qrcodegen.QrCode.Ecc.LOW)
        .getModules()
        .map((row) => row.map((cell) => (cell ? 1 : 0))),
    []
  )

  const getProperties = (x: number, y: number) => {
    const cell = cells[y][x]
    let feature = ''
    for (let i = 0; i < features.length; i++) {
      const key = features[i]
      if (featureFunctions[key]({ i: y, j: x })) {
        feature = key
        break
      }
    }

    if (feature) {
      return {
        fill: cell ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
      }
    }

    return {
      fill: maskFunctions[value]({ i: y, j: x }) ? 'rgba(0, 0, 0, 1)' : 'transparent',
    }
  }
  return (
    <div className="relative flex items-center justify-center cursor-pointer">
      <div className="inline-block p-6 my-4 bg-white rounded">
        <BinaryCode value={cells} getProperties={getProperties} />
      </div>
    </div>
  )
}
