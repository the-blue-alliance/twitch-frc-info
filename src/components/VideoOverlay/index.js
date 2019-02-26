import React from 'react'
import styled from 'styled-components'
import { fetchEvent, fetchTeams, fetchTeamMedia, fetchRankings } from '../../util/TBAAPI'
import { SET_EVENT_KEY, SET_SWAP_RED_BLUE } from '../../constants/BroadcastTypes'
import TBALamp from '../../images/tba_lamp.svg'
import NoRobotImage from '../../images/no-robot.png'
import RobotImageThumbnail from './RobotImageThumbnail'
import TeamInfo from './TeamInfo'
import ScrollableRankingTable from './ScrollableRankingTable'

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  padding-top: 50px;
  padding-right: 16px;
  padding-bottom: 60px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  flex-wrap: ${props => props.swap ? 'wrap-reverse' : 'wrap'};
  justify-content: space-around;
  align-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);

  opacity: 0;
  transition: opacity 0.3s cubic-bezier(.06,.89,.23,.98);
  &:hover {
    opacity: 1;
  }
`

const MiddlePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 65%
  border-radius: 8px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`

const MiddlePanelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`

const PoweredBy = styled.div`
  margin: 0.5vw;
  padding: 0;
  align-self: flex-end;
  font-size: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: right;
`

const InlineSVG = styled.img`
  margin: -0.5vw 0;
  height: 2.5vw;
  width: 2.5vw;
`

export default class VideoOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      event: null,
      swapRedBlue: false,
      teams: {},
      images: {},
      hoveredTeamKey: null,
      rankings: [],
      rankingsByTeamKey: {},
    }

    // TEMP fetch teams
    fetchTeams('2018casj').then(teams => {
      const teamsByKey = {}
      teams.forEach(team => {
        teamsByKey[team.key] = team
      })
      this.setState({teams: teamsByKey})
    })

    // TEMP update images
    ;['frc973', 'frc254', 'frc2367', 'frc846', 'frc971'].forEach(teamKey => {
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

    // TEMP fetch rankings
    fetchRankings('2018casj').then(rankings => {
      const rankingsByTeamKey = {}
      rankings.rankings.forEach(ranking => {
        rankingsByTeamKey[ranking.team_key] = ranking
      })
      this.setState({
        rankings: rankings.rankings,
        rankingsByTeamKey,
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
          this.setState({swapRedBlue: config.swapRedBlue})
        }
      })

      // Subscribe to configuration broadcast
      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        const broadcast = JSON.parse(body)
        switch (broadcast.type) {
          case SET_EVENT_KEY:
            fetchEvent(broadcast.eventKey).then(event => {
              this.setState({event});
            });
            break;
          case SET_SWAP_RED_BLUE:
            this.setState({swapRedBlue: broadcast.swapRedBlue})
            break;
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
    const { swapRedBlue, event, teams, images, hoveredTeamKey, rankings, rankingsByTeamKey } = this.state
    const team = teams[hoveredTeamKey]

    if (event) {
      return (
        <Container swap={swapRedBlue}>
          {['frc973', 'frc254', 'frc2367'].map(key =>
            <RobotImageThumbnail
              key={key}
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
              image={images[key] ? images[key] : NoRobotImage}
              teamNumber={key.substring(3)}
            />
          )}
          <MiddlePanel>
            <MiddlePanelContent>
            {team ?
              <TeamInfo
                team={team}
                image={images[hoveredTeamKey] ? images[hoveredTeamKey] : NoRobotImage}
                ranking={rankingsByTeamKey[hoveredTeamKey]}
                totalTeams={rankings.length}
              />
              :
              <React.Fragment>
                <h1>Rankings</h1>
                <ScrollableRankingTable rankings={rankings}/>
              </React.Fragment>
            }
            </MiddlePanelContent>
            <PoweredBy>Powered by<InlineSVG src={TBALamp} />The Blue Alliance</PoweredBy>
          </MiddlePanel>
          {['frc846', 'frc971', 'frc4159'].map(key =>
            <RobotImageThumbnail
              key={key}
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
              image={images[key] ? images[key] : NoRobotImage}
              teamNumber={key.substring(3)}
            />
          )}
        </Container>
      )
    } else {
      return null
    }
  }
}
