/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Global, jsx, css } from '@emotion/core'
import { SvgCanvas } from './SvgCanvas'
import { hsvToRgbHex } from '../utils'
import { newRandGen, randNext, randRange } from 'fn-mt'

type Rect = {
  x: number
  y: number
  w: number
  h: number
  color: string
}

export const Euclid: React.FC = () => {
  const [state, setState] = useState(null)
  const [rects, setRects] = useState<Rect>([])
  useEffect(() => {
    const scale = 5
    const numA = 86 * scale
    const numB = 137 * scale
    let w = numB
    let x = 0
    let y = 0
    let gen = newRandGen(Date.now())
    for(let j = 0; j < 4000; j++){
      const [, g] = randNext(gen)
      gen = g
    }

    let i = 0
    let results = []
    while(w > 0){
      i++
      if(i % 2 == 1){
        while(x + w <= numA){
          const [hue, g] = randRange(0, 360, gen)
          gen = g
          const color = hsvToRgbHex(hue, 0.5, 0.8)
          results.push({x, y, w, h: w, color})
          x += w
        }
        w = numA - x
      }else{
        while(y + w <= numB){
          const [hue, g] = randRange(0, 360, gen)
          gen = g
          const color = hsvToRgbHex(hue, 0.7, 1)
          results.push({x, y, w, h: w, color})
          y += w
        }
        w = numB - y
      }
    }
    results.reduce((a, b, i) => {
      setTimeout(() => setRects(a.concat(b)), 100 * i)
      return a.concat(b)
    }, [])
  },[])
  return(
    <SvgCanvas callback={setState}>
      {rects.map((r, i) =>
        <rect key = {i} x={r.x} y={r.y} width={r.w} height={r.h} stroke="#eee" strokeWidth="1" fill={r.color} />
      )}
    </SvgCanvas>
  )
}

