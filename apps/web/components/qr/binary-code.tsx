'use client'

import { useQRCode } from './provider'

interface BinaryCodeProps {
  value: number[][]
  getProperties?: (x: number, y: number) => React.SVGProps<SVGRectElement>
}

export const BinaryCode: React.FC<BinaryCodeProps> = ({ value, getProperties }) => {
  const { qr } = useQRCode()
  return (
    <svg
      viewBox={`0 0 ${value[0].length * qr.cellSize} ${value.length * qr.cellSize}`}
      width={value[0].length * qr.cellSize}
      height={value.length * qr.cellSize}
    >
      {value.map((row, rowIndex) =>
        row.map((col, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * qr.cellSize}
            y={rowIndex * qr.cellSize}
            width={qr.cellSize}
            height={qr.cellSize}
            fill={col ? 'black' : 'white'}
            {...(getProperties?.(colIndex, rowIndex) || {})}
          />
        ))
      )}
    </svg>
  )
}
