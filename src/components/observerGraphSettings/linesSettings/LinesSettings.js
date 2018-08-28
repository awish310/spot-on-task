import React, { Component } from 'react';
import styled from 'styled-components';
import LineSettings from './LineSettings';

const Wrapper = styled.div`
  width: 100%;
  height: 84%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media(max-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
  }
`;

class LinesSettings extends Component {

    renderLines = () => {
        const { gains, offsets, colors } = this.props;

        // Targum;
        const linesSettings = colors.reduce((_linesSettings, color, index) => {
            const gain = gains[index];
            const offset = offsets[index];
            return [..._linesSettings, {
                gain,
                offset,
                color,
            }];
        }, []);

        return linesSettings ? linesSettings.map((ls, i) => {
            return (
                <LineSettings
                    key={i}
                    settings={ls}
                    index={i}
                    onFieldChanged={(type, value, lineIndex) => this.props.onFieldChanged(type, value, lineIndex)}
                />
            );
        }) : null;
    }
    render() {
        return (
            <Wrapper>
                {this.renderLines()}
            </Wrapper>
        );
    }
}

export default LinesSettings;