import React, { Component } from 'react';
import styled from 'styled-components';
import ObserverGraph from './components/observerGraph/ObserverGraph';
import ObserverGraphSettings from './components/observerGraphSettings/ObserverGraphSettings';
import './App.css';
import Data from './Data';

const Wrapper = styled.div`
	width: 100%;
  height: 100%;
`;
const HeaderWrapper = styled.div`
  height: 50px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 1.5em;
  color: #222222;
`;
const Main = styled.div`
  width: 100%;
  height: calc(100% - 90px);
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media(max-width: 768px) {
    flex-direction: column;
  }
`;
const initialData = Data.data;
const initialGains = Data.gains;
const initialOffsets = Data.offsets;
const initialMarkers = Data.markers;
const initialLineWidth = Data.lineWidth;
const initialColors = Data.colors;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initialData,
      gains: initialGains,
      offsets: initialOffsets,
      colors: initialColors,
      lineWidth: initialLineWidth,
      markers: initialMarkers,
      isAddingRemark: false,
    };
  }
  generateObserverGraphOptions = () => {
    const { gains, offsets, colors, lineWidth } = this.state;

    return {
      lineWidth,
      colors,
      gains,
      offsets,
    };
  }
  getParsedValue = (value, type, fallback) => {
    switch (type) {
      case 'int':
        return isNaN(value) ? fallback : parseInt(value, 10)
      case 'float':
        return isNaN(value) ? fallback : parseFloat(value)
      default:
        return value;
    }
  }
  generateStateByProperty = (property, value, lineIndex, prevState, type, fallback) => {
    return {
      ...prevState,
      [property]: [
        ...prevState[property].slice(0, lineIndex),
        this.getParsedValue(value, type, fallback),
        ...prevState[property].slice(lineIndex + 1)]
    }
  }
  generateNextState = (property, value, lineIndex, prevState) => {
    switch (property) {
      case 'colors':
        return this.generateStateByProperty(property, value, lineIndex, prevState, 'string');
      case 'lineWidth':
        return {
          ...prevState,
          lineWidth: this.getParsedValue(value, 'int', initialLineWidth),
        };
      case 'gains':
        return this.generateStateByProperty(property, value, lineIndex, prevState, 'float', 0);
      case 'offsets':
        return this.generateStateByProperty(property, value, lineIndex, prevState, 'int', 0);
      default:
        return prevState;
    }
  }
  handleFieldChanged = (type, value, lineIndex) => {
    this.setState((prevState) => this.generateNextState(type, value, lineIndex, prevState));
  }
  handleAddingRemark = () => {
    this.setState((prevState) => ({
      ...prevState,
      isAddingRemark: true,
    }));
  }
  render() {
    const { data, gains, offsets, colors, lineWidth, markers, isAddingRemark } = this.state;

    return (
      <Wrapper>
        <HeaderWrapper>
          <Title>ObserverGraph App</Title>
        </HeaderWrapper>
        <Main>
          <ObserverGraph
            data={data}
            options={this.generateObserverGraphOptions()}
            markers={markers}
            isAddingRemark={isAddingRemark}
          />
          <ObserverGraphSettings
            gains={gains}
            offsets={offsets}
            colors={colors}
            lineWidth={lineWidth}
            onFieldChanged={(type, value, lineIndex) => this.handleFieldChanged(type, value, lineIndex)}
            onAddRemark={this.handleAddingRemark}
            onSelectMarker={(row, column) => { console.log(row, column) }}
          />
        </Main>
      </Wrapper>
    );
  }
}

export default App;
