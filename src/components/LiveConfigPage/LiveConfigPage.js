import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

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
      eventKey: undefined,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return {theme:context.theme}
      })
    }
  }

  handleChange(e) {
    this.setState({eventKey: e.target.value})
  }

  handleSubmit(e) {
    this.twitch.rig.log("Setting config!")
    e.preventDefault()
    this.twitch.configuration.set('broadcaster', '1.0', JSON.stringify({
      eventKey: this.state.eventKey,
    }))
    this.twitch.send('broadcast', 'application/json', {'eventKey': this.state.eventKey})
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
    if (this.state.finishedLoading) {
      return (
        <div className="LiveConfigPage">
          <div className={this.state.theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'} >
            <form onSubmit={this.handleSubmit}>
              <label>
              Event Key: <input type="text" value={this.state.eventKey} onChange={this.handleChange}/>
              </label>
              <input type="submit" value="Submit" />
            </form>
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