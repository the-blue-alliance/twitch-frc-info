import React from 'react'
import styled from 'styled-components'
import { fetchEvent } from '../../util/TBAAPI'
import { SET_EVENT_KEY } from '../../constants/BroadcastTypes'

const ExpandableButton = styled.div`
  background-color: #3f51b5;
  width: ${props => props.open ? '100%' : '48px'};
  height: ${props => props.open ? '100%' : '48px'};
  border-radius: ${props => props.open ? 8 : 24}px;
  margin: 8px;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12);
  opacity: 0;
  transition: all 0.3s cubic-bezier(.06,.89,.23,.98);
  cursor: pointer;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;

  &:hover ${ExpandableButton} {
    opacity: 1;
  }
`

export default class VideoOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      event: null,
      open: false,
    }
    this.handleOpen = this.handleOpen.bind(this)
  }

  handleOpen() {
    this.setState(state => ({open: !state.open}))
  }

  componentDidMount() {
    if (this.twitch) {
      // Subscribe to configuration
      this.twitch.configuration.onChanged(() => {
        const config = this.twitch.configuration.broadcaster ? JSON.parse(this.twitch.configuration.broadcaster.content) : null
        if (config) {
          fetchEvent(config.eventKey).then(event => {
            this.setState({event});
          });
        }
      })

      // Subscribe to configuration broadcast
      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        const broadcast = JSON.parse(body)
        if (broadcast.type === SET_EVENT_KEY) {
          fetchEvent(broadcast.eventKey).then(event => {
            this.setState({event});
          });
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch){
      this.twitch.unlisten('broadcast')
    }
  }

  render() {
    const { event, open } = this.state
    if (event || true) {
      return (
        <Container onMouseEnter={this.handleHover} onMouseLeave={this.handleUnHover}>
          <ExpandableButton onClick={this.handleOpen} open={open}>
            {open && <h1>Some Title</h1>}
          </ExpandableButton>
        </Container>
      )
    } else {
      return null
    }
  }
}
