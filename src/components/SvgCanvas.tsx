import * as React from 'react'

export const SvgCanvas: React.FC = ({ children }) => {
  return(
    <article>
      <svg>{children}</svg>
    </article>
  )
}

