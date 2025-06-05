import { qrcodegen } from 'libs/qr/codegen'
import { chunk } from 'libs/utils/array'
export interface PathSegment {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface Position {
  i: number
  j: number
}

interface PathPoint {
  x: number
  y: number
}

interface TraversalRecord {
  position: Position
  order: number
  direction: number
}

export class QRCode {
  qr: qrcodegen.QrCode
  cells: number[][] = []
  public cellSize = 20
  traversalRecord: TraversalRecord[]
  size: number

  constructor(text: string) {
    this.qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.LOW)
    this.cells = this.qr.getModules().map((row) => row.map((cell) => (cell ? 1 : 0)))
    this.traversalRecord = this.getTraversalRecord()
    this.size = this.qr.size
  }

  generateReadPaths(): PathSegment[] {
    const points = this.traversalRecord
    const paths: PathSegment[] = []

    const getCenterPoint = ({ i, j }: Position): PathPoint => ({
      x: j * this.cellSize + this.cellSize / 2,
      y: i * this.cellSize + this.cellSize / 2,
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

  generateEncodingModePaths(): PathSegment[] {
    return this.getRectPaths(chunk(this.traversalRecord.slice(0, 4), 2))
  }

  generateDecodingLengthPaths(): PathSegment[] {
    return this.getRectPaths(chunk(this.traversalRecord.slice(4, 12), 2))
  }

  generateDecodingContentPath(): PathSegment[] {
    const bytePoints = chunk(this.traversalRecord.slice(12), 8)
    let paths: PathSegment[] = []
    bytePoints.forEach((points) => {
      paths.push(...this.getRectPaths(chunk(points, 2)))
    })
    return paths
  }

  getTraversalRecord(): TraversalRecord[] {
    const size = this.qr.size
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

    const recordTraversal = (cell: Position) => {
      if (cell.i < 0 || cell.i > size || cell.j < 0 || cell.j > size) {
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
        (this.isSpecialRegion(nextCells[0]) || this.isSpecialRegion(nextCells[1]))
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

  isSpecialRegion({ i, j }: Position): boolean {
    return (
      this.isFinders({ i, j }) ||
      this.isSeparators({ i, j }) ||
      this.isTimingPatterns({ i, j }) ||
      this.isFormatInformation({ i, j }) ||
      this.isDarkModule({ i, j })
    )
  }

  isFinders({ i, j }: Position): boolean {
    const size = this.qr.size
    return (i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7)
  }

  isSeparators({ i, j }: Position): boolean {
    const size = this.qr.size
    return (
      (i === 7 && j <= 7) ||
      (j === 7 && i <= 7) ||
      (i >= size - 7 && j === 7) ||
      (i === size - 8 && j <= 7) ||
      (i === 7 && j >= size - 7) ||
      (j === size - 8 && i <= 7)
    )
  }

  isTimingPatterns({ i, j }: Position): boolean {
    const size = this.qr.size
    return (i === 6 && j >= 7 && j < size - 7) || (j === 6 && i >= 7 && i < size - 7)
  }

  isFormatInformation({ i, j }: Position): boolean {
    const size = this.qr.size
    return (
      (j <= 8 && i === 8) ||
      (j >= size - 8 && i === 8) ||
      (i <= 7 && j === 8) ||
      (i >= size - 7 && j === 8)
    )
  }

  isDarkModule({ i, j }: Position): boolean {
    const size = this.qr.size
    return j === 8 && i === size - 8
  }

  getRectPaths(points: TraversalRecord[][]): PathSegment[] {
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
          x1: point1.position.j * this.cellSize + this.cellSize,
          y1: point1.position.i * this.cellSize,
          y2: point1.position.i * this.cellSize + this.cellSize,
          x2: point1.position.j * this.cellSize + this.cellSize,
        },
        {
          x1: point2.position.j * this.cellSize,
          y1: point2.position.i * this.cellSize,
          y2: point2.position.i * this.cellSize + this.cellSize,
          x2: point2.position.j * this.cellSize,
        }
      )

      if (drawBottom) {
        paths.push(
          {
            x1: point1.position.j * this.cellSize + this.cellSize,
            y1: point1.position.i * this.cellSize + this.cellSize,
            x2: point2.position.j * this.cellSize + this.cellSize,
            y2: point2.position.i * this.cellSize + this.cellSize,
          },
          {
            x1: point1.position.j * this.cellSize,
            y1: point1.position.i * this.cellSize + this.cellSize,
            x2: point2.position.j * this.cellSize,
            y2: point2.position.i * this.cellSize + this.cellSize,
          }
        )
      }

      if (drawTop) {
        paths.push(
          {
            x1: point1.position.j * this.cellSize + this.cellSize,
            y1: point1.position.i * this.cellSize,
            x2: point2.position.j * this.cellSize + this.cellSize,
            y2: point2.position.i * this.cellSize,
          },
          {
            x1: point1.position.j * this.cellSize,
            y1: point1.position.i * this.cellSize,
            x2: point2.position.j * this.cellSize,
            y2: point2.position.i * this.cellSize,
          }
        )
      }
    })

    return paths
  }

  generateMaskCells(): number[][] {
    const mask = this.qr.mask
    const cells = new Array(this.qr.size).fill(0).map(() => new Array(this.qr.size).fill(0))
    for (let j = 0; j < this.qr.size; j++) {
      for (let i = 0; i < this.qr.size; i++) {
        let invert = false
        switch (mask) {
          case 0:
            invert = (i + j) % 2 === 0
            break
          case 1:
            invert = j % 2 === 0
            break
          case 2:
            invert = i % 3 === 0
            break
          case 3:
            invert = (i + j) % 3 === 0
            break
          case 4:
            invert = (Math.floor(i / 3) + Math.floor(j / 2)) % 2 === 0
            break
          case 5:
            invert = ((i * j) % 2) + ((i * j) % 3) === 0
            break
          case 6:
            invert = (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
            break
          case 7:
            invert = (((i + j) % 2) + ((i * j) % 3)) % 2 === 0
            break
          default:
            throw new Error('Unreachable')
        }
        if (invert && !this.isSpecialRegion({ i, j })) {
          cells[i][j] = 1
        }
      }
    }
    return cells
  }
}
