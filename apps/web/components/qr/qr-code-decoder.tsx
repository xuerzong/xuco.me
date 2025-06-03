'use client'

import { qrcodegen } from 'libs/qr/codegen'
import { useMemo } from 'react'
import { featureFunctions, allFeatures, maskFunctions, getMaskNo, generateReadPaths } from './utils'

const featureColors: Record<string, string> = {
  finders: 'rgba(239, 68, 68, 0.6)', // red
  separators: 'rgba(34, 197, 94, 0.6)', // green
  timingPatterns: 'rgba(59, 130, 246, 0.6)', // blue
  formatInformation: 'rgba(234, 179, 8, 0.6)', // yellow
  darkModule: 'red', // red
}

const cellWidth = 10
const cellHeight = 10

interface QRCodeDecoderProps {
  features?: string[]
  applyMask?: boolean
  showReadPaths?: boolean
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
  applyMask = false,
  showReadPaths = false,
}) => {
  const cells = useMemo(
    () =>
      qrcodegen.QrCode.encodeText('hello world', qrcodegen.QrCode.Ecc.LOW)
        .getModules()
        .map((row) => row.map((cell) => (cell ? 1 : 0))),
    []
  )

  const targetCells = useMemo(() => {
    if (!applyMask) {
      return cells
    }

    return cells.map((row, i) =>
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
          : (maskFunctions[getMaskNo(cells)]({ i, j }) ? 1 : 0) ^ cell
      })
    )
  }, [cells, applyMask])

  const getProperties = (x: number, y: number) => {
    let feature = ''
    for (let i = 0; i < features.length; i++) {
      const key = features[i]
      if (featureFunctions[key]({ i: y, j: x })) {
        feature = key
        break
      }
    }
    return {
      fill: featureColors[feature] || 'transparent',
    }
  }

  const readPaths = useMemo(() => {
    const paths = generateReadPaths()
    return paths
  }, [targetCells])

  return (
    <div className="relative flex items-center justify-center cursor-pointer">
      <div className="inline-block p-6 my-4 bg-white rounded">
        <svg
          viewBox={`0 0 ${targetCells[0].length * cellWidth} ${targetCells.length * cellHeight}`}
          width={targetCells[0].length * cellWidth}
          height={targetCells.length * cellHeight}
        >
          {targetCells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth}
                y={rowIndex * cellHeight}
                width={cellWidth}
                height={cellHeight}
                fill={col ? 'black' : 'white'}
              />
            ))
          )}

          {targetCells.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth}
                y={rowIndex * cellHeight}
                width={cellWidth}
                height={cellHeight}
                {...(getProperties(colIndex, rowIndex) || {})}
              />
            ))
          )}

          {showReadPaths &&
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
        </svg>
      </div>
    </div>
  )
}
