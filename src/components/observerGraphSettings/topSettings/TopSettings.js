import React, { Component } from 'react';
import styled from 'styled-components';
import Input from '../../generalComponents/Input';

const Wrapper = styled.div`
    width: 100%;
    height: 15%;
    border-bottom: 2px solid #999999;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const AddMarkerBtn = styled.div`
    width: 130px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2d7b84;
    color: #ffffff;
    cursor: pointer;

    :hover {
        opacity: 0.7;
    }
`;

class TopSettings extends Component {

    render() {
        const { lineWidth } = this.props;
        return (
            <Wrapper>
                <Input
                    wrapperWidth='50%'
                    inputWitdh='60%'
                    label='Line Width'
                    step={1}
                    value={lineWidth}
                    onChange={(value) => this.props.onFieldChanged('lineWidth', value)}
                />
                <AddMarkerBtn
                    onClick={() => this.props.onAddRemark()}
                >ADD MARKER</AddMarkerBtn>
            </Wrapper >
        );
    }
}

export default TopSettings;
