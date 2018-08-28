import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: ${p => p.width ? p.width : '100px'};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const InputEl = styled.input`
    box-sizing: border-box;
    width: ${p => p.width ? p.width : '50%'};
    height: ${p => p.height ? p.height : '32px'};
    color: #000000;
    background: white;
    border: 1px solid #222222;
    font-size: 16px;
    padding: 4px;
`;

const Label = styled.label`
    font-size: 16px;
    color: #222222;
`;

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }
    componentDidMount() {
        const { value } = this.props;
        this.setState(prevState => {
            return {
                ...prevState,
                value,
            };
        });
    }
    componentWillReceiveProps(newProps) {
        const { value } = newProps;
        this.setState(() => {
            return {
                value,
            };
        });
    }
    handleInputChanges(e) {
        this.props.onChange(e.target.value);
    }
    onFocus = (e) => {
        if (this.props.selectOnFocus) {
            e.target.select();
        }
    };

    render() {
        const uniqId = Date.now();
        const { wrapperWidth, inputWidth, label, step } = this.props;
        return (
            <Wrapper width={wrapperWidth}>
                <Label htmlFor={uniqId}>{label}:</Label>
                <InputEl
                    id={uniqId}
                    width={inputWidth}
                    min={0}
                    type='number'
                    step={step}
                    value={this.state.value}
                    onInput={e => this.handleInputChanges(e)}
                    onFocus={e => this.onFocus(e)}
                />
            </Wrapper>
        );
    }
}
export default Input;
