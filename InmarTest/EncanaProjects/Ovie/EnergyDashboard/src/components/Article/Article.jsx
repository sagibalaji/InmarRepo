import React from 'react';
import config from '../../js/config.js'
import './Article.css';

export default class Article extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
            options: {},
            ready: false
        }
    }

    formatDate(timestamp) {
        var date = new Date(timestamp)
        console.log(date.toDateString())
        return date.toDateString()
    }

    componentDidMount(){

        let id = this.props.id
        this.getData(id)
    }

    getData(id) {

        this.setState({ ready: false })

        fetch(config.paths.FLASK_HOST + "/article/"+id+"/", {
            method: 'GET'
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

    render() {

        var { data, error, ready } = this.state

        if (error) {
            return (<div>Error:{this.state.error}</div>)
        } else if (!ready) {
            return (
                <div>Loading Article</div>
            )
        } else {
            return (
                <div id='EL-Article2'>
                    {data.map((a, i) => (
                        <div key={i} className='container'>
                            <div className='title'>{a._source.title}</div>
                            <div className='info'>
                                <span className='source'>{a._source.source.name}</span>
                                <span className='date'>{this.formatDate(a._source.estimatedPublishedDate)}</span>
                            </div>
                            <div className='body'>{a._source.content.split('\n').map((b, i) => (
                                <div key={'body' + i}>
                                    <span value={(i + 1) % 5 === 0 ? '<br/><br/>' : ''}></span>
                                    <span>{b}</span>
                                </div>
                            ))}</div>
                            <div className='copyright'>{a._source.copyright}</div>
                        </div>
                    ))}
                </div>
            )
        }
    }

}