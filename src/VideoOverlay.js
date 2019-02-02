import React from "react"
import ReactDOM from "react-dom"
import GlobalStyle from './components/GlobalStyle'
import VideoOverlay from "./components/VideoOverlay"

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <VideoOverlay />
  </React.Fragment>,
  document.getElementById("root")
)