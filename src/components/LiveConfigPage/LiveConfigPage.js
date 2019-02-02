import React from 'react'
import Authentication from '../../util/Authentication/Authentication'
import { fetchEvent } from '../../util/TBAAPI'
import { SET_EVENT_KEY } from '../../constants/BroadcastTypes'

import './LiveConfigPage.css'

export default class LiveConfigPage extends React.Component {
  constructor(props) {
    super(props)
    this.Authentication = new Authentication()

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      finishedLoading: false,
      theme: 'light',
      eventKey: '',
      event: null,
    }

    this.handleEventKeyChange = this.handleEventKeyChange.bind(this)
    this.handleEventKeySubmit = this.handleEventKeySubmit.bind(this)
    this.handleEventSubmit = this.handleEventSubmit.bind(this)
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return {theme:context.theme}
      })
    }
  }

  handleEventKeyChange(e) {
    this.setState({eventKey: e.target.value})
  }

  handleEventKeySubmit(e) {
    e.preventDefault()

    // Confirm event key is correct
    fetchEvent(this.state.eventKey).then(event => {
      this.setState({event});
    });
  }

  handleEventSubmit(e) {
    e.preventDefault()
    this.twitch.configuration.set('broadcaster', '1.0', JSON.stringify({
      eventKey: this.state.eventKey,
    }))
    this.twitch.send('broadcast', 'application/json', {
      type: SET_EVENT_KEY,
      eventKey: this.state.eventKey,
    })
    this.setState({event: null})
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId)
        if (!this.state.finishedLoading) {
          this.setState(() => {
            return {finishedLoading:true}
          })
        }
      })

      // Subscribe to context updates
      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta)
      })

      // Subscribe to configuration
      this.twitch.configuration.onChanged(() => {
        const config = this.twitch.configuration.broadcaster ? JSON.parse(this.twitch.configuration.broadcaster.content) : null
        if (config) {
          this.setState({eventKey: config.eventKey})
        }
      })
    }
  }

  render() {
    const { finishedLoading, theme, eventKey, event } = this.state
    if (finishedLoading) {
      return (
        <div className="LiveConfigPage">
          <div className={theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'} >
            <form onSubmit={this.handleEventKeySubmit}>
              <label>
              Event Key: <input type="text" value={eventKey} onChange={this.handleEventKeyChange}/>
              </label>
              <input type="submit" value="Find Event" />
            </form>
            {event &&
              <React.Fragment>
                <div>{event.year} {event.name}</div>
                <form onSubmit={this.handleEventSubmit}>
                  <input type="submit" value="Set Event" />
                </form>
              </React.Fragment>
            }
          </div>
        </div>
      )
    } else {
      return (
        <div className="LiveConfigPage">
        </div>
      )
    }
  }
}