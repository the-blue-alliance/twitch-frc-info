import React from 'react'
import styled from 'styled-components'

import BracketContext from './BracketContext'
import PlayoffMatchup from './PlayoffMatchup'
import PlayoffFinalsMatchup from './PlayoffFinalsMatchup'

const Container = styled.div`
  height: 100%;
  align-self: stretch;
  display: flex;
  justify-content: center;
  padding: 1vw;
`

const Message = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 2.5vw;
`

const PlayoffRound = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-grow: 1;
`

class EventPlayoffBracket extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      selectedSeed: null,
      setSelectedSeed: seed => {
        this.setState({selectedSeed: seed})
      },
      allianceTeamKeys: null,
      winStats: null,
    }
  }

  updateAlliances() {
    const { alliances, matches, playoffType } = this.props

    let allianceTeamKeys = null
    const teamAllianceMap = {}
    if (alliances) {
      allianceTeamKeys = {}
      alliances.forEach((a, i) => {
        allianceTeamKeys[i] = a.picks
        // Add in backup if it exists
        const backup = a.backup && a.backup.in
        if (backup) {
          allianceTeamKeys[i] = allianceTeamKeys[i].push(backup)
        }
        // Add to team-alliance map
        allianceTeamKeys[i].forEach(teamKey => {
          teamAllianceMap[teamKey] = i
        })
      })
    }

    let winStats = null
    if (matches) {
      winStats = {}
      matches.forEach(m => {
        if (!winStats[m.comp_level]) {
          winStats[m.comp_level] = {}
        }
        if (!winStats[m.comp_level][m.set_number]) {
          winStats[m.comp_level][m.set_number] = {
            redAllianceId: teamAllianceMap[m.alliances.red.team_keys[0]],
            blueAllianceId: teamAllianceMap[m.alliances.blue.team_keys[0]],
            redWins: 0,
            blueWins: 0,
            winner: null,
          }
        }
        if (m.winning_alliance === 'red') {
          winStats[m.comp_level][m.set_number].redWins += 1
        }
        if (m.winning_alliance === 'blue') {
          winStats[m.comp_level][m.set_number].blueWins += 1
        }

        const numToWin = playoffType === 6 ? 3 : 2
        if (winStats[m.comp_level][m.set_number].redWins === numToWin) {
          winStats[m.comp_level][m.set_number].winner = 'red'
        }
        if (winStats[m.comp_level][m.set_number].blueWins === numToWin) {
          winStats[m.comp_level][m.set_number].winner = 'blue'
        }
      })
    }

    this.setState({
      allianceTeamKeys,
      winStats,
    })
  }

  componentDidMount() {
    this.updateAlliances()
  }

  componentDidUpdate(prevProps) {
    const { alliances: prevAlliances, matches: prevMatches } = prevProps
    const { alliances, matches } = this.props
    if (prevAlliances !== alliances || prevMatches !== matches) {
      this.updateAlliances()
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    const { eventKey, playoffType } = this.props
    const { hasError, winStats } = this.state

    if (hasError) {
      return <Message>No Playoff Bracket Available</Message>
    }

    let hasQf = true
    let hasSf = true
    if (playoffType === 4) {
      hasQf = false
      hasSf = false
    }

    return (
      <BracketContext.Provider value={this.state}>
        <Container>
          {winStats && hasQf && <PlayoffRound>
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='qf'
              setNumber={1}
              winner='red'
            />
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='qf'
              setNumber={2}
              winner='red'
            />
          </PlayoffRound>}
          {winStats && hasSf && <PlayoffRound>
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='sf'
              setNumber={1}
              winner='red'
            />
          </PlayoffRound>}
          {winStats && <PlayoffRound>
            <PlayoffFinalsMatchup
              eventKey={eventKey}
              winner='blue'
            />
          </PlayoffRound>}
          {winStats && hasSf && <PlayoffRound>
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='sf'
              setNumber={2}
              winner='blue'
              rightSide
            />
          </PlayoffRound>}
          {winStats && hasQf && <PlayoffRound>
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='qf'
              setNumber={3}
              winner='red'
              rightSide
            />
            <PlayoffMatchup
              eventKey={eventKey}
              compLevel='qf'
              setNumber={4}
              winner='red'
              rightSide
            />
          </PlayoffRound>}
        </Container>
      </BracketContext.Provider>
    )
  }
}

export default EventPlayoffBracket
