module.exports = {

	resetPointer: function (Highcharts) {
		Highcharts.Point.prototype.highlight = function (event) {
			this.onMouseOver() // Show the hover marker
			this.series.chart.tooltip.refresh(this) // Show the tooltip
			this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
		}
	},

	syncCrosshair: function (Highcharts, e) {

		e.persist()
		Highcharts.each(Highcharts.charts, (chart) => {

			if (chart) {
				let event = chart.pointer.normalize(e.nativeEvent) // Find coordinates within the chart
				let point = chart.series[0].searchPoint(event, true) // Get the hovered point
				if (point) point.highlight(e)
			}
		})
	},

	syncExtremes: function (Highcharts, e) {

		if (e.trigger !== 'syncExtremes') {
			Highcharts.each(Highcharts.charts, function (chart) {
				if (chart.xAxis[0].setExtremes) {
					chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
						trigger: 'syncExtremes'
					})
				}
			})
		}
	}
	
}