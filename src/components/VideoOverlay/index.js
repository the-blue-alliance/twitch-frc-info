import React from 'react'
import styled from 'styled-components'
import { fetchEvent, fetchTeams, fetchTeamMedia } from '../../util/TBAAPI'
import { SET_EVENT_KEY } from '../../constants/BroadcastTypes'

const Container = styled.div`
  position: absolute;
  top: 100px;
  right: 16px;
  bottom: 80px;
  left: 16px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-between;

  opacity: 0;
  transition: opacity 0.3s cubic-bezier(.06,.89,.23,.98);
  &:hover {
    opacity: 1;
  }
`

const RobotImageContainer = styled.div`
  height: 30%;
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);

  transition: box-shadow 1s cubic-bezier(.06,.89,.23,.98);
  &:hover {
    box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
  }

  div {
    width: 100%;
    text-align: center;
    color: #fff;
    background-color: ${props => props.isBlue ? 'rgba(80, 139, 211, 0.9)' : 'rgba(208, 79, 39, 0.9)'};
  }
`

const MiddlePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 60%
  border-radius: 8px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`

export default class VideoOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      event: null,
      teams: {},
      images: {},
      hoveredTeamKey: null,
    }

    // TEMP fetcht teams
    fetchTeams('2018casj').then(teams => {
      const teamsByKey = {}
      teams.forEach(team => {
        teamsByKey[team.key] = team
      })
      this.setState({teams: teamsByKey})
    })

    // TEMP update images
    ;['frc254', 'frc604', 'frc971', 'frc973', 'frc846', 'frc8'].forEach(teamKey => {
      fetchTeamMedia(teamKey, 2018).then(medias => {
        for (let media of medias) {
          if (media.preferred) {
            this.setState(state => {
              let images = Object.assign({}, this.state.images);
              images[teamKey] = media.direct_url
              return {images}
            })
          }
        }
      })
    })
  }

  handleTeamHover(teamKey) {
    this.setState({hoveredTeamKey: teamKey})
  }

  handleTeamUnHover(teamKey) {
    this.setState({hoveredTeamKey: null})
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
    const { event, teams, images, hoveredTeamKey } = this.state
    const team = teams[hoveredTeamKey]
    if (event) {
      return (
        <Container>
          {['frc254', 'frc604','frc971'].map(key =>
            <RobotImageContainer
              key={key}
              image={images[key]}
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
            >
              <div>{key.substring(3)}</div>
            </RobotImageContainer>
          )}
          <MiddlePanel>
            {team ?
              <React.Fragment>
                <h3>Team {team.team_number} - {team.nickname}</h3>
                <p>Rank, standings, etc.</p>
              </React.Fragment>
              :
              <h3>Match Schedule & Rankings</h3>
            }
          </MiddlePanel>
          {['frc973', 'frc846', 'frc8'].map(key =>
            <RobotImageContainer
              key={key}
              image={images[key]}
              isBlue
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
            >
              <div>{key.substring(3)}</div>
            </RobotImageContainer>
          )}
        </Container>
      )
    } else {
      return null
    }
  }
}
