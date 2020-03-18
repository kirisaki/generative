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
  kind: 'rect0'
  body: {
    x: number
    y: number
    w: number
    h: number
  }[]
}

type DrawData = {
  kind: 'drawData'
  x: number
  y: number
  w: number
  wmax: number
  ratio: number
  thr: number
  accum: Rect0
  isSquare: boolean
}

type StackFrame = {
  iter: Generator<DrawData, Rect0, Rect0 | null> | null
  last: Rect0 | null
  caller: StackFrame | null
}

const draw = function*(data: DrawData): Generator<DrawData, Rect0, Rect0 | null>{
  const ratio = data.ratio
  const thr = data.thr
  const wmax = data.wmax
  if(data.isSquare){
    let w = data.w
    let i = 0
    let x = data.x
    let y = data.y
    const xe = w + x
    const ye = w + y
    let result: Rect0 = {kind: 'rect0', body: data.accum.body.concat({x, y, w, h: w})}
    while(w > wmax * thr){
      i++
      if(i % 2 === 1){
        while(x + w * ratio < xe + 0.1){
          yield {kind: 'drawData', x, y, w: w * ratio, wmax: data.wmax, ratio, thr, accum: result, isSquare: false}
          x += w * ratio
        }
        w = xe - x
      }else{
        while(y + w / ratio < ye + 0.1){
          yield {kind: 'drawData', x, y, w, wmax: data.wmax, ratio, thr, accum: result, isSquare: false}
          y += w / ratio
        }
        w = ye - y
      }
    }
    return result
  }else{
    let w = data.w
    let x = data.x
    let y = data.y
    const xe = x + w
    const ye = y + w / ratio
    let i = 0
    let result: Rect0 = {kind: 'rect0', body: data.accum.body.concat({x, y, w, h: w / ratio})}
    while(w > wmax * thr){
      i++
      if(i % 2 === 0){
        while(x + w < xe + 0.1){
          yield {kind: 'drawData', x, y, w, wmax: data.wmax, ratio, thr, accum: result, isSquare: true}
          x += w
        }
        w = xe - x
      }else{
        while(y + w < ye + 0.1){
          yield {kind: 'drawData', x, y, w, wmax: data.wmax, ratio, thr, accum: result, isSquare: true}
          y += w
        }
        w = ye - y
      }
    }
    return result
  }
}

const runDraw = (func: (data: DrawData) => Generator<DrawData, Rect0, Rect0 | null>, arg: DrawData): Rect0 => {
  const root: StackFrame = {iter: null, last: null, caller: null}
  const callStack: StackFrame[] = []

  callStack.push({iter: func(arg), last: null, caller: root})

  let result: Rect0 = {kind: 'rect0', body: []}
  while(callStack.length > 0){
    const stackFrame = callStack[callStack.length - 1]
    const {iter, last, caller} = stackFrame
    if(iter === null || caller === null){
      return {kind: 'rect0', body: []}
    }
    const {value, done} = iter.next(last)
    if(value === null){
      return {kind: 'rect0', body: []}
    }
    if(done && value.kind === 'rect0'){
      caller.last = value
      callStack.pop()
    }else if(value.kind === 'drawData'){
      result.body.push({x: value.x, y: value.y, w: value.w, h: value.isSquare ? value.w : value.w / value.ratio})
      callStack.push({iter: func(value), last: null, caller: stackFrame})
    }
  }
  if(root.last === null){
    return {kind: 'rect0', body: []}
  }else{
    return result
  }
}

const colorize = (rs: Rect0, gen0: RandGen): Rect[] => {
  let gen = gen0
  let result = []
  for (const r of rs.body){
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

    const [numA, g1] = randRange(1, 20, gen)
    gen = g1
    let [numB, g2] = randRange(1, 20, gen)
    gen = g2

    while(numA === numB){
      const [n, g] = randRange(1, 20, gen)
      gen = g
      numB = n
    }
    setNums([numA, numB])

    const width = size(container) 
    const ratio = numB / numA

    const result = runDraw(draw, {kind: 'drawData', x: 0, y: 0, w: width, wmax: width, ratio, thr: 0.01, accum: {kind: 'rect0', body: []}, isSquare: true})
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

