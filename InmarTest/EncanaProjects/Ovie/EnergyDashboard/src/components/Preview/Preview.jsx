import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch'
import './Preview.css';

export default class Article extends React.Component {

	//constructor
	constructor(props) {
		super(props);
		this.state = {
			query: {},
			ready: false
		}
	}

	componentWillReceiveProps(nextProps) {

		this.setState({ ready: false })

		if (nextProps.selectedArticle) {

			let articleID = nextProps.selectedArticle
			
			let query = {
				"query": {
					"match": {
						"_id": articleID
					}
				}
			}

			this.setState({
				query: query,
				ready: true
			})
		}
	}

	render() {

		let { ready } = this.state

		if (!ready) {
			return null
		} else {

			console.log(this.state.query)
			
			return (
				<ReactiveList
					componentId="article"
					dataField="title"
					includeFields={[
						'content',
						'title']}
					loader="Loading..."
					infiniteScroll={false}
					react={{
						"and": [
							"q"
						]
					}}
					renderItem={(res) => {
						return (
							<div key={res._id} className='hit'>
								<div className='title'>
									<a href={'/detail/' + res._id} target='_blank' dangerouslySetInnerHTML={{ __html: res.title }} />
								</div>
								{res.highlight.content ?
								<div className='content'>
									{res.highlight.content.map((a, i) => (
										<div key={i} className='highlight' dangerouslySetInnerHTML={{ __html: a }} />
									))}
								</div>:
								<div className='content' dangerouslySetInnerHTML={{ __html: res.content }} />
								}
							</div>
						)
					}}
					size={1}
					showResultStats={false}
					defaultQuery={() => {
						return this.state.query
					}}
				/>
			)
		}
	}
}