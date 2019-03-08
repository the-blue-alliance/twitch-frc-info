import React from 'react'
import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars';


const TeamInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TeamTitle = styled.h2`
  text-align: center;
`

const RobotImageLarge = styled.img`
  display: block;
  max-width: 80%;
  max-height: 60%;
  width: auto;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`

const ErrorMessage = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 2.5vw;
`

export default class TeamInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    const { team, image, ranking, totalTeams, ...restProps } = this.props
    const { hasError } = this.state

    if (hasError) {
      return (
        <React.Fragment>
          <TeamInfoContainer>
            <TeamTitle>Team {team.team_number}</TeamTitle>
            {teamLocation && <p>{teamLocation}</p>}
          </TeamInfoContainer>
          <ErrorMessage>No Team Info Available</ErrorMessage>
        </React.Fragment>
      )
    }

    let teamLocation = ''
    if (team) {
      if (team.city) {
          teamLocation += `${team.city}`
      }
      if (team.state_prov) {
          teamLocation += `, ${team.state_prov}`
      }
      if (team.country) {
          teamLocation += `, ${team.country}`
      }
      if (teamLocation === '') {
          teamLocation = null
      }
    }

    return (
      <React.Fragment>
        <TeamInfoContainer>
          <TeamTitle>Team {team.team_number} - {team.nickname}</TeamTitle>
          {teamLocation && <p>{teamLocation}</p>}
        </TeamInfoContainer>
        <RobotImageLarge src={image} />
        {ranking ? <p>Rank: {ranking.rank}/{totalTeams}, W-L-T: {ranking.record.wins}-{ranking.record.losses}-{ranking.record.ties}</p> : <p></p>}
      </React.Fragment>
    )
  }
}
