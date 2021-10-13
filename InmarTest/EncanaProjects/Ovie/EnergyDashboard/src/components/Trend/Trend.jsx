import React from 'react'
import { CSVLink } from 'react-csv'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Config from '../../js/config.js';
import Helpers from '../../js/helpers.js';
import { ArrowDownCircleFill } from 'react-bootstrap-icons'
import './Trend.css'

export default class Trend extends React.Component {

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

		var options = {
			chart: {
				height: 250,
				type: 'area',
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
				text: 'Trend Score',
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
					text: 'Score'
				}
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
				valueDecimals: 1,
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

			fetch(Config.paths.FLASK_HOST + "/trend/", {
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

		var { data, error, ready, options } = this.state;

		if (error) {
			return (<div>Error:{this.state.error}</div>)
		} else if (!ready) {
			return (<div>Loading...</div>)
		} else {

			var points = data.results.map(function (result) {
				return [new Date(result.date).getTime(), result.trend]
			});

			options.series = [{
				name: 'Score',
				color: 'rgba(35, 170, 128, 1)',
				negativeColor: 'rgba(189, 71, 42,1)',
				fillOpacity: 0.1,
				data: points
			}]

			return (
				<div id='EL-Trend' onMouseMove={(e) => Helpers.syncCrosshair(Highcharts, e)}>
					
					<CSVLink
            className='download'
            data={data.results}
            headers={[
							{ label: "Date", key:"date"},
              { label: "Adjusted Frequency", key: "frequency" },
              { label: "Avg Sentiment", key: "sentiment" },
              { label: "Trend Score", key: "trend" }
            ]}
            filename={"OVIE - Metrics ("+this.props.searchState.q.value+").csv"}>
              <ArrowDownCircleFill />
              Download Metrics
          </CSVLink>
					
					<HighchartsReact
						highcharts={Highcharts}
						options={options}
					/>
				</div >
			)
		}

	}
}