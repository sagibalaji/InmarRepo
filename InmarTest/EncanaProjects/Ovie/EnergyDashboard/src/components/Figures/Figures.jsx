import React from 'react'
import { CSVLink } from "react-csv";
import ReactTable from "react-table";
import Config from '../../js/config.js';
import { ArrowDownCircleFill } from 'react-bootstrap-icons'
import "react-table/react-table.css";
import './Figures.css'

class Figures extends React.Component {

  //constructor
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      ready: false
    }
  }

  componentDidMount() {
    if (!this.props.searchState.articles.isLoading) {
      this.getData()
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

    var entType = "MONEY"

    if (!this.props.searchState.articles.isLoading) {

      fetch(Config.paths.FLASK_HOST + "/entity/?type=" + entType, {
        method: 'POST',
        body: JSON.stringify(this.props.searchState.articles.query)
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

  render() {

    var { data, error, ready } = this.state

    if (error) {
      return (<div>Error:{this.state.error}</div>)
    } else if (!ready) {
      return (
        <div>Loading Figures...</div>
      )
    } else {

      return (
        <div id='EL-Figures'>

          <CSVLink
            className='button download'
            data={data.results}
            headers={[
              { label: "Avg Sentiment", key: "avg_sentiment" },
              { label: "Occurances", key: "count" },
              { label: "Figure", key: "entity" }
            ]}
            filename={"OVIE - Figures (" + this.props.searchState.q.value + ").csv"}>
            <ArrowDownCircleFill />
              Download Figures
          </CSVLink>

          <ReactTable
            data={data.results}
            columns={[
              {
                Header: "Figures",
                accessor: "entity",
                className: "entity",
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
                      className: 'sentiment',
                      style: {
                        background:
                          rowInfo.row.avg_sentiment >= 0 ?
                            "rgba(0,100,0," + (rowInfo.row.avg_sentiment) + ")" :
                            "rgba(255,0,0," + (rowInfo.row.avg_sentiment * -1) + ")",
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
            className="-striped -highlight"
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
                                  "rgba(0,100,0," + (rowInfo.row.score) + ")" :
                                  "rgba(255,0,0," + (rowInfo.row.score * -1) + ")",
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

export default Figures;