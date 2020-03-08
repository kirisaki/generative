/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Global, jsx, css } from '@emotion/core'
import { SvgCanvas } from './SvgCanvas'

type Rect = {
  x: number
  y: number
  w: number
  h: number
}

export const Euclid: React.FC = () => {
  const [state, setState] = useState(null)
  const [rects, setRects] = useState<Rect>([])
  useEffect(() => {
    setRects([{x: 10, y:10, w:100, h:50}])
  },[])
  return(
    <SvgCanvas callback={setState}>
      {rects.map((r, i) =>
        <rect key = {i} x={r.x} y={r.y} width={r.w} height={r.h} stroke="black" strokeWidth="1" fill="none" />
      )}
    </SvgCanvas>
  )
}

