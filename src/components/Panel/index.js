import React from 'react'
import { fetchEvent } from '../../util/TBAAPI'

export default class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      event: null,
    }
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
        const config = JSON.parse(body)
        fetchEvent(config.eventKey).then(event => {
          this.setState({event});
        });
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch){
      this.twitch.unlisten('broadcast')
    }
  }

  render() {
    const { event } = this.state
    if (event) {
      return <div>{event.name} ({event.year})</div>
    } else {
      return (
        <div>
          The broadcaster has not properly configured this extension.
        </div>
      )
    }
  }
}
