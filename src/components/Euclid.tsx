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
    const scale = 50
    const numA = 10 * scale
    const numB = 6 * scale
    let w = numB
    let x = 0
    let y = 0
    let i =0
    let results = []

    while(w > 0){
      i++
      if(i % 2 == 1){
        while(x + w <= numA){
          results.push({x, y, w, h: w})
          x += w
        }
        w = numA - x
      }else{
        while(y + w <= numB){
          results.push({x, y, w, h: w})
          y += w
        }
        w = numB - y
      }
    }
    setRects(results)
  },[])
  return(
    <SvgCanvas callback={setState}>
      {rects.map((r, i) =>
        <rect key = {i} x={r.x} y={r.y} width={r.w} height={r.h} stroke="#eee" strokeWidth="1" fill="none" />
      )}
    </SvgCanvas>
  )
}

