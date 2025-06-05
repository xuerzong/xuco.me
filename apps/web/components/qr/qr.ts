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
  value: string

  constructor(value: string) {
    this.qr = qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.LOW)
    this.cells = this.qr.getModules().map((row) => row.map((cell) => (cell ? 1 : 0)))
    this.traversalRecord = this.getTraversalRecord()
    this.size = this.qr.size
    this.value = value
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
    return this._getRectPaths(this.traversalRecord.slice(0, 4))
  }

  generateDecodingLengthPaths(): PathSegment[] {
    return this._getRectPaths(this.traversalRecord.slice(4, 12))
  }

  generateDecodingContentPath(): PathSegment[] {
    const bytePoints = chunk(this.traversalRecord.slice(12), 8)
    let paths: PathSegment[] = []
    bytePoints.forEach((points) => {
      paths.push(...this._getRectPaths(points))
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
        if (!this.isSpecialRegion(nextCells[0])) {
          recordTraversal(nextCells[0])
        }

        if (!this.isSpecialRegion(nextCells[1])) {
          recordTraversal(nextCells[1])
        }

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
      this.isDarkModule({ i, j }) ||
      this.isAlignmentPatterns({ i, j })
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

  isAlignmentPatterns({ i, j }: Position): boolean {
    const version = this.qr.version
    if (this.qr.version < 2) {
      return false
    }
    const size = this.qr.size
    const alignmentPatternPositions = this.calculateAlignmentPatternPositions()

    // 检查每个对齐图案位置
    for (const pos of alignmentPatternPositions) {
      const ai = pos[0]
      const aj = pos[1]

      // 跳过三个定位图案所在位置
      if (
        (ai === 6 && aj === 6) ||
        (ai === 6 && aj === version * 4 + 10) ||
        (ai === version * 4 + 10 && aj === 6)
      ) {
        continue
      }

      // 检查点(i,j)是否在当前对齐图案的5x5区域内
      if (i >= ai - 2 && i <= ai + 2 && j >= aj - 2 && j <= aj + 2) {
        return true
      }
    }

    return false
  }

  getRectPaths(points: TraversalRecord[][]): PathSegment[] {
    const paths: PathSegment[] = []
    // console.log(points.length !== 4)
    points.slice(0, this.value.length).forEach(([point1, point2], index) => {
      if (!point2) {
        return
      }
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

  _getRectPaths(points: TraversalRecord[]): PathSegment[] {
    const paths: PathSegment[] = []
    const pathsMap = new Map<string, number>()

    points.forEach((point, index) => {
      const edges = [
        {
          x1: point.position.j * this.cellSize + this.cellSize,
          x2: point.position.j * this.cellSize + this.cellSize,
          y1: point.position.i * this.cellSize,
          y2: point.position.i * this.cellSize + this.cellSize,
        },
        {
          x1: point.position.j * this.cellSize,
          x2: point.position.j * this.cellSize,
          y1: point.position.i * this.cellSize,
          y2: point.position.i * this.cellSize + this.cellSize,
        },
        {
          x1: point.position.j * this.cellSize + this.cellSize,
          x2: point.position.j * this.cellSize,
          y1: point.position.i * this.cellSize,
          y2: point.position.i * this.cellSize,
        },
        {
          x1: point.position.j * this.cellSize,
          x2: point.position.j * this.cellSize + this.cellSize,
          y1: point.position.i * this.cellSize + this.cellSize,
          y2: point.position.i * this.cellSize + this.cellSize,
        },
      ]
      edges.forEach((edge) => {
        const pathId = [
          ...[edge.x1, edge.x2].sort((a, b) => a - b),
          ...[edge.y1, edge.y2].sort((a, b) => a - b),
        ].join('-')
        pathsMap.set(pathId, (pathsMap.get(pathId) || 0) + 1)
      })
    })

    Array.from(pathsMap.entries()).forEach(([pathId, count]) => {
      if (count === 1) {
        const [x1, x2, y1, y2] = pathId.split('-').map(Number)
        paths.push({ x1, y1, x2, y2 })
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

  calculateAlignmentPatternPositions() {
    const version = this.qr.version
    if (version < 2) {
      return []
    }

    // 对齐图案的间距（根据版本确定）
    const numPositions = Math.floor(version / 7) + 2
    const firstPosition = 6
    const lastPosition = version * 4 + 10

    // 计算间距
    let step
    if (version === 32) {
      step = 26 // 版本32是特殊情况
    } else {
      step = Math.ceil((lastPosition - firstPosition) / (numPositions - 1))
    }

    // 生成位置数组
    const positions = [firstPosition]
    let pos = lastPosition
    positions.push(pos)

    // 计算中间位置
    for (let i = numPositions - 3; i >= 0; i--) {
      pos -= step
      positions.splice(1, 0, pos)
    }

    // 生成所有对齐图案的坐标对
    const result: number[][] = []
    for (const i of positions) {
      for (const j of positions) {
        result.push([i, j])
      }
    }

    return result
  }
}
