import React, { Component } from 'react';
import {
  DataSearch, DateRange, MultiDataList, MultiList, ReactiveComponent,
  ReactiveList, SelectedFilters, SingleDataList, StateProvider
} from '@appbaseio/reactivesearch'
import { CSVLink } from 'react-csv'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Frequency from './components/Frequency/Frequency.jsx'
import Entities from './components/Figures/Figures.jsx'
import Preview from './components/Preview/Preview.jsx'
import Sentiment from './components/Sentiment/Sentiment.jsx'
import Themes from './components/Themes/Themes.jsx'
import Trend from './components/Trend/Trend.jsx'
import Tour from './components/Tour/Tour.jsx'

import { ArrowDownCircleFill } from 'react-bootstrap-icons'
import { Spinner } from 'react-bootstrap'
import ovie from './img/ovie.svg'
import logo from './img/ovie-logo-sml.png'
import config from './js/config.js';

export default class Home extends Component {

  //constructor
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      searchState: {},
      selectedArticle: null
    }
  }

  componentDidUpdate() {

    if (this.state.selectedArticle == null) {
      let firstArticle = this.state.articles[0]._id
      this.setState({
        selectedArticle: firstArticle
      })
    }
  }

  render() {

    return (

      <div id='EL-App'>

        <div id='EL-Header'>

          <div id='EL-HeaderTop'>
            <div id='EL-Ovie'>
              <a href="/">
                <img className='icon' src={ovie} alt='Ovintiv Logo' />
                <span className="title">Ovie</span>
                <span className='tag'>Powered by AI</span>
              </a>
            </div>

            <div id='EL-SearchBox'>
              <DataSearch
                componentId="q"
                dataField={["title", "content"]}
                autosuggest={false}
                defaultValue="Ovintiv"
                queryFormat="and"
                fieldWeights={[100, 0]}
                highlight={true}
                customHighlight={props => ({
                  highlight: {
                    pre_tags: ['<mark>'],
                    post_tags: ['</mark>'],
                    fields: {
                      content: {
                        fragment_size: 500,
                        number_of_fragments: 50
                      }
                    }
                  }
                })}
                searchOperators={true}
                showClear={true}
                debounce={1000000}
                defaultSuggestions={[]}
                filterLabel='Search'
                onChange={(e, triggerQuery) => {
                  if (e.key === "Enter") {
                    triggerQuery()
                  }
                }}
                URLParams={true}
              />

            </div>

            <div id='EL-Range'>
              <DateRange
                componentId="period"
                dataField="estimatedPublishedDate"
                placeholder={{
                  start: 'Start Date',
                  end: 'End Date',
                }}
                numberOfMonths={2}
                react={{
                  "and": ["q", "period"]
                }}
                URLParams={true}
              />
            </div>

            <div id='EL-Logo'>
              <img className='icon' src={logo} alt='Ovintiv Logo' />
              <Tour />
            </div>
          </div>

        </div>

        <div id='EL-Body'>

          <StateProvider
            includeKeys={['isLoading', 'hits', 'query']}
            onChange={(prevState, nextState) => {
              if (!nextState.articles.isLoading) {
                this.setState({
                  articles: nextState.articles.hits.hits,
                  searchState: nextState
                })
              }
            }}
          />

          <div id="EL-Left">
            <div id="EL-Refiners">

              <SingleDataList
                componentId="type"
                dataField="type.keyword"
                data={config.types}
                defaultValue='News Articles'
                title="Document Type"
                showRadio={true}
                showSearch={false}
                showFilter={true}
                URLParams={true}
              />
              <MultiDataList
                componentId="sources.business"
                dataField="source.name.keyword"
                data={config.sources.business}
                filterLabel="Source"
                nestedField="source"
                showSearch={false}
                title="Business & Finance"
                URLParams={true}
              />

              <MultiDataList
                componentId="sources.energy"
                dataField="source.name.keyword"
                data={config.sources.energy}
                nestedField="source"
                filterLabel="Source"
                showSearch={false}
                title="Energy"
                URLParams={true}
              />

              <MultiDataList
                componentId="sources.national"
                dataField="source.name.keyword"
                data={config.sources.national}
                filterLabel="Source"
                nestedField="source"
                showSearch={false}
                title="National"
                URLParams={true}
              />

              <MultiDataList
                componentId="sources.tech"
                dataField="source.name.keyword"
                data={config.sources.tech}
                filterLabel="Source"
                nestedField="source"
                showSearch={false}
                title="Technology"
                URLParams={true}
              />

            </div>
          </div>

          <div id="EL-Middle-Left">

            <div id='EL-Article-Header'>
              <SelectedFilters
                className='filters'
                showClearAll={false}
              />
              <CSVLink
                className='download'
                data={this.state.articles}
                headers={[
                  { label: "Date", key: "_source.estimatedPublishedDate" },
                  { label: "Title", key: "_source.title" },
                  { label: "Source", key: "_source.source.name" },
                  { label: "Link", key: "_source.url" }
                ]}
                filename={"OVIE - Article Export.csv"}>
                <ArrowDownCircleFill />
                Download Articles
              </CSVLink>
            </div>

            <div id='EL-Articles'>
              <ReactiveList
                componentId="articles"
                dataField="title"
                includeFields={[
                  'extract',
                  'estimatedPublishedDate',
                  'source',
                  'title',
                  'url']}
                loader={<Spinner animation="border" size="sm" />}
                pagination={true}
                react={{
                  "and": [
                    "q",
                    "period",
                    "type"
                  ],
                  "or": [
                    "sources.all",
                    "sources.business",
                    "sources.energy",
                    "sources.national",
                    "sources.tech"
                  ]
                }}
                renderItem={(res) => {
                  return (
                    <div key={res._id} className={this.state.selectedArticle === res._id ? "hit active" : "hit"} onClick={() => this.setState({ selectedArticle: res._id })}>
                      <div className='title' dangerouslySetInnerHTML={{ __html: res.title }} />
                      <div className='extract' dangerouslySetInnerHTML={{ __html: res.extract + '....' }} />
                      <div className='details'>
                        <div className='source'>{res.source.name}</div>
                        <div className='date'>{new Date(res.estimatedPublishedDate).toDateString()}</div>
                      </div>
                    </div>
                  )
                }}
                size={10}
                renderResultStats={this.ResultStats}
                defaultQuery={() => {
                  return {
                    "sort": {
                      "estimatedPublishedDate": {
                        "order": "desc"
                      }
                    }
                  }
                }}
              />

            </div>
          </div>

          <div id="EL-Middle-Right">

            <div id='EL-Article'>
              <Preview selectedArticle={this.state.selectedArticle} />
            </div>

          </div>

          <div id='EL-Right'>

            <Tabs>
              <TabList>
                <Tab>Metrics</Tab>
                <Tab>Themes</Tab>
                <Tab>Figures ($)</Tab>
              </TabList>
              <TabPanel forceRender={true}>
                <ReactiveComponent
                  componentId='period'
                  render={({ aggregations, setQuery }) => (
                    <div className='charts'>
                      <Frequency
                        searchState={this.state.searchState}
                        setQuery={setQuery}
                      />
                      <Sentiment
                        searchState={this.state.searchState}
                        setQuery={setQuery}
                      />
                      <Trend
                        searchState={this.state.searchState}
                        setQuery={setQuery}
                      />
                    </div>
                  )}
                  URLParams={true}
                />
              </TabPanel>
              <TabPanel forceRender={true}>
                <Themes searchState={this.state.searchState} />
              </TabPanel>
              <TabPanel>
                <Entities searchState={this.state.searchState} />
              </TabPanel>
            </Tabs>

          </div>

        </div>

      </div>

    );
  }
}