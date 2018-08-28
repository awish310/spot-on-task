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

class ObserverGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    handleChartHover = (event) => {
        const { isAddingRemark } = this.props;
        const { chartCli } = this;

        console.log(event);
    }
    handleChartClick = (event) => {
        const { chartCli } = this;
        window.google.visualization.events
            .removeListener(this.chart, 'onmouseover', this.handleChartHover);

        console.log(event.x);
    }
    calculateShadowDiv = (event) => {
        const { chartCli } = this;

        const { height, top } = chartCli.getBoundingBox('chartarea');
        const left = chartCli.getXLocation(0);
        const right = chartCli.getXLocation(3); // TODO: make dynamic
        const width = right - left;
        console.log(width);

        const { shadowDiv } = this.state;

        if (JSON.stringify(shadowDiv) !== JSON.stringify({ height, left, top, width })) {
            this.setState(() => ({
                shadowDiv: { height, left, top, width }
            }));
        }
    }
    chartEvents = [
        {
            eventName: 'ready',
            callback: (cbObj) => {
                const { chartWrapper } = cbObj;
                this.chart = chartWrapper.getChart();

                window.google.visualization.events
                    .addListener(this.chart, 'click', this.handleChartClick);

                window.google.visualization.events
                    .addListener(this.chart, 'onmouseover', this.handleChartHover);

                this.chartCli = this.chart.getChartLayoutInterface();
                this.calculateShadowDiv();
            },
        },
    ];
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
        const { options, isAddingRemark } = this.props;
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


    render() {
        const { shadowDiv } = this.state;
        const { markers, data } = this.props;
        const [header, ...restOfData] = data;
        const dataPoints = restOfData.length - 1;
        return (
            <Wrapper>
                <Chart
                    width='100%'
                    height='calc(100% - 20px)'
                    chartType='LineChart'
                    loader={<div>Loading Chart</div>}
                    data={this.generateData()}
                    options={this.generateOptions()}
                    chartEvents={this.chartEvents}
                />
                {!!shadowDiv && markers.map((marker, i) => (
                    <div
                        key={`marker-${i}`}
                        style={{
                            position: 'absolute',
                            height: shadowDiv.height,
                            backgroundColor: 'red',
                            width: '2px',
                            left: shadowDiv.left + (
                                ((marker - 1) / dataPoints) * shadowDiv.width
                            )
                        }}
                    ></div>
                ))}
            </Wrapper>
        );
    }
}
// 263.953 / 113.953
export default ObserverGraph;
