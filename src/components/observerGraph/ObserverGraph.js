import React, { Component } from 'react';
import styled from 'styled-components';
import Chart from 'react-google-charts';

const Wrapper = styled.div`
  position: relative;
  width: 62%;
  height: calc(100% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #999999;
  box-shadow: 0px 0px 16px -5px rgba(0,0,0,0.6);

  @media(max-width: 768px) {
      width: 95%;
  }
`;
const MarkerLine = styled.div`
    position: absolute;
    height: ${p => p.height ? `${p.height - 20}px` : 0};
    background-color: ${p => p.lineColor || '#000000'};
    z-index: ${p => p.zIndex || 1};
    width: 2px;
    left: ${p => p.left ? `${p.left}px` : 0};
`;
const MarkerLabel = styled.div`
    position: absolute;
    height: 20px;
    z-index: ${p => p.zIndex || 1};
    width: 50px;
    left: ${p => p.left ? `${p.left - 25}px` : 0};
    top: ${p => p.top ? `${p.top - 17}px` : 0};
    text-align: center;
`

class ObserverGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    chartEvents = [
        {
            eventName: 'ready',
            callback: (cbObj) => {
                const { chartWrapper } = cbObj;
                const chart = chartWrapper.getChart();
                this.chartCli = chart.getChartLayoutInterface();
                this.calculateShadowDiv();
            },
        },
    ];
    getDataPoints = () => {
        const { data } = this.props;
        const [header, ...restOfData] = data;
        return restOfData.length - 1;
    }
    calculateShadowDiv = (event) => {
        const { chartCli } = this;

        const { height, top } = chartCli.getBoundingBox('chartarea');
        const left = chartCli.getXLocation(0);
        const right = chartCli.getXLocation(3); // TODO: make dynamic
        const width = right - left;

        const { shadowDiv } = this.state;

        if (JSON.stringify(shadowDiv) !== JSON.stringify({ height, left, top, width })) {
            this.setState((prevState) => ({
                ...prevState,
                shadowDiv: { height, left, top, width }
            }));
        }
    }
    calculateLeft = (shadowDiv, marker, dataPoints) => {
        return shadowDiv.left + (((marker - 1) / dataPoints) * shadowDiv.width);
    }
    calculateMarkerPoint = (x) => {
        const { shadowDiv } = this.state;
        const { left, width } = shadowDiv;
        const dataPoints = this.getDataPoints();

        return ((x - left) / width * dataPoints) + 1;
    }
    handleMouseMove = (event) => {
        const { isAddingRemark } = this.props;
        if (!isAddingRemark) {
            return;
        }
        const { shadowDiv } = this.state;
        if (!shadowDiv) {
            return;
        }
        const { offsetX, offsetY } = event.nativeEvent;
        const { height, left, top, width } = shadowDiv;

        if (
            offsetX > left && offsetX < left + width &&
            offsetY > top && offsetY < top + height
        ) {
            const hoverPoint = this.calculateMarkerPoint(offsetX);

            this.setState((prevState) => ({
                prevState,
                hoverPoint,
            }));
        }
    }
    handleMouseLeave = () => {
        this.setState((prevState) => ({
            prevState,
            hoverPoint: false,
        }));
    }
    generateOptionsSeries = (colors) => {
        return colors.reduce((series, color, index) => {
            return {
                ...series,
                [index]: {
                    color
                },
            };
        }, {});
    }
    generateOptions = () => {
        const { options } = this.props;
        const { lineWidth, colors } = options;

        return {
            lineWidth,
            series: this.generateOptionsSeries(colors),
        };
    }
    generateData = () => {
        const { data: chartData, options } = this.props;
        const { gains, offsets } = options;
        const [header, ...data] = chartData;

        return [header, ...data.map(row => {
            const [label, ...lines] = row;

            return [label, ...lines.map((line, index) => {
                const [gain, offset] = [gains[index], offsets[index]];

                const parsedGain = isNaN(gain) ? 0 : parseFloat(gain);
                const parsedOffset = isNaN(offset) ? 0 : parseInt(offset, 10);

                if (!parsedGain && !parsedOffset) {
                    return line;
                }
                if (parsedGain) {
                    line = line * parsedGain;
                }
                if (parsedOffset) {
                    line = line + parsedOffset;
                }

                return line;
            })];
        })];
    }
    renderMarkers = (shadowDiv, markers, dataPoints) => {
        if (!shadowDiv) {
            return null;
        }
        const { height, top } = shadowDiv;
        return markers.map((marker, i) => {
            return (
                <React.Fragment>
                    <MarkerLine
                        key={`marker-${i}`}
                        height={height}
                        lineColor='red'
                        zIndex={2}
                        left={this.calculateLeft(shadowDiv, marker, dataPoints)}
                    ></MarkerLine>
                    <MarkerLabel
                        key={`marker-label-${i}`}
                        zIndex={2}
                        left={this.calculateLeft(shadowDiv, marker, dataPoints)}
                        top={top + height}
                    >
                        {Math.round(marker * 100) / 100}
                    </MarkerLabel>
                </React.Fragment>
            );
        })
    }
    renderMarkerHover = (shadowDiv, hoverPoint, dataPoints) => {
        if (!shadowDiv || !hoverPoint) {
            return null;
        }
        const { height, top } = shadowDiv;
        return (
            <React.Fragment >
                <MarkerLine
                    height={height}
                    lineColor='gray'
                    zIndex={0}
                    left={this.calculateLeft(shadowDiv, hoverPoint, dataPoints)}
                    onClick={() => this.props.onFieldChanged('markers', hoverPoint)}
                ></MarkerLine >
                <MarkerLabel
                    zIndex={0}
                    left={this.calculateLeft(shadowDiv, hoverPoint, dataPoints)}
                    top={top + height}
                >
                    {Math.round(hoverPoint * 100) / 100}
                </MarkerLabel>
            </React.Fragment>
        );
    }

    render() {
        const { shadowDiv, hoverPoint } = this.state;
        const { markers } = this.props;
        const dataPoints = this.getDataPoints();

        return (
            <Wrapper
                onMouseMove={this.handleMouseMove}
                onMouseLeave={this.handleMouseLeave}
            >
                <Chart
                    width='100%'
                    height='100%'
                    chartType='LineChart'
                    loader={<div>Loading Chart</div>}
                    data={this.generateData()}
                    options={this.generateOptions()}
                    chartEvents={this.chartEvents}
                />
                {this.renderMarkers(shadowDiv, markers, dataPoints)}
                {this.renderMarkerHover(shadowDiv, hoverPoint, dataPoints)}
            </Wrapper>
        );
    }
}

export default ObserverGraph;
