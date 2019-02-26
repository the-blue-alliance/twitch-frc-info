import React from 'react'
import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars';

const RobotImageContainer = styled.div`
  height: 30%;
  width: 15%;
  display: flex;
  flex-direction: column;
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
    background-color: ${props => props.isBlue ? '#508bd3' : '#d04f27'};
  }
`

const RobotImageThumb = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #fff;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: cover;
`

export default class RobotImageThumbnail extends React.Component {
  render() {
    const { teamNumber, image, ...restProps } = this.props

    return (
      <RobotImageContainer {...restProps}>
        <RobotImageThumb image={image} />
        <div>{teamNumber}</div>
      </RobotImageContainer>
    )

  }
}
