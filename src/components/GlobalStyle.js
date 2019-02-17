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
    margin: 2px 0 2px 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`
