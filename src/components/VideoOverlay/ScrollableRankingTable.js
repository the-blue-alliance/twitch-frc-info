import React from 'react'
import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars';

const ScrollThumb = styled.div`
  background-color: #fff;
  width: 8px;
  border-radius: 4px;

`

const RankingTable = styled.table`
  width: 80%;
  margin: 0 auto;
  text-align: center;
`

const ErrorMessage = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 2.5vw;
`

export default class ScrollableRankingTable extends React.Component {
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
    const { rankings } = this.props
    const { hasError } = this.state

    if (hasError) {
      return <ErrorMessage>No Rankings Available</ErrorMessage>
    }

    if (rankings) {
      return (
        <Scrollbars
          renderThumbVertical={props => <ScrollThumb {...props}/>}
        >
          <RankingTable>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>W-L-T</th>
              <th># Matches</th>
            </tr>
          {rankings.map(ranking => {
            return (
              <tr key={ranking.rank}>
                <td>{ranking.rank}</td>
                <td>{ranking.team_key.substring(3)}</td>
                <td>{ranking.record.wins}-{ranking.record.losses}-{ranking.record.ties}</td>
                <td>{ranking.matches_played}</td>
              </tr>
             )
          })}
          </RankingTable>
        </Scrollbars>
      )
    } else {
      return null
    }
  }
}
