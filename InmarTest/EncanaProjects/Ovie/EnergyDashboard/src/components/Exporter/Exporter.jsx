import React from 'react';
import FileSaver from 'file-saver';
import Config from '../../js/config.js';

import './Exporter.css'

export default class Exporter extends React.Component {

    //constructor
    constructor(props) {
        super(props);
        this.state = {
            ready: true
        }
    }

    exportResults() {

        let {companies, keywords, sources, range} = this.props;
        let path = [Config.paths.FLASK_HOST + "/theme/?"]

        if (companies.length > 0) { path.push("&companies=" +companies) }
        if (keywords.length > 0) { path.push("&keywords=" +keywords) }
        if (sources.length > 0) { path.push("&sources=" +sources) }
        if (range.length > 0) { path.push("&start=" +range[0]+"&end="+range[1]) }


        this.setState({ ready: false })
        fetch(path.join(""),
            {
                headers: {
                    'Accept': 'text/csv',
                    'Content-Disposition': 'attachment'
                }
            }).then(resp => {
                return resp.blob();
            }).then(blob => {
                FileSaver.saveAs(blob, 'ELM-export.csv');
                this.setState({ ready: true })
            },
                (error) => {
                    this.setState({
                        error: error,
                        ready: true
                    })
                }
            )
    }

    render() {
        if (!this.state.ready) {
            return (
                <div id='EL-Exporter' >
                    <Glyphicon className='spin loading' glyph="repeat" />
                </div>
            )
        } else {
            return (
                <div id='EL-Exporter' onClick={() => this.exportResults()}>
                    <Glyphicon className='icon' glyph="download-alt" />
                </div>
            )
        }
    }

}