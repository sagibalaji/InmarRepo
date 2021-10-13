import React from 'react'
import { CSVLink } from "react-csv";
import ReactTable from "react-table";
import Config from '../../js/config.js';
import { Button, ProgressBar } from 'react-bootstrap'
import { ArrowDownCircleFill } from 'react-bootstrap-icons'
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import './Themes.css'

class Themes extends React.Component {

  //constructor
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      error: null,
      percent: 0,
      preFlight: true,
      ready: false,
      type: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    if (this.props !== nextProps) {
      this.setState({
        percent: 0,
        preFlight: true,
        ready: false
      })
    }
  }

  filterCaseInsensitive = (filter, row) => {

    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== 'undefined') {
      // filter by text in the table or if it's a object, filter by key
      if (typeof content === 'object' && content !== null && content.key) {
        return String(content.key).toLowerCase().includes(filter.value.toLowerCase());
      } else {
        return String(content).toLowerCase().includes(filter.value.toLowerCase());
      }
    }

    return true;
  };

  getData() {

    if (!this.props.searchState.articles.isLoading) {

      this.startProgress(10000)
      let type = this.state.type

      fetch(Config.paths.FLASK_HOST + "/theme/", {
        method: 'POST',
        body: JSON.stringify({
          query: this.props.searchState.articles.query,
          type: type
        })
      }).then(res => res.json())
        .then(result => {
          result.results.map((result) => {
            for (var i in result.sentence_list) {
              return {
                'sentence': result.sentence_list[i],
                'score': result.score_list[i]
              }
            }
          })

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

  handleOptionChange(event) {
    this.setState({
      type: event.target.value
    });
  };

  startProgress(loadTime) {

    var timer = setInterval(() => {
      this.setState({
        percent: this.state.percent + loadTime / 1000,
        preFlight: false
      })
    }, loadTime / 10)
    setTimeout(() => {
      clearInterval(timer)
    }, loadTime)
  }

  render() {

    var { data, error, percent, preFlight, ready, type } = this.state

    if (error) {
      return (<div>Error:{this.state.error}</div>)
    } else if (preFlight) {

      return (
        <div className='EL-PreFlight'>
          <form>
              <label>
                <input
                  type="radio"
                  name="targetted"
                  value={0}
                  checked={type == 0}
                  onChange={(e)=> {this.handleOptionChange(e)}}
                />
               <span> Targetted Themes</span>
              </label>
              <span></span>
              <br/>
              <label>
                <input
                  type="radio"
                  name="full"
                  value={1}
                  checked={type == 1}
                  onChange={(e)=> {this.handleOptionChange(e)}}
                />
                <span> All Themes</span>
                <span></span>
              </label>
          </form>
          <Button variant="success" onClick={() => { this.getData() }}>
            Extract Themes
          </Button>
        </div>
      )
    } else if (!ready) {
      return (
        <div className='EL-Progress'>
          <div>Extracting Themes</div>
          <ProgressBar now={percent} />
        </div>
      )
    } else {
      return (
        <div id='EL-Themes'>

          <CSVLink
            className='download'
            data={data.results}
            headers={[
              { label: "Avg Sentiment", key: "avg_sentiment" },
              { label: "Occurances", key: "count" },
              { label: "Phrase", key: "phrase" }
            ]}
            filename={"OVIE - Themes (" + this.props.searchState.q.value + ").csv"}>
            <ArrowDownCircleFill />
              Download Themes
          </CSVLink>

          <ReactTable
            ref={(r) => this.reactTable = r}
            data={data.results}
            columns={[
              {
                Header: "Theme",
                accessor: "phrase",
                className: "phrase",
                minWidth: 200
              },
              {
                Header: "Occurances",
                accessor: "count",
                className: "count"
              },
              {
                getProps: (state, rowInfo) => {
                  if (rowInfo && rowInfo.row) {
                    return {
                      className: "sentiment",
                      style: {
                        background:
                          rowInfo.row.avg_sentiment >= 0 ?
                            "rgba(20,170,75," + (rowInfo.row.avg_sentiment) + ")" :
                            "rgba(200,79,42," + (rowInfo.row.avg_sentiment * -1) + ")",
                        color:
                          rowInfo.row.avg_sentiment > -0.2 && rowInfo.row.avg_sentiment < 0.2 ?
                            "rgba(0,0,0,1)" :
                            "rgba(255,255,255,1)"
                      }
                    };
                  } else {
                    return {}
                  }
                },
                Header: "Sentiment",
                accessor: "avg_sentiment"
              }
            ]}
            defaultPageSize={24}
            className="rtable -striped -highlight"
            filterable
            defaultFilterMethod={this.filterCaseInsensitive}
            showPageJump={false}
            showPageSizeOptions={false}
            SubComponent={row => {

              let examples = row.original.sentence_list.map((val, i) => {
                return {
                  'sentence': row.original.sentence_list[i],
                  'score': row.original.score_list[i],
                  'source': row.original.source[i]
                }
              })

              return (
                <ReactTable
                  className="examples"
                  data={examples}
                  columns={[
                    {
                      accessor: "sentence",
                      className: "sentence",
                      minWidth: 247
                    },
                    {
                      accessor: "source",
                      className: "source"
                    },
                    {
                      getProps: (state, rowInfo) => {

                        if (rowInfo && rowInfo.row) {
                          return {
                            className: "sentiment",
                            style: {
                              background:
                                rowInfo.row.score >= 0 ?
                                  "rgba(20,170,75," + (rowInfo.row.score) + ")" :
                                  "rgba(200,79,42," + (rowInfo.row.score * -1) + ")",
                              color:
                                rowInfo.row.score > -0.2 && rowInfo.row.score < 0.2 ?
                                  "rgba(0,0,0,1)" :
                                  "rgba(255,255,255,1)"
                            }
                          };
                        } else {
                          return {}
                        }
                      },
                      accessor: "score"
                    }
                  ]}
                  minRows={0}
                  showPagination={false}
                />
              );
            }}
          />
        </div>
      )
    }
  }
}

export default Themes;