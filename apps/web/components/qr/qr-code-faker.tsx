'use client'

import { qrcodegen } from 'libs/qr/codegen'
import { useMemo } from 'react'
import { cn } from 'libs/utils/cn'

const highlights = ['Finders', 'Separators', 'Timing', 'Mask'] as const
type Highlight = (typeof highlights)[number]

interface QrCodeFakerProps {
  highlight?: Highlight
}

export const QrCodeFaker: React.FC<QrCodeFakerProps> = ({ highlight = 'Finders' }) => {
  const cells = useMemo(
    () => qrcodegen.QrCode.encodeText('hello world', qrcodegen.QrCode.Ecc.LOW).getModules(),
    []
  )

  const isHighlightCell = (x: number, y: number) => {
    switch (highlight) {
      case 'Finders':
        return (x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14)
      case 'Separators':
        return (
          (x === 7 && y <= 7) ||
          (x <= 7 && y === 7) ||
          (x >= 14 && y === 7) ||
          (x === 13 && y <= 7) ||
          (x === 7 && y >= 14) ||
          (x <= 7 && y === 13)
        )
      case 'Timing':
        return (x === 6 && y < 13 && y > 7) || (y === 6 && x < 13 && x > 7)
      case 'Mask':
        return (x <= 7 && y === 8) || (x >= 14 && y === 8)
      default:
        return false
    }
  }

  const getBgColor = (x: number, y: number) => {
    if (isHighlightCell(x, y)) {
      return 'bg-green-600'
    }
  }

  return (
    <div className="relative flex items-center justify-center cursor-pointer">
      <div className="inline-block p-6 my-4 bg-white rounded">
        <div className="grid grid-cols-[21]">
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((col, colIndex) => (
                <div key={colIndex} className={cn('w-2 h-2', col ? 'bg-black' : 'bg-white')}></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inline-block p-6 rounded opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="grid grid-cols-[21]">
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={cn('w-2 h-2 opacity-50', getBgColor(colIndex, rowIndex))}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface BinaryCodeProps {
  value: [[0, 0, 1]]
}

export const BinaryCode: React.FC<BinaryCodeProps> = ({ value }) => {
  return (
    <div
      style={{
        gridTemplateColumns: `repet(${value[0].length || 0}, minmax(0, 1fr))`,
      }}
      className="grid grid-cols-[21]"
    >
      {value.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((col, colIndex) => (
            <div key={colIndex} className={cn('w-2 h-2', col ? 'bg-black' : 'bg-white')}></div>
          ))}
        </div>
      ))}
    </div>
  )
}
