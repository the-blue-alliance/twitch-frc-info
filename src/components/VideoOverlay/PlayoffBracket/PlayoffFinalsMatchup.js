import React from 'react'
import styled from 'styled-components'

import BracketContext from './BracketContext'
import Spacer from './Spacer'
import PlayoffMatchupFinalsAlliance from './PlayoffMatchupFinalsAlliance'

const CenterSpacer = styled.div`
  min-height: 1vw;
`

const PlayoffFinalsMatchup = React.memo(({eventKey, winner}) => {
  return (
    <BracketContext.Consumer>
      {({selectedSeed, winStats}) => {
        let redSeed = '?'
        let redWins = '?'
        let blueSeed = '?'
        let blueWins = '?'
        let winner = null
        if (winStats && winStats.f) {
          redSeed = winStats.f[1].redAllianceId + 1
          redWins = winStats.f[1].redWins
          blueSeed = winStats.f[1].blueAllianceId + 1
          blueWins = winStats.f[1].blueWins
          winner = winStats.f[1].winner
        }
        return (
          <React.Fragment>
            <Spacer />
            <PlayoffMatchupFinalsAlliance
              eventKey={eventKey}
              color='red'
              seed={redSeed}
              wins={redWins}
              winner={winner}
            />
            <CenterSpacer />
            <PlayoffMatchupFinalsAlliance
              eventKey={eventKey}
              color='blue'
              seed={blueSeed}
              wins={blueWins}
              winner={winner}
            />
            <Spacer />
          </React.Fragment>
        )
      }}
    </BracketContext.Consumer>
  )
})

export default PlayoffFinalsMatchup
