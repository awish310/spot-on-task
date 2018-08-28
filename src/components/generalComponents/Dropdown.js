import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
    width: ${p => p.width ? p.width : '100px'};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const DropdownEl = styled.select`
 	width: ${p => p.width ? p.width : '50%'};
 	background-color: white;
  border: 1px solid #222222;
  border-radius: 0;
  display: inline-block;
  line-height: 1.5em;
  padding: 0.2em;
	font-size: 16px;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
	background-image:
    linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, black 50%, transparent 50%),
    linear-gradient(to right, #ccc, #ccc);
  background-position:
    calc(100% - 20px) calc(0.7em + 2px),
    calc(100% - 15px) calc(0.7em + 2px),
    calc(100% - 2.5em) 0.2em;
  background-size:
    5px 5px,
    5px 5px,
    1px 1.5em;
  background-repeat: no-repeat;
}
`;
const Label = styled.label`
    font-size: 16px;
    color: #222222;
`;

class Dropdown extends React.Component {

  handleDropdownChanges(e) {
    this.props.onChange(e.target.value);
  }
  renderOptions = (options) => {
    return options ? options.map((option, i) => {
      return (
        <option
          key={i}
          value={option.value}
        >
          {option.name}
        </option>
      );
    }) : null;
  }
  render() {
    const uniqId = Date.now();
    const { wrapperWidth, inputWidth, label, options, value } = this.props;
    return (
      <Wrapper width={wrapperWidth}>
        <Label htmlFor={uniqId}>{label}:</Label>
        <DropdownEl
          width={inputWidth}
          id={uniqId}
          value={value}
          onChange={e => this.handleDropdownChanges(e)}
        >
          {this.renderOptions(options)}
        </DropdownEl>
      </Wrapper>
    );
  }
}


export default Dropdown;