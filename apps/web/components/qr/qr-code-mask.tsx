'use client'

import { BinaryCode } from './binary-code'
import { maskMatrix, maskFunctions, featureFunctions } from './utils'
import { useQRCode } from './provider'
import { useMemo } from 'react'

const featureColors: Record<string, string> = {
  finders: 'rgba(239, 68, 68, 0.6)', // red
  separators: 'rgba(34, 197, 94, 0.6)', // green
  timingPatterns: 'rgba(59, 130, 246, 0.6)', // blue
  formatInformation: 'rgba(234, 179, 8, 0.6)', // yellow
  darkModule: 'red', // red
}

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
  const { qr } = useQRCode()

  const maskCells = useMemo(() => {
    return qr.generateMaskCells()
  }, [qr])

  const getProperties = (x: number, y: number) => {
    let feature = ''

    if (qr.isFinders({ i: y, j: x })) {
      feature = 'finders'
    }

    if (qr.isDarkModule({ i: y, j: x })) {
      feature = 'darkModule'
    }

    if (qr.isSeparators({ i: y, j: x })) {
      feature = 'separators'
    }

    if (qr.isTimingPatterns({ i: y, j: x })) {
      feature = 'timingPatterns'
    }

    if (qr.isFormatInformation({ i: y, j: x })) {
      feature = 'formatInformation'
    }

    return {
      fill: featureColors[feature] || 'transparent',
    }
  }

  return (
    <div className="relative flex items-center justify-center cursor-pointer">
      <div className="inline-block p-6 my-4 bg-white rounded">
        <svg
          viewBox={`0 0 ${qr.size * qr.cellSize} ${qr.size * qr.cellSize}`}
          width={qr.size * qr.cellSize}
          height={qr.size * qr.cellSize}
        >
          {qr.cells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * qr.cellSize}
                y={rowIndex * qr.cellSize}
                width={qr.cellSize}
                height={qr.cellSize}
                fill={col ? 'rgba(0, 0, 0, 0.2)' : 'white'}
              />
            ))
          )}
          {qr.cells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * qr.cellSize}
                y={rowIndex * qr.cellSize}
                width={qr.cellSize}
                height={qr.cellSize}
                {...(getProperties(colIndex, rowIndex) || {})}
              />
            ))
          )}
          {maskCells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * qr.cellSize}
                y={rowIndex * qr.cellSize}
                width={qr.cellSize}
                height={qr.cellSize}
                fill={col ? 'black' : 'transparent'}
              />
            ))
          )}
        </svg>
      </div>
    </div>
  )
}
