export const qrMatrix = new Array(21).fill(0).map(() => new Array(21).fill(0))
export const maskMatrix = new Array(6).fill(0).map(() => new Array(6).fill(0))

interface Position {
  i: number
  j: number
}

type MarkFunction = (pos: Position) => boolean

export const allFeatures = [
  'finders',
  'separators',
  'timingPatterns',
  'formatInformation',
  'darkModule',
]

export const QR_CONFIG = {
  size: 21,
  cellWidth: 10,
  cellHeight: 10,
  finderSize: 7,
}

export const maskFunctions: Record<string, MarkFunction> = {
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

export const featureFunctions: Record<string, MarkFunction> = {
  finders: ({ i, j }) => {
    return (
      (i < 7 && j < 7) ||
      (i < 7 && j >= qrMatrix[0].length - 7) ||
      (i >= qrMatrix.length - 7 && j < 7)
    )
  },
  separators: ({ i, j }) => {
    return (
      (i === 7 && j <= 7) ||
      (j === 7 && i <= 7) ||
      (i >= qrMatrix.length - 7 && j === 7) ||
      (i === qrMatrix.length - 8 && j <= 7) ||
      (i === 7 && j >= qrMatrix[0].length - 7) ||
      (j === qrMatrix[0].length - 8 && i <= 7)
    )
  },
  timingPatterns: ({ i, j }) => {
    return (
      (i === 6 && j >= 7 && j < qrMatrix[0].length - 7) ||
      (j === 6 && i >= 7 && i < qrMatrix.length - 7)
    )
  },
  formatInformation: ({ i, j }) => {
    return (
      (j <= 8 && i === 8) ||
      (j >= qrMatrix[0].length - 8 && i === 8) ||
      (i <= 7 && j === 8) ||
      (i >= qrMatrix.length - 7 && j === 8)
    )
  },
  darkModule: ({ i, j }) => {
    return j === 8 && i === qrMatrix.length - 8
  },
}

export const getMaskNo = (cells: number[][]) => {
  return `${cells[8][2]}${cells[8][3]}${cells[8][4]}`
}

interface PathSegment {
  x1: number
  y1: number
  x2: number
  y2: number
}

// 生成QR码读取路径
export const generateReadPaths = (): PathSegment[] => {
  const { size, cellWidth, cellHeight } = QR_CONFIG
  const paths: PathSegment[] = []

  // 当前处理的两个单元格
  let currentCells: Position[] = [
    { i: size - 1, j: size - 1 },
    { i: size - 1, j: size - 2 },
  ]

  // 移动方向: 1表示向上, -1表示向下
  let direction = 1
  // 已处理的单元格数量
  let processedCells = 0
  // 总单元格数量
  const totalCells = size * size

  interface PathPoint {
    x: number
    y: number
  }

  // 辅助函数: 根据位置计算中心点坐标
  const getCenterPoint = ({ i, j }: Position): PathPoint => ({
    x: j * cellWidth + cellWidth / 2,
    y: i * cellHeight + cellHeight / 2,
  })

  const getNextCells = (current: Position[], iStep: number, jStep: number): Position[] => {
    const next = current.map(({ i, j }) => ({
      i: i - iStep,
      j: j - jStep,
    }))

    const [right, left] = next

    // separators
    if (right.j === 6) {
      return next.map(({ i, j }) => ({
        i,
        j: j - 1,
      }))
    }

    return next
  }

  const isInSpecialRegion = (pos: Position): boolean => {
    return Object.values(featureFunctions).some((func) => func(pos))
  }

  while (processedCells < totalCells) {
    const [p1, p2] = currentCells.map(getCenterPoint)
    paths.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y })

    let iStep = direction
    let jStep = 0

    if (
      (direction === 1 && currentCells[0].i === 0) ||
      (direction === -1 && currentCells[0].i === size - 1)
    ) {
      direction *= -1
      jStep = 2
      iStep = 0
    }

    let nextCells = getNextCells(currentCells, iStep, jStep)

    while (
      processedCells < totalCells &&
      (isInSpecialRegion(nextCells[0]) || isInSpecialRegion(nextCells[1]))
    ) {
      processedCells += 2

      iStep = direction
      jStep = 0

      if (
        (direction === 1 && nextCells[0].i === 0) ||
        (direction === -1 && nextCells[0].i === size - 1)
      ) {
        direction *= -1
        jStep = 2
        iStep = 0
      }

      nextCells = getNextCells(nextCells, iStep, jStep)
    }

    const p3 = getCenterPoint(currentCells[1])
    const p4 = getCenterPoint(nextCells[0])
    paths.push({ x1: p3.x, y1: p3.y, x2: p4.x, y2: p4.y })

    currentCells = nextCells
    processedCells += 2
  }

  return paths
}
