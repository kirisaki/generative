/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Global, jsx, css } from '@emotion/core'
import { Container} from './Container'
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
  const [screen, setScreen] = useState<DOMRectReadOnly|null>(null)
  const [rects, setRects] = useState<Rect>([])
  const [nums, setNums] = useState<[number, number]>([0, 0])
  const [active, setActive] = useState<boolean>(true)
  useEffect(() => {
    if(screen === null){
      return () => {}
    }
    let gen = newRandGen(Date.now())
    for(let j = 0; j < 4000; j++){
      const [, g] = randNext(gen)
      gen = g
    }

    const [numA, g1] = randRange(1, 6, gen)
    gen = g1
    const [numB, g2] = randRange(1, 4, gen)
    gen = g2
    console.log(`A: ${numA}, B: ${numB}`)
    setNums([numA, numB])
    const divSquare = (ratio: number): Rect[] => {
      let w = screen.width > screen.height ? screen.height : screen.width
      const s = w
      let l = screen.width > screen.height ? screen.width : screen.height
      const offx = screen.width < screen.height ? 0 : (screen.width - s)/2
      const offy = screen.height < screen.width ? 0 : (screen.height - s)/2
      let x= 0
      let y= 0
      const off = offx > offy ? offx : offy
      let i = 0
      let results = []
      while(w > 0.01){
        i++
        if(i % 2 == 1){
          while(x + w * ratio <= s + 0.01){
            const [hue, g] = randRange(0, 360, gen)
            gen = g
            const color = hsvToRgbHex(hue, 0.5, 0.8)
            results.push({x, y, w: w * ratio + offx, h: w + offy, color})
            x += w * ratio
          }
          w = s - x
        }else{
          while(y + w / ratio <= s + 0.01){
            const [hue, g] = randRange(0, 360, gen)
            gen = g
            const color = hsvToRgbHex(hue, 0.5, 0.8)
            results.push({x, y, w: w + offx, h: w / ratio + offy, color})
            y += w / ratio
          }
          w = s - y
        }
      }
      return results
    }
    setRects(divSquare(numB/numA))
  }, [screen, active])
  return(
    <Container callback={setScreen}>
      <div css={css({zIndex: 100, fontSize: '2rem', position: 'absolute', top: '1rem', left: '1rem'})}>A = {nums[0]}, B = {nums[1]}</div>
      <svg>
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

