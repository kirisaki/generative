/** @jsx jsx */
import * as React from 'react'
import { } from 'react'
import { Global, jsx, css } from '@emotion/core'

const globalStyle = css({
  '*': {
    padding: 0,
    margin: 0,
  },
  html: {
    backgroundColor: '#333',
    color: '#eee',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  a: {
    color: '#eee',
    textDecoration: 'none',
  },
})

export const App: React.FC = () => {
  return (
    <main id="maincontainer" css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <h1>nyaan</h1>
    </main>
  )
}

