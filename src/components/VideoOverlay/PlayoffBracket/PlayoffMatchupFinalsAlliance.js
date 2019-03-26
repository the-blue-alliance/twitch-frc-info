import React from 'react'
import styled from 'styled-components'

import BracketContext from './BracketContext'

import GoldMedal from '../../../images/medal-gold.png'
import SilverMedal from '../../../images/medal-silver.png'



const Alliance = styled.div`
  display: flex;
  flex-direction: ${props => props.isRed ? 'column-reverse' : 'column'};
  text-align: center;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: ${props => props.notSelected ?
    '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)'
    :
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)'
  };
  overflow: hidden;
  opacity: ${props => props.notSelected ? 0.3 : 1}
  ${props => props.isRed ? 'margin-top' : 'margin-bottom'}: 0.25vw;
`

const TeamContainer = styled.div`
  color: #000;
  font-size: 1.75vw;
  padding: 0.25vw;
`

const WinsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25vw;
  background-color: ${props => props.isRed ? '#d04f27' : '#508bd3'};
  ${props => props.isWinner && 'font-weight: bold;'}
  padding: 0.5vw;
`

const Seed = styled.div`
  flex: 1;
  text-align: left;
  font-size: 1.5vw;
  padding-left: 0.25vw;
`

const Wins = styled.div`
  font-size: 2.5vw;
`

const Medal = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const MedalIcon = styled.img`
  height: 2vw;
`

const PlayoffMatchupFinalsAlliance = React.memo(({eventKey, color, seed, wins, winner}) => {
  const isRed = color === 'red'
  const isWinner = color === winner
  return (
    <BracketContext.Consumer>
      {({selectedSeed, setSelectedSeed, allianceTeamKeys}) => {
        return (
          <Alliance
            isRed={isRed}
            notSelected={selectedSeed !== null && selectedSeed !== seed}
            onMouseEnter={() => setSelectedSeed(seed)}
            onMouseLeave={() => setSelectedSeed(null)}
          >
            <WinsContainer
              isRed={isRed}
              isWinner={isWinner}
            >
              <Seed>{seed}.</Seed>
              <Wins>{wins}</Wins>
              <Medal>
                {winner && isWinner && <MedalIcon src={GoldMedal} alt='Gold medal'/>}
                {winner && !isWinner && <MedalIcon src={SilverMedal} alt='Silver medal'/>}
              </Medal>
            </WinsContainer>
            <TeamContainer>
              {allianceTeamKeys && allianceTeamKeys[seed-1] ?
                allianceTeamKeys[seed-1].map(teamKey => (
                  <div key={teamKey}>
                    {teamKey.substring(3)}
                  </div>
                ))
                :
                <div>?</div>
              }
            </TeamContainer>
          </Alliance>
        )
      }}
    </BracketContext.Consumer>
  )
})

export default PlayoffMatchupFinalsAlliance
