/** @jsx jsx */
import * as React from 'react'
import { } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Global, jsx, css } from '@emotion/core'
import { Index } from './Index'
import { Euclid } from './Euclid'

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
  body: {
    overflow: 'hidden',
  },
  a: {
    color: '#eee',
    textDecoration: 'none',
  },
})

const container = css({
  display: 'flex',
  position: 'relative',
  width: '100vw',
  height: '100vh',
  article: {
    width: '100vw',
    height: 'calc(100vh - 2rem)',
    position: 'absolute',
    top: 0,
    left: 0,
    svg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
  },
  nav: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: '2rem',
    ul: {
      display: 'flex',
      width: '100%',
      listStyle: 'none',
      li: {
        width: '100%',
        a: {
          display: 'block',
          width: '100%',
          lineHeight: '2rem',
          transition: '0.2s',
        },
        'a:hover': {
          backgroundColor: '#eee',
          color: '#333',
        },
      },
    },
  },
})

export const App: React.FC = () => {
  return (
    <main id="container" css={container}>
      <Global styles={globalStyle} />
      <Router>
        <Switch>
          <Route exact path="/">
            <Index />
          </Route>
          <Route path="/euclid">
            <Euclid />
          </Route>
        </Switch>
        <nav>
          <ul>
            <li><Link to="/">Index</Link></li>
            <li><Link to="/euclid">Euclid</Link></li>
          </ul>
        </nav>
      </Router>
    </main>
  )
}

