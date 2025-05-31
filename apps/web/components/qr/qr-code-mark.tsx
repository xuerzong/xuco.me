import { BinaryCode } from './qr-code-faker'

const qrMatrix = new Array(21).fill(0).map(() => new Array(21).fill(0))
const maskMatrix = new Array(6).fill(0).map(() => new Array(6).fill(0))

type MarkFunction = (pos: { i: number; j: number }) => boolean

const markFunctions: Record<string, MarkFunction> = {
  '111': ({ i, j }) => {
    return j % 3 === 0
  },
  '100': ({ i, j }) => {
    return i % 2 === 0
  },
  '110': ({ i, j }) => {
    return (i + j) % 3 === 0
  },
  '010': ({ i, j }) => {
    return (((i * j) % 3) + i + j) % 2 === 0
  },
  '101': ({ i, j }) => {
    return (i + j) % 2 === 0
  },
  '011': ({ i, j }) => {
    return (((i * j) % 3) + i * j) % 2 === 0
  },
  '001': ({ i, j }) => {
    return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
  },
  '000': ({ i, j }) => {
    return ((i * j) % 2) + ((i * j) % 3) === 0
  },
}

const featureFunctions: Record<string, MarkFunction> = {
  finders: ({ i, j }) => {
    return (
      (i < 7 && j < 7) ||
      (i < 7 && j >= qrMatrix[0].length - 7) ||
      (i >= qrMatrix.length - 7 && j < 7)
    )
  },
  separators: ({ i, j }) => {
    return (
      (i === 6 && j < qrMatrix[0].length - 7) ||
      (j === 6 && i < qrMatrix.length - 7) ||
      (i === qrMatrix.length - 7 && j < qrMatrix[0].length - 7)
    )
  },
  timingPatterns: ({ i, j }) => {
    return (
      (i === 6 && j >= 7 && j < qrMatrix[0].length - 7) ||
      (j === 6 && i >= 7 && i < qrMatrix.length - 7)
    )
  },
  alignmentPatterns: ({ i, j }) => {
    return (
      i >= 7 && i < qrMatrix.length - 7 && j >= 7 && j < qrMatrix[0].length - 7 && (i + j) % 2 === 0
    )
  },
  formatInformation: ({ i, j }) => {
    return (
      (i === 8 && j >= 7 && j < qrMatrix[0].length - 7) ||
      (j === 8 && i >= 7 && i < qrMatrix.length - 7)
    )
  },
  versionInformation: ({ i, j }) => {
    return (i >= qrMatrix.length - 7 && j < 7) || (j >= qrMatrix[0].length - 7 && i < 7)
  },
}

interface QRCodeMarkProps {
  value: string
}

export const QRCodeMarkCell: React.FC<QRCodeMarkProps> = ({ value = '' }) => {
  if (!markFunctions[value]) {
    return null
  }
  return (
    <BinaryCode
      value={maskMatrix.map((row, i) =>
        row.map((_, j) => {
          return markFunctions[value]({ i, j }) ? 1 : 0
        })
      )}
    />
  )
}

export const QRCodeMark: React.FC<QRCodeMarkProps> = ({ value = '' }) => {
  return (
    <BinaryCode
      value={qrMatrix.map((row, i) =>
        row.map((_, j) => {
          if (featureFunctions['finders']({ i, j })) {
            return 0
          }
          if (featureFunctions['separators']({ i, j })) {
            return 0
          }
          if (featureFunctions['timingPatterns']({ i, j })) {
            return 0
          }
          // if (featureFunctions['alignmentPatterns']({ i, j })) {
          //   return 0
          // }
          if (markFunctions[value]) {
            return markFunctions[value]({ i, j }) ? 1 : 0
          }
          return 0
        })
      )}
    />
  )
}
