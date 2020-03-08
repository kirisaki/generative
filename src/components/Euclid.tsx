/** @jsx jsx */
import * as React from 'react'
import { } from 'react'
import { Global, jsx, css } from '@emotion/core'
import { SvgCanvas } from './SvgCanvas'

export const Euclid: React.FC = () => {

  return(
    <SvgCanvas>
      <rect x="10" y="10" width="100" height="100" stroke="black" strokeWidth="1" fill="none" />
    </SvgCanvas>
  )
}

