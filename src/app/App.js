import React from 'react'
import styled from 'styled-components'
import { IntlProvider } from 'react-intl'
import { ThemeProvider, injectGlobal } from 'styled-components'
import * as theme from './theme.js'

import Body from './components/body/BodyContainer'
import Footer from './components/footer/FooterContainer'

import './bootstrap.css'

injectGlobal`
html {
  position: relative;
  min-height: 100%;
}
body {
  /* Margin bottom by footer height */
  margin-bottom: 60px;
}

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }
`

const App = () => (
  <IntlProvider locale="en">
    <ThemeProvider theme={theme}>
      <div className="bg-light">
        <Body />
        <Footer />
      </div>
    </ThemeProvider>
  </IntlProvider>
)

export default App
