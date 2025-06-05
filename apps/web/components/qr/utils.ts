export const qrMatrix = new Array(21).fill(0).map(() => new Array(21).fill(0))
export const maskMatrix = new Array(6).fill(0).map(() => new Array(6).fill(0))

export interface Position {
  i: number
  j: number
}

export type MarkFunction = (pos: Position) => boolean

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

export interface QRConfig {
  size: number
  cellSize: number
}

export const getFeatureFunctions = (config: {
  size: number
  cellSize: number
}): Record<string, MarkFunction> => {
  return {
    finders: ({ i, j }) => {
      return (i < 7 && j < 7) || (i < 7 && j >= config.size - 7) || (i >= config.size - 7 && j < 7)
    },
    separators: ({ i, j }) => {
      return (
        (i === 7 && j <= 7) ||
        (j === 7 && i <= 7) ||
        (i >= config.size - 7 && j === 7) ||
        (i === config.size - 8 && j <= 7) ||
        (i === 7 && j >= config.size - 7) ||
        (j === config.size - 8 && i <= 7)
      )
    },
    timingPatterns: ({ i, j }) => {
      return (
        (i === 6 && j >= 7 && j < config.size - 7) || (j === 6 && i >= 7 && i < config.size - 7)
      )
    },
    formatInformation: ({ i, j }) => {
      return (
        (j <= 8 && i === 8) ||
        (j >= config.size - 8 && i === 8) ||
        (i <= 7 && j === 8) ||
        (i >= config.size - 7 && j === 8)
      )
    },
    darkModule: ({ i, j }) => {
      return j === 8 && i === config.size - 8
    },
  }
}

export const getMaskNo = (cells: number[][]) => {
  return `${cells[8][2]}${cells[8][3]}${cells[8][4]}`
}

export interface PathSegment {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface TraversalRecord {
  position: Position
  order: number
  direction: number
}

export const generateReadPaths = (points: TraversalRecord[]): PathSegment[] => {
  const { cellWidth, cellHeight } = QR_CONFIG
  const paths: PathSegment[] = []

  interface PathPoint {
    x: number
    y: number
  }

  const getCenterPoint = ({ i, j }: Position): PathPoint => ({
    x: j * cellWidth + cellWidth / 2,
    y: i * cellHeight + cellHeight / 2,
  })

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i]
    const nextPoint = points[i + 1]
    const p1 = getCenterPoint(currentPoint.position)
    const p2 = getCenterPoint(nextPoint.position)
    paths.push({
      x1: p1.x,
      x2: p2.x,
      y1: p1.y,
      y2: p2.y,
    })
  }

  return paths
}

export const getReadPoint = (): TraversalRecord[] => {
  const { size } = QR_CONFIG
  const traversalHistory: TraversalRecord[] = []

  let currentCells: Position[] = [
    { i: size - 1, j: size - 1 },
    { i: size - 1, j: size - 2 },
  ]

  let order = 0

  let direction = 1
  let processedCells = 0
  const totalCells = size * size

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

  const recordTraversal = (cell: Position) => {
    if (cell.i < 0 || cell.i > QR_CONFIG.size || cell.j < 0 || cell.j > QR_CONFIG.size) {
      return
    }
    traversalHistory.push({
      position: cell,
      order,
      direction,
    })
    order += 1
  }

  currentCells.forEach(recordTraversal)

  while (processedCells < totalCells) {
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

    nextCells.forEach(recordTraversal)

    currentCells = nextCells
    processedCells += 2
  }

  return traversalHistory
}

export const getRectPaths = (points: TraversalRecord[][]) => {
  const paths: PathSegment[] = []
  points.forEach(([point1, point2], index) => {
    let drawBottom =
      (index === 0 && point1.direction === 1) ||
      (index === points.length - 1 && point1.direction === -1)
    let drawTop =
      (index === 0 && point1.direction === -1) ||
      (index === points.length - 1 && point1.direction === 1)

    const [prePoint1] = points[index - 1] || []
    const [nextPoint1] = points[index + 1] || []
    const direction = point1.direction
    const nextDirection = nextPoint1?.direction || direction
    const preDirection = prePoint1?.direction || direction

    if ((direction === 1 && nextDirection === -1) || (direction === -1 && preDirection === 1)) {
      drawTop = true
    }

    if ((direction === -1 && nextDirection === 1) || (direction === 1 && preDirection === -1)) {
      drawBottom = true
    }

    paths.push(
      {
        x1: point1.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
        y1: point1.position.i * QR_CONFIG.cellHeight,
        y2: point1.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
        x2: point1.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
      },
      {
        x1: point2.position.j * QR_CONFIG.cellWidth,
        y1: point2.position.i * QR_CONFIG.cellHeight,
        y2: point2.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
        x2: point2.position.j * QR_CONFIG.cellWidth,
      }
    )

    if (drawBottom) {
      paths.push(
        {
          x1: point1.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
          y1: point1.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
          x2: point2.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
          y2: point2.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
        },
        {
          x1: point1.position.j * QR_CONFIG.cellWidth,
          y1: point1.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
          x2: point2.position.j * QR_CONFIG.cellWidth,
          y2: point2.position.i * QR_CONFIG.cellHeight + QR_CONFIG.cellHeight,
        }
      )
    }

    if (drawTop) {
      paths.push(
        {
          x1: point1.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
          y1: point1.position.i * QR_CONFIG.cellHeight,
          x2: point2.position.j * QR_CONFIG.cellWidth + QR_CONFIG.cellWidth,
          y2: point2.position.i * QR_CONFIG.cellHeight,
        },
        {
          x1: point1.position.j * QR_CONFIG.cellWidth,
          y1: point1.position.i * QR_CONFIG.cellHeight,
          x2: point2.position.j * QR_CONFIG.cellWidth,
          y2: point2.position.i * QR_CONFIG.cellHeight,
        }
      )
    }
  })

  return paths
}
