import React, { Component } from 'react';
import styled from 'styled-components';
import Input from '../../generalComponents/Input';
import Dropdown from '../../generalComponents/Dropdown';
import Colors from '../../../Colors';

const Wrapper = styled.div`
    width: 100%;
    flex: 1;

    @media(max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
    }
`;
const Title = styled.p`
    color: #000000;
    font-weight: bold;
`;
const InputsWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;

    @media(max-width: 768px) {
      flex-direction: column;
      align-items: center;
      margin: 0;
    }
`;
class LineSettings extends Component {

    render() {
        const { index: lineIndex, settings } = this.props;

        return (
            <Wrapper>
                <Title>Line {lineIndex + 1}</Title>
                <Dropdown
                    label='Color'
                    wrapperWidth='40%'
                    inputWidth='70%'
                    value={settings.color}
                    options={Colors}
                    onChange={(value) => this.props.onFieldChanged('colors', value, lineIndex)}
                />
                <InputsWrapper>
                    <Input
                        wrapperWidth='40%'
                        inputWidth='70%'
                        value={settings.gain}
                        label='Gain'
                        step={0.1}
                        onChange={(value) => this.props.onFieldChanged('gains', value, lineIndex)}
                    />
                    <Input
                        wrapperWidth='40%'
                        inputWidth='70%'
                        value={settings.offset}
                        label='Offset'
                        step={1}
                        onChange={(value) => this.props.onFieldChanged('offsets', value, lineIndex)}
                    />
                </InputsWrapper>
            </Wrapper>
        );
    }
}

export default LineSettings;
