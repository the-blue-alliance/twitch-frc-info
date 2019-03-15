import React from 'react'
import styled from 'styled-components'
import { fetchEvent, fetchTeams, fetchMatches, fetchTeamMedia, fetchRankings } from '../../util/TBAAPI'
import { SET_EVENT_KEY, SET_SWAP_RED_BLUE, SET_FRC_EVENTS_LINK } from '../../constants/BroadcastTypes'
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
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  opacity: 0;
  transition: opacity 0.3s cubic-bezier(.06,.89,.23,.98);
`

const HoverArea = styled.div`
  position: absolute;
  top: 25%;
  right: 10%;
  bottom: 25%;
  left: 10%;
  z-index: ${props => props.hovered || props.hoverTimedOut ? -1 : 1000};
`

const MiddlePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 65%;
  border-radius: 8px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`

const CurrentMatch = styled.h1`
  border-bottom: 1px solid #fff;
`

const EventName = styled.div`
  text-align: center;
  font-size: 2vw;
  margin-bottom: 0.5vw;
`

const MiddlePanelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
`

const BottomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const FullResults = styled.div`
  margin: 0.5vw;
  padding: 0;
  font-size: 1.5vw;
  display: flex;
  align-items: center;
`

const PoweredBy = styled.div`
  margin: 0.5vw;
  padding: 0;
  font-size: 1.5vw;
  display: flex;
  align-items: center;
`

const InlineSVG = styled.img`
  margin: -0.5vw 0;
  height: 2.5vw;
  width: 2.5vw;
`

const PLAY_ORDER = {
  qm: 1,
  ef: 2,
  qf: 3,
  sf: 4,
  f: 5,
}

const MATCH_LEVEL_NAMES = {
  qm: 'Qualification',
  ef: 'Octo-final',
  qf: 'Quarterfinal',
  sf: 'Semfinal',
  f: 'Finals',
}

export default class VideoOverlay extends React.Component {
  constructor(props) {
    super(props)
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.state = {
      event: null,
      swapRedBlue: false,
      showFRCEventsLink: false,
      teams: {},
      images: {},
      rankings: [],
      rankingsByTeamKey: {},
      matchName: null,
      redTeamKeys: null,
      blueTeamKeys: null,
      hovered: false,
      hoverTimedOut: false,
      hoveredTeamKey: null,
    }
  }

  fetchInitialData(eventKey) {
    fetchEvent(eventKey).then(event => {
      this.setState({event});
    });

    fetchTeams(eventKey).then(teams => {
      const teamsByKey = {}
      teams.forEach(team => {
        teamsByKey[team.key] = team
      })
      this.setState({teams: teamsByKey})
    })
  }

  updateData(eventKey) {
    const year = eventKey.substring(0, 4)

    fetchMatches(eventKey).then(matches => {
      matches = matches.sort((a, b) => {
        const aOrder = PLAY_ORDER[a.comp_level]*100000 + a.match_number*100 + a.set_number
        const bOrder = PLAY_ORDER[b.comp_level]*100000 + b.match_number*100 + b.set_number
        if (aOrder < bOrder) {
          return -1
        }
        if (aOrder > bOrder) {
          return 1
        }
        return 0
      })

      // Find next unplayed match after the last played match
      let nextMatch = null
      for (let i=0; i<matches.length; i++) {
        const match = matches[i];
        if (match.alliances.red.score === -1 && match.alliances.blue.score === -1) {
          if (!nextMatch) {
            nextMatch = match
          }
        } else {
          nextMatch = null
        }
      }
      if (!nextMatch) { // If no unplayed matches, show last match
        nextMatch = matches[matches.length-1]
      }

      if (nextMatch) {
        let matchName = MATCH_LEVEL_NAMES[nextMatch.comp_level]
        if (nextMatch.comp_level === 'qm' || nextMatch.comp_level === 'f') {
          matchName += ` ${nextMatch.match_number}`
        } else {
          matchName += ` ${nextMatch.set_number} - ${nextMatch.match_number}`
        }
        this.setState({
          matchName,
          redTeamKeys: nextMatch.alliances.red.team_keys,
          blueTeamKeys: nextMatch.alliances.blue.team_keys,
        })
        this.fetchImages(nextMatch.alliances.red.team_keys, year)
        this.fetchImages(nextMatch.alliances.blue.team_keys, year)
      } else {
        this.setState({
          matchName: null,
          redTeamKeys: null,
          blueTeamKeys: null,
        })
      }
    })

    fetchRankings(eventKey).then(rankings => {
      if (rankings) {
        const rankingsByTeamKey = {}
        rankings.rankings.forEach(ranking => {
          rankingsByTeamKey[ranking.team_key] = ranking
        })
        this.setState({
          rankings: rankings.rankings,
          rankingsByTeamKey,
        })
      } else {
        this.setState({
          rankings: null,
          rankingsByTeamKey: {},
        })
      }
    })
  }

  fetchImages(teamKeys, year) {
    teamKeys.forEach(teamKey => {
      fetchTeamMedia(teamKey, year).then(medias => {
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

  handleMouseOver() {
    if (this.mouseOverTimeout) {
      clearTimeout(this.mouseOverTimeout)
    }
    this.mouseOverTimeout = setTimeout(() => {
      this.setState({hovered: false, hoverTimedOut: true})
    }, 2000)
    this.setState({hoverTimedOut: false})
  }

  componentDidMount() {
    if (this.twitch) {
      // Subscribe to configuration
      this.twitch.configuration.onChanged(() => {
        const config = this.twitch.configuration.broadcaster ? JSON.parse(this.twitch.configuration.broadcaster.content) : null
        if (config) {
          this.fetchInitialData(config.eventKey);
          this.setState({swapRedBlue: config.swapRedBlue})
          this.setState({showFRCEventsLink: config.showFRCEventsLink})
        }
      })

      // Subscribe to configuration broadcast
      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        const broadcast = JSON.parse(body)
        switch (broadcast.type) {
          case SET_EVENT_KEY:
            this.fetchInitialData(broadcast.eventKey);
            break;
          case SET_SWAP_RED_BLUE:
            this.setState({swapRedBlue: broadcast.swapRedBlue})
            break;
          case SET_FRC_EVENTS_LINK:
            this.setState({showFRCEventsLink: broadcast.showFRCEventsLink})
            break;
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.twitch){
      this.twitch.unlisten('broadcast')
    }
    if (this.mouseOverTimeout) {
      clearTimeout(this.mouseOverTimeout)
    }
  }

  render() {
    const {
      swapRedBlue,
      showFRCEventsLink,
      event,
      teams,
      images,
      rankings,
      rankingsByTeamKey,
      matchName,
      redTeamKeys,
      blueTeamKeys,
      hovered,
      hoverTimedOut,
      hoveredTeamKey,
     } = this.state
    const team = teams[hoveredTeamKey]

    if (event) {
      return (
        <Container
          swap={swapRedBlue}
          onMouseLeave={() => {
            this.setState({hovered: false})
            this.setState({
              redTeamKeys: null,
              blueTeamKeys: null,
            })
          }}
          onMouseOver={this.handleMouseOver.bind(this)}
          style={{opacity: hovered ? 1 : 0}}
        >
          <HoverArea
            hovered={hovered}
            hoverTimedOut={hoverTimedOut}
            onMouseEnter={() => {
              this.updateData(event.key)
              this.setState({hovered: true})
            }}
          />
          {redTeamKeys && redTeamKeys.map(key =>
            <RobotImageThumbnail
              key={key}
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
              image={images[key] ? images[key] : NoRobotImage}
              teamNumber={key.substring(3)}
            />
          )}
          <MiddlePanel>
            {matchName && <CurrentMatch>Current Match: {matchName}</CurrentMatch>}
            <EventName>{event.name}</EventName>
            <MiddlePanelContent>
            {team ?
              <TeamInfo
                team={team}
                image={images[hoveredTeamKey] ? images[hoveredTeamKey] : NoRobotImage}
                ranking={rankingsByTeamKey[hoveredTeamKey]}
                totalTeams={rankings ? rankings.length : null}
              />
              :
              <React.Fragment>
                <h2>Rankings</h2>
                <ScrollableRankingTable rankings={rankings}/>
              </React.Fragment>
            }
            </MiddlePanelContent>
            <BottomInfo>
              <FullResults>Full Results: {showFRCEventsLink ? 'www.frc.events' : 'www.thebluealliance.com'}</FullResults>
              <PoweredBy>Powered by<InlineSVG src={TBALamp} />The Blue Alliance</PoweredBy>
            </BottomInfo>
          </MiddlePanel>
          {blueTeamKeys && blueTeamKeys.map(key =>
            <RobotImageThumbnail
              key={key}
              onMouseEnter={() => this.handleTeamHover(key)}
              onMouseLeave={() => this.handleTeamUnHover(key)}
              image={images[key] ? images[key] : NoRobotImage}
              teamNumber={key.substring(3)}
              isBlue
            />
          )}
        </Container>
      )
    } else {
      return null
    }
  }
}
