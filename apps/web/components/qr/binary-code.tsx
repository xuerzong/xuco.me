'use client'

interface BinaryCodeProps {
  value: number[][]
  getProperties?: (x: number, y: number) => React.SVGProps<SVGRectElement>
}

const cellWidth = 10
const cellHeight = 10

export const BinaryCode: React.FC<BinaryCodeProps> = ({ value, getProperties }) => {
  return (
    <svg
      viewBox={`0 0 ${value[0].length * cellWidth} ${value.length * cellHeight}`}
      width={value[0].length * cellWidth}
      height={value.length * cellHeight}
    >
      {value.map((row, rowIndex) =>
        row.map((col, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * cellWidth}
            y={rowIndex * cellHeight}
            width={cellWidth}
            height={cellHeight}
            fill={col ? 'black' : 'white'}
            {...(getProperties?.(colIndex, rowIndex) || {})}
          />
        ))
      )}
    </svg>
  )
}
