import * as React from 'react'
import { useEffect, useRef } from 'react'

export type ObserverCallback =  (entry: DOMRectReadOnly) => void

type Props = {
  children: React.ReactNode
  callback: ObserverCallback
}

export const Container: React.FC<Props> = ({ children, callback }) => {
  const article = useRef(null);
  const prev = useRef({width: -2, height: -2})
  useEffect(() => {
    const resizeObserver = new ResizeObserver(es => {
      for (let e of es){
        if (e.target === article.current){
          const width = e.target.clientWidth
          const height= e.target.clientHeight
          if(prev.current.width !== width || prev.current.height !== height){
            callback(e.contentRect)
          }
        }
      }
    })
    resizeObserver.observe(article.current)
    return () => resizeObserver.unobserve(article.current)
  }, [article])
  return(
    <article ref={article}>
      {children}
    </article>
  )
}

