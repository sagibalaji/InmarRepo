import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Config from '../../js/config.js';
import Helpers from '../../js/helpers.js';

import './Frequency.css'

export default class Frequency extends React.Component {

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

  componentDidMount() {

    Helpers.resetPointer(Highcharts)

    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    });

    var options = {
      chart: {
        height: 250,
        type: 'column',
        zoomType: 'x',
        events: {
          selection: (e) => { this.updateQuery(e) }
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      title: {
        text: 'Adjusted Frequency',
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
          text: 'No. Articles/ week'
        }
      },
      tooltip: {
        positioner: function () {
          return {
            x: this.chart.chartWidth - this.label.width,
            y: -1
          }
        },
        borderWidth: 0,
        backgroundColor: 'none',
        headerFormat: '',
        pointFormat: '{point.y}',
        shadow: false,
        style: {
          fontSize: '16px'
        },
        valueDecimals: 0,
        valueSuffix: ' Articles'
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

    this.setState({ ready: false })

    fetch(Config.paths.FLASK_HOST + "/frequency/", {
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
        return [new Date(result.date).getTime(), result.frequency]
      });

      options.series = [{
        name: 'Frequency',
        color: 'rgba(0, 87, 151, 1)',
        pointPadding: 0,
        groupPadding: 0,
        borderWidth: 0,
        shadow: false,
        data: points
      }]

      return (
        <div id='EL-Frequency' onMouseMove={(e) => Helpers.syncCrosshair(Highcharts, e)}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      )
    }
  }
}