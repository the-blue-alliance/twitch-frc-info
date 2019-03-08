import { createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'

export default createGlobalStyle`
  ${styledNormalize}
  body {
    font-family: Helvetica;
    font-size: 3vw;
    user-select: none;
  }
  h1 {
    margin: 1vw 0 0.5vw 0;
    font-size: 3.5vw;
    font-weight: 500;
  }
  h2 {
    margin: 1vw 0 0.5vw 0;
    font-size: 3vw;
    font-weight: 500;
  }
  p {
    margin: 0.25vw 0 0.25vw 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  th {
    font-weight: 300;
  }
`
