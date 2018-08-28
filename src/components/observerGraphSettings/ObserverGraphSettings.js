import React, { Component } from 'react';
import styled from 'styled-components';
import TopSettings from './topSettings/TopSettings';
import LinesSettings from './linesSettings/LinesSettings';

const padding = '15';
const Wrapper = styled.div`
  width: calc(32% - ${padding * 2});
  height: calc(100% - ${20 + padding * 2}px);
  border: 1px solid #999999;
  padding: ${padding}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 16px -5px rgba(0,0,0,0.6);

  @media(max-width: 768px) {
      width: calc(95% - ${padding * 2}px);
      border-top: 0;
  }
`;

class ObserverGraphSettings extends Component {
    render() {
        const { gains, offsets, colors, lineWidth } = this.props;

        return (
            <Wrapper>
                <TopSettings
                    lineWidth={lineWidth}
                    onFieldChanged={(type, value) => this.props.onFieldChanged(type, value)}
                    onAddRemark={() => this.props.onAddRemark()}
                />
                <LinesSettings
                    gains={gains}
                    offsets={offsets}
                    colors={colors}
                    onFieldChanged={(type, value, lineIndex) => this.props.onFieldChanged(type, value, lineIndex)}
                />
            </Wrapper>
        );
    }
}

export default ObserverGraphSettings;
