import React from 'react'
import styled from 'styled-components'

const FooterWrapper = styled.footer.attrs({
  className: 'footer',
})`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #f5f5f5;
`

const Footer = () => (
  <FooterWrapper>
    <div className="container">
      <span className="text-muted">
        Created by Ernane Luis https://ernane.me
      </span>
    </div>
  </FooterWrapper>
)

export default Footer
