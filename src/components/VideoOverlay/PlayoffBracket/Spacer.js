import React from 'react'
import styled from 'styled-components'

const Spacer = React.memo(styled.div`
  flex-grow: 1;
  &:first-child: {
    flex-grow: 0.5;
  }
  &:last-child: {
    flex-grow: 0.5;
  }
`)

export default Spacer
