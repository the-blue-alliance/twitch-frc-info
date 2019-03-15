import React from 'react'
import styled from 'styled-components'

import BracketContext from './BracketContext'
import Spacer from './Spacer'
import PlayoffMatchupAlliance from './PlayoffMatchupAlliance'

const CenterSpacer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  flex-grow: 1;
  flex-direction: ${props => props.rightSide ? 'row-reverse' : 'row'};
  min-height: 1vw;
`

const Join = styled.div`
  display: flex;
  align-items: flex-start;
  ${props => props.rightSide ? 'border-right: 0.3vw solid;' : 'border-left: 0.3vw solid;'}
  ${props => props.joinBottom && 'align-items: flex-end;'}
  border-color: ${props => props.winner === 'red' ? '#d04f27' : `${props.winner === 'blue' ? '#508bd3' : '#aaa'}`};
  opacity: ${props => props.notSelected ? 0.3 : 1};
`

const JoinBar = styled.div`
  border-bottom: 0.3vw solid;
  border-color: ${props => props.winner === 'red' ? '#d04f27' : `${props.winner === 'blue' ? '#508bd3' : '#aaa'}`};
  width: 2vw;
  margin: 1vw 0;
`

const PlayoffMatchup = React.memo(({eventKey, compLevel, setNumber, rightSide}) => {
  return (
    <BracketContext.Consumer>
      {({selectedSeed, winStats}) => {
        let redSeed = '?'
        let redWins = '?'
        let blueSeed = '?'
        let blueWins = '?'
        let winner = null
        if (winStats && winStats[compLevel]) {
          redSeed = winStats[compLevel][setNumber].redAllianceId + 1
          redWins = winStats[compLevel][setNumber].redWins
          blueSeed = winStats[compLevel][setNumber].blueAllianceId + 1
          blueWins = winStats[compLevel][setNumber].blueWins
          winner = winStats[compLevel][setNumber].winner
        }

        let winnerSeed = null
        if (winner === 'red') {
          winnerSeed = redSeed
        } else if (winner === 'blue') {
          winnerSeed = blueSeed
        }

        return (
          <React.Fragment>
            <Spacer />
            <PlayoffMatchupAlliance
              eventKey={eventKey}
              color='red'
              seed={redSeed}
              wins={redWins}
              isWinner={winner === 'red'}
              rightSide={rightSide}
            />
            <CenterSpacer
              rightSide={rightSide}
            >
              <Join
                rightSide={rightSide}
                joinBottom={rightSide && compLevel === 'sf'}
                winner={winner}
                notSelected={selectedSeed !== null && winnerSeed !== selectedSeed}
              >
                <JoinBar
                  winner={winner}
                />
              </Join>
            </CenterSpacer>
            <PlayoffMatchupAlliance
              eventKey={eventKey}
              color='blue'
              seed={blueSeed}
              wins={blueWins}
              isWinner={winner === 'blue'}
              rightSide={rightSide}
            />
            <Spacer />
          </React.Fragment>
        )
      }}
    </BracketContext.Consumer>
  )
})

export default PlayoffMatchup
