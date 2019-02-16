import { createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'

export default createGlobalStyle`
  ${styledNormalize}
  body {
    font-family: Helvetica;
  }
  h1 {
    margin: 8px 0 4px 0;
    font-size: 24px;
    font-weight: 500;
  }
  p {
    margin: 0;
  }
`
