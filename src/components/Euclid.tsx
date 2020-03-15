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

const divSquare = (ratio: number): Rect0[] => {
  let w = screen.width > screen.height ? screen.height : screen.width
  const s = w
  let x = 0
  let y = 0
  let i = 0
  let results = []
  while(w > 0.01){
    i++
    if(i % 2 == 1){
      while(x + w * ratio <= s + 0.01){
        results.push({x, y, w: w * ratio, h: w})
        x += w * ratio
      }
      w = s - x
    }else{
      while(y + w / ratio <= s + 0.01){
        results.push({x, y, w: w, h: w / ratio})
        y += w / ratio
      }
      w = s - y
    }
  }
  return results
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
  const [screen, setScreen] = useState<DOMRectReadOnly|null>(null)
  const [rects, setRects] = useState<Rect[]>([])
  const [nums, setNums] = useState<[number, number]>([0, 0])
  const [active, setActive] = useState<boolean>(true)
  const size = (s: DOMRectReadOnly|null): number => s === null ? 0 : (s.width > s.height ? s.height : s.width)
  useEffect(() => {
    if(screen === null){
      return () => {}
    }
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
    setRects(colorize(divSquare(numB/numA), gen))
  }, [screen, active])
  return(
    <Container callback={setScreen}>
      <div css={css({zIndex: 100, fontSize: '2rem', position: 'absolute', top: '1rem', left: '1rem'})}>A = {nums[0]}, B = {nums[1]}</div>
      <svg css={css({width: size(screen), height: size(screen)})}>
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

