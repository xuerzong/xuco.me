'use client'

import { useEffect, useRef } from 'react'

const logoAscii = `
██╗  ██╗██╗   ██╗███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗ ██████╗ 
╚██╗██╔╝██║   ██║██╔════╝██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║██╔════╝ 
 ╚███╔╝ ██║   ██║█████╗  ██████╔╝  ███╔╝ ██║   ██║██╔██╗ ██║██║  ███╗
 ██╔██╗ ██║   ██║██╔══╝  ██╔══██╗ ███╔╝  ██║   ██║██║╚██╗██║██║   ██║
██╔╝ ██╗╚██████╔╝███████╗██║  ██║███████╗╚██████╔╝██║ ╚████║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝                                                                  
`

const LogoASCII: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const lines = logoAscii.trimEnd().split('\n')
    const fontSize = 12
    const lineHeight = 14
    const horizontalPadding = 0
    const verticalPadding = 0
    const fontFamily =
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace'

    const ratio = window.devicePixelRatio || 1
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    context.font = `${fontSize}px ${fontFamily}`
    const maxLineWidth = Math.max(...lines.map((line) => context.measureText(line).width))
    const cssWidth = Math.ceil(maxLineWidth + horizontalPadding * 2)
    const cssHeight = verticalPadding * 2 + lineHeight * lines.length

    canvas.width = Math.ceil(cssWidth * ratio)
    canvas.height = Math.ceil(cssHeight * ratio)
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`

    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, cssWidth, cssHeight)
    context.font = `${fontSize}px ${fontFamily}`
    context.textBaseline = 'top'
    context.fillStyle = '#ffc799' // oklch(0.8689 0.0877 60.68)

    lines.forEach((line, index) => {
      context.fillText(line, horizontalPadding, verticalPadding + index * lineHeight)
    })
  }, [])

  return (
    <div className="text-foreground">
      <canvas ref={canvasRef} className="max-w-full text-current" aria-label="ASCII logo" />
    </div>
  )
}

export default LogoASCII
