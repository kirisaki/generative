/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { Container} from './Container'
import { hsvToRgbHex } from '../utils'
import { RandGen, newRandGen, randNext, randRange } from 'fn-mt'

type Rect = {
  x: number
  y: number
  w: number
  h: number
  color: string
}

type Rect0 = {
  x: number
  y: number
  w: number
  h: number
}

type DrawData = {
  isSquare: boolean
  x: number
  y: number
  w: number
}


const divSquare = (x0: number, y0: number, wd: number, ratio: number, thr: number, accum: Rect0[]): Rect0[] => {
  let w = wd
  let i = 0
  let x = x0
  let y = y0
  const xe = w + x
  const ye = w + y
  let result = accum.concat({x, y, w, h: w})
  while(w > thr){
    i++
    if(i % 2 === 1){
      while(x + w * ratio < xe + 0.1){
        result.push(...divRect(x, y, w * ratio, ratio, thr, result))
        x += w * ratio
      }
      w = xe - x
    }else{
      while(y + w / ratio < ye + 0.1){
        result.push(...divRect(x, y, w, ratio, thr, result))
        y += w / ratio
      }
      w = ye - y
    }
  }
  return result
}

const divRect = (x0: number, y0: number, wd: number, ratio: number, thr: number, accum: Rect0[]): Rect0[] => {
  let w = wd
  let x = x0
  let y = y0
  const xe = x + w
  const ye = y + w / ratio
  let i = 0
  let result = accum.concat({x, y, w, h: w / ratio})
  while(w > thr){
    i++
    if(i % 2 === 0){
      while(x + w < xe + 0.1){
        result.push(...divSquare(x, y, w, ratio, thr, result))
        x += w
      }
      w = xe - x
    }else{
      while(y + w < ye + 0.1){
        result.push(...divSquare(x, y, w, ratio, thr, result))
        y += w
      }
      w = ye - y
    }
  }
  return result
}

const colorize = (rs: Rect0[], gen0: RandGen): Rect[] => {
  let gen = gen0
  let result = []
  for (const r of rs){
    const [hue, g] = randRange(0, 360, gen)
    gen = g
    const color = hsvToRgbHex(hue, 0.5, 0.8)
    result.push({...r, color})
  }
  return result
}

export const Euclid: React.FC = () => {
  const [container, setContainer] = useState<DOMRectReadOnly|null>(null)
  const [rects, setRects] = useState<Rect[]>([])
  const [nums, setNums] = useState<[number, number]>([0, 0])
  const [active, setActive] = useState<boolean>(true)
  const size = (s: DOMRectReadOnly|null): number => s === null ? 0 : (s.width > s.height ? s.height : s.width)
  useEffect(() => {
    if(container === null){
      return () => {}
    }
    // Stabilize MT randomizer
    let gen = newRandGen(Date.now())
    for(let j = 0; j < 4000; j++){
      const [, g] = randNext(gen)
      gen = g
    }

    const [numA, g1] = randRange(1, 10, gen)
    gen = g1
    const [numB, g2] = randRange(1, 10, gen)
    gen = g2
    setNums([numA, numB])

    const width = size(container) 
    const ratio = numB / numA

    const result = divSquare(0, 0, 500, 6/10, 160, [])
    setRects(colorize(result, gen))
  }, [container, active])
  return(
    <Container callback={setContainer}>
      <div css={css({zIndex: 100, fontSize: '2rem', position: 'absolute', top: '1rem', left: '1rem'})}>A = {nums[0]}, B = {nums[1]}</div>
      <svg css={css({width: size(container), height: size(container)})}>
        {rects.map((r, i) =>
          <rect
            key = {i}
            x={r.x} y={r.y}
            width={r.w} height={r.h}
            stroke="#eee" strokeWidth="1"
            fill={r.color}
          />
        )}
      </svg>
    </Container>
  )
}

