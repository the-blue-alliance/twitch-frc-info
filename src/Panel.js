import React from "react"
import ReactDOM from "react-dom"
import GlobalStyle from './components/GlobalStyle'
import Panel from "./components/Panel"

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <Panel />
  </React.Fragment>,
  document.getElementById("root")
)