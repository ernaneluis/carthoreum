import React from 'react'
import styled from 'styled-components'

import Welcome from '../../scenes/welcome/WelcomeContainer'

const Container = styled.main.attrs({
  className: 'container',
})`
  min-height: 500px;
`

const Body = ({ scene }) => (
  <Container>{scene === 'WELCOME' && <Welcome />}</Container>
)

export default Body
