'use client'

import { useMemo } from 'react'
import { featureFunctions, allFeatures, maskFunctions, getMaskNo } from './utils'
import { useQRCode } from './provider'

const featureColors: Record<string, string> = {
  finders: 'rgba(239, 68, 68, 0.6)', // red
  separators: 'rgba(34, 197, 94, 0.6)', // green
  timingPatterns: 'rgba(59, 130, 246, 0.6)', // blue
  formatInformation: 'rgba(234, 179, 8, 0.6)', // yellow
  darkModule: 'red', // red
}

interface QRCodeDecoderProps {
  value: string
  features?: string[]
  xorMask?: boolean
  paths?: string[]
}

const isFeature = ({ i, j }: { i: number; j: number }) => {
  let feature = ''
  for (let k = 0; k < allFeatures.length; k++) {
    const key = allFeatures[k]
    if (featureFunctions[key]({ i, j })) {
      feature = key
      break
    }
  }
  return Boolean(feature)
}

export const QRCodeDecoder: React.FC<QRCodeDecoderProps> = ({
  features = [],
  xorMask = false,
  paths = [],
}) => {
  const { qr, QR_CONFIG } = useQRCode()

  const targetCells = useMemo(() => {
    if (!xorMask) {
      return qr.cells
    }

    return qr.cells.map((row, i) =>
      row.map((cell, j) => {
        let feature = ''
        for (let k = 0; k < allFeatures.length; k++) {
          const key = allFeatures[k]
          if (featureFunctions[key]({ i, j })) {
            feature = key
            break
          }
        }
        return isFeature({ i, j })
          ? cell
          : (maskFunctions[getMaskNo(qr.cells)]({ i, j }) ? 1 : 0) ^ cell
      })
    )
  }, [qr, xorMask])

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

  const traversalRecord = useMemo(() => {
    return qr.getTraversalRecord()
  }, [qr])

  const readPaths = useMemo(() => {
    return qr.generateReadPaths()
  }, [qr])

  const encodingModePaths = useMemo(() => {
    return qr.generateEncodingModePaths()
  }, [qr])

  const decodingLengthPaths = useMemo(() => {
    return qr.generateDecodingLengthPaths()
  }, [qr])

  const byteContentPaths = useMemo(() => {
    return qr.generateDecodingContentPath()
  }, [qr])

  return (
    <div className="relative flex items-center justify-center cursor-pointer">
      <div className="inline-block p-6 my-4 bg-white rounded">
        <svg
          viewBox={`-10 -10 ${targetCells[0].length * QR_CONFIG.cellSize + 2 * QR_CONFIG.cellSize} ${targetCells.length * QR_CONFIG.cellSize + 2 * QR_CONFIG.cellSize}`}
          width={targetCells[0].length * QR_CONFIG.cellSize}
          height={targetCells.length * QR_CONFIG.cellSize}
        >
          {targetCells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * QR_CONFIG.cellSize}
                y={rowIndex * QR_CONFIG.cellSize}
                width={QR_CONFIG.cellSize}
                height={QR_CONFIG.cellSize}
                fill={col ? 'black' : 'white'}
              />
            ))
          )}

          {targetCells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * QR_CONFIG.cellSize}
                y={rowIndex * QR_CONFIG.cellSize}
                width={QR_CONFIG.cellSize}
                height={QR_CONFIG.cellSize}
                {...(getProperties(colIndex, rowIndex) || {})}
              />
            ))
          )}

          {paths.includes('readOrder') &&
            readPaths.map((path, index) => (
              <line
                key={index}
                {...path}
                stroke="orange"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            ))}

          {paths.includes('encodingMode') &&
            encodingModePaths.map((path, index) => (
              <line
                key={`encoding-${index}`}
                {...path}
                stroke="blue"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}

          {paths.includes('decodingLength') &&
            decodingLengthPaths.map((path, index) => (
              <line
                key={`decoding-${index}`}
                {...path}
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}

          {paths.includes('content') &&
            byteContentPaths.map((path, index) => (
              <line
                key={`decoding-${index}`}
                {...path}
                stroke="purple"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
        </svg>
      </div>
    </div>
  )
}
