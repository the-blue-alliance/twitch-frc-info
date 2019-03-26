import React from 'react'
import styled from 'styled-components'

import BracketContext from './BracketContext'


const Alliance = styled.div`
  display: flex;
  flex-direction: ${props => props.rightSide ? 'row-reverse' : 'row'};
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
  ${props => props.rightSide ? 'margin-left' : 'margin-right'}: 0.5vw;
  ${props => props.isRed ? 'margin-top' : 'margin-bottom'}: 0.25vw;
`

const TeamContainer = styled.div`
  flex: 1;
  color: #000;
  font-size: 1.5vw;
  padding: 0.25vw;
`

const SeedContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25vw;
  background-color: ${props => props.isRed ? '#d04f27' : '#508bd3'};
`

const WinsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5vw;
  background-color: ${props => props.isRed ? '#d04f27' : '#508bd3'};
  ${props => props.isWinner && 'font-weight: bold;'}
`

const Seed = styled.div`
  font-size: 1.5vw;
`

const Wins = styled.div`
  font-size: 2.5vw;
`

const PlayoffMatchupAlliance = React.memo(({eventKey, color, seed, wins, winner, rightSide}) => {
  const isRed = color === 'red'
  const isWinner = color === winner
  return (
    <BracketContext.Consumer>
      {({selectedSeed, setSelectedSeed, allianceTeamKeys}) => {
        return (
          <Alliance
            isRed={isRed}
            notSelected={selectedSeed !== null && selectedSeed !== seed}
            rightSide={rightSide}
            onMouseEnter={() => setSelectedSeed(seed)}
            onMouseLeave={() => setSelectedSeed(null)}
          >
            <SeedContainer
              isRed={isRed}
            >
              <Seed>{seed}.</Seed>
            </SeedContainer>
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
            <WinsContainer
              isRed={isRed}
              isWinner={isWinner}
            >
              <Wins>{wins}</Wins>
            </WinsContainer>
          </Alliance>
        )
      }}
    </BracketContext.Consumer>
  )
})

export default PlayoffMatchupAlliance
