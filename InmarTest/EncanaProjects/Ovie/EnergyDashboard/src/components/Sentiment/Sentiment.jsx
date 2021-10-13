import React from 'react';
import Highcharts from 'highcharts'
import ColorAxis from 'highcharts/modules/coloraxis'
import HighchartsReact from 'highcharts-react-official'
import Config from '../../js/config.js';
import Helpers from '../../js/helpers.js';

import '../Sentiment/Sentiment.css'

export default class Sentiment extends React.Component {

  //constructor
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      options: {},
      ready: false
    }
  }

  //events
  componentDidMount() {

    Helpers.resetPointer(Highcharts)

    ColorAxis(Highcharts)

    var options = {
      chart: {
        height: 250,
        type: 'scatter',
        zoomType: 'x',
        events: {
          selection: (e) => { this.updateQuery(e) }
        }
      },
      colorAxis: {
        min: -0.2,
        max: 0.2,
        stops: [
          [-0.5, 'rgba(189, 71, 42,1)'],
          [0.5, 'rgba(227, 204, 31, 1)'],
          [1.0, 'rgba(35, 170, 128, 1)']
        ]
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      title: {
        text: 'Sentiment Analysis',
        align: 'left',
        x: 0,
        style: {
          fontSize: '16px'
        }
      },
      xAxis: {
        crosshair: true,
        events: {
          setExtremes: this.props.syncExtremes
        },
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Avg. Sentiment/ week'
        },
        plotLines: [{
          color: '#838383',
          width: 2,
          value: 0
        }]
      },
      tooltip: {
        positioner: function () {
          return {
            x: this.chart.chartWidth - this.label.width, // right aligned
            y: -1 // align to title
          }
        },
        borderWidth: 0,
        backgroundColor: 'none',
        headerFormat: '',
        pointFormat: '{point.y}',
        shadow: false,
        style: {
          fontSize: '16px',

        },
        valueDecimals: 2,
        valuePrefix: 'Score: '
      }
    }

    this.setState({
      options: options
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchState !== nextProps.searchState) {
      this.getData(nextProps)
    }
  }

  getData(props) {

    if (!props.searchState.articles.isLoading) {
      this.setState({ ready: false })

      fetch(Config.paths.FLASK_HOST + "/sentiment/", {
        method: 'POST',
        body: JSON.stringify(props.searchState.articles.query)
      }).then(res => res.json())
        .then(result => {
          this.setState({
            data: result,
            ready: true
          });
        })
        .catch(err => {
          this.setState({
            error: err.toString(),
            ready: false
          })
        }
        )
    }
  }

  updateQuery(event) {
    
    let start = new Date(event.xAxis[0].min).toISOString().split('T')[0]
    let end = new Date(event.xAxis[0].max).toISOString().split('T')[0]
  
    if (event.xAxis) {

      const query = {
        query: {
          bool: {
            must: {
              range: {
                estimatedPublishedDate: {
                  gte: start,
                  lte: end
                }
              }
            }
          }
        }
      };

      this.props.setQuery({
        query,
        value: [start, end]
      });
    }
  }

  render() {

    var { data, error, options, ready } = this.state

    if (error) {
      return (<div>Error:{this.state.error}</div>)
    } else if (!ready) {
      return (<div>Loading...</div>)
    } else {

      var points = data.results.map(function (result) {
        return {
          x: new Date(result.date).getTime(),
          y: result.sentiment
        }
      });

      options.series = [{
        name: 'Avg. Sentiment',
        marker: {
          radius: 3
        },
        colorKey: 'y',
        data: points
      }]

      return (
        <div id="EL-Sentiment" onMouseMove={(e) => Helpers.syncCrosshair(Highcharts, e)}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      )
    }
  }

}