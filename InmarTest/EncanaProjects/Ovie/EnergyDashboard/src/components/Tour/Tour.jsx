import React from 'react'
import { ShepherdTour, TourMethods } from 'react-shepherd'
import Config from '../../js/config.js';
import ovie from '../../img/ovie.svg'
import themes from '../../img/themes.png'
import figures from '../../img/figures.png'
import './Tour.css';

export default class Tour extends React.Component {

	completeTour() {

		fetch(Config.paths.FLASK_HOST + "/tour/", {
			method: 'GET'
		})
		
	}

	render() {

		const tourOptions = {
			defaultStepOptions: {
				classes: 'shadow-md bg-purple-dark',
				cancelIcon: {
					enabled: true,
				}
			},
			exitOnEsc: true,
			tourName: "EL-Tour",
			useModalOverlay: true
		};

		const tourSteps = [
			{
				id: 'intro',
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Exit',
						type: 'cancel'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Start Tour',
						type: 'next'
					}
				],
				title: 'OVIE Dashboard Tour',
				text: `
				<div id='EL-Tour-Intro'>
					<div class='container'>
					<p>Meet Ovintiv's proprietary text analytics tool:</p>
					<div class='header'>
						<div class='logo'>
							<img src=`+ ovie + ` />
						</div>
						<div class='intro'>
							<b>O</b>rganic<br/><b>V</b>ocabulary<br/><b><span class='spacer'/>I</b>ntelligence<br/><b>E</b>ngine
						</div>
				</div>
					<p><b>OVIE</b> reads millions of news articles from over 10,000 sources and helps identify current trends, positive / negative sentiment & extracts themes from the full article in just seconds.</p>
					<p>Spend a few minutes, and take the tour to learn about all of the things that <b>OVIE</b> can do to help you make better decisions, faster!</p>
				</div>
			</div>
				`
			},
			{
				id: 'header',
				attachTo: {
					element: '#EL-Header',
					on: 'bottom'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, -20] } }]
				},
				title: 'Searching for Articles',
				text: `
					<div id='EL-Tour-Header'>
							<p>You can use the following search operators to tell <b>OVIE</b> what topics you're interested in:</p>
							<table>
								<tr>
									<th>If you search...</th>
									<th>OVIE will find</th>
								</tr>
								<tr>
									<td>Crude oil</td>
									<td>Articles that mention <u>both</u> 'crude' and 'oil'</td>
								<tr>
								<tr>
									<td>"Digital transformation"</td>
									<td>Articles that contain the entire phrase 'Digital transformation'</td>
								</tr>
								<tr>
									<td>Anadarko | Permian</td>
									<td>Articles that mention <u>either</u> Anadarko or Permian</td>
								</tr>
								<tr>
									<td>Pipeline -Keystone</td>
									<td>Articles that contain the word 'Pipeline' but not 'Keystone'</td>
								</tr>
							</table>
							<p>You can also use the Start Date & End Date filters to limit the time range. By default,
								 <b>OVIE</b> looks for articles from 2011 to now.</p>
					</div>
				`,
			},
			{
				id: 'refiners',
				attachTo: {
					element: '#EL-Left',
					on: 'right-start'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Filtering by Type & Source',
				text: `
					<div id='EL-Tour-Refiners'>
						<p>You can refine your search results by document type or news source:</p>
						<ul>
							<li><b>News Articles</b> - includes international, national, regional & local
									news for a wide range of topics including business, government, press wire & trade news.
							</li>
							<li><b>Call Transcripts</b> - includes earnings call transcripts for companies listed on the
									S&P500 as well as some other companies on the NYSE and TSE exchanges.
							</li>
						</ul>
						<p><b>OVIE</b> gathers articles from over 10,000 sources, but we've curated a list of the most popular
							 sources in business, finance, energy & tech.</p>
					</div>
				`,
			},
			{
				id: 'results',
				attachTo: {
					element: '#EL-Middle-Left',
					on: 'right-start'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Viewing Search Results',
				text: `
					<div id='EL-Tour-Results'>
						<p>The currently selected filters are displayed at the top of this panel. You can remove a filter by clicking the small ‘x’.</p>
						<p>The following information is displayed about each article that matches your search:</p>
						<ul>
							<li>Title</li>
							<li>First two lines of the content</li>
							<li>Source</li>
							<li>Date published</li>
						</ul>
						<p>Click on the article title to load the rest of the content into the preview pane to the right.
							<b>OVIE</b> sorts the search results to show the most recent article first.</p>
						<p>You can also click the 'Download Articles' button to export your search results as an excel file.
					</div>
				`,
			},
			{
				id: 'preview',
				attachTo: {
					element: '#EL-Middle-Right',
					on: 'right-start'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Reading the Article Preview',
				text: `
					<div id='EL-Tour-Preview'>
						<p>The currently selected article is displayed in the preview pane. To accelerate time to insights, <b>OVIE</b> will highlight only the segments that contain your search term:</p>	
						<div class='container'>
							<p>“A number of other hedge funds and other institutional investors also recently modified their holdings of OVV. BlackRock Inc. purchased a new stake in shares of <span class='yellow'>Ovintiv</span> during the first quarter worth $3,413,000. The stock’s 50-day simple moving average is on the move.”</p>
						</div>
						<p>In the example above, <b>OVIE</b> <u>will show</u> the paragraph in the preview pane because it contained the search term (Ovintiv).</p>
						<p>You can also view the entire text by clicking the title, which will launch the full article in new browser tab.</p>
					</div>
				`,
			},
			{
				id: 'frequency',
				attachTo: {
					element: '#EL-Frequency',
					on: 'left-start'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Discovering Trends',
				text: `
					<div id='EL-Tour-Frequency'>
						<p><b>OVIE</b> uses a metric called <u>Adjusted Frequency</u> to identify emerging or declining topics. This metric is defined as:</p>
						<div class='container'>
							<table>
								<tr>
									<th>Articles per week</th>
								</tr>
								<tr>
									<td>( Total articles per week / Baseline )</td>
								</tr>
							</table>
							<p>Articles per week = The number of articles per week that match your search criteria</p>
							<p>Baseline = A static number to adjust for inflation of articles from 2011 to now</p>
						</div>
						<p>A large spike in <u>Adjusted Frequency</u> can indicate an <b>emerging topic</b>, and relatively a large decline can indicate the <b>buzz is gone.</b></p>
					</div>
				`,
			},
			{
				id: 'sentiment',
				attachTo: {
					element: '#EL-Sentiment',
					on: 'left'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Tracking Positive & Negative Sentiment',
				text: `
					<div id='EL-Tour-Sentiment'>
						<p><b>OVIE</b> calculates the <u>positive</u>, <u>neutral</u> & <u>negative sentiment</u> of an article to gauge the opinion of a certain topic. How does it work? Let’s consider the following two sentences:</p>
						<table>
							<tr>
								<td><span class='red'>Poor</span> performance and <span class='red'>bad</span> timing resulted in another <span class='red'>crushing loss.</span></td>
								<td>Score: <span class='red'>-0.75</span></td>
							<tr>
							<tr>
								<td>A <span class='green'>resurgence</span> of capital and a <span class='green'>spectacular</span> strategy led to <span class='green'>record-breaking gains.</span></td>
								<td>Score: <span class='green'>+0.86</span></td>
							</tr>
						</table>
						<p><b>OVIE</b> reads each sentence in the articles that match your search and assigns an <u>overall sentiment score (scale of -1 to 1)</u>. Each dot on the sentiment chart represents the average sentiment per week. Green dots indicate positive sentiment, red dots indicate negative sentiment, and yellow dots indicate neutral sentiment.</p>
						<p>The sentiment model used by <b>OVIE</b> is a bit more complicated than this simple example as it accounts for intensity, proximity and negation. To learn more about sentiment analysis, <a target='_blank' href='https://www.lexalytics.com/technology/sentiment-analysis'>check this out.</a></p> 
					</div>
				`,
			},
			{
				id: 'trend',
				attachTo: {
					element: '#EL-Trend',
					on: 'left-end'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Understanding Trends vs. Risks',
				text: `
					<div id='EL-Tour-Trend'>
						<p><b>OVIE</b> combines the <u>Adjusted Frequency</u> and <u>Sentiment</u> scores to form a third metric called the Trend score, useful for understanding trends vs. risks. This metric is defined as:</p>
						<div class='container'>
							<p><b>(Frequency rolling avg * Sentiment rolling avg)</b></p>
							<p>Frequency rolling avg = The average adjusted frequency for the past 30 days</p>
							<p>Sentiment rolling avg = The average sentiment score for the past 30 days</p>
						</div>
						<p>If a lot of news is being published about a topic (high adjusted frequency), and the sentiment is generally <span class='green'>positive</span>, <b>OVIE</b> suggests this topic is a <u>trend</u>. However if the frequency is high, but the sentiment is generally <span class='red'>negative</span>, <b>OVIE</b> suggests this could be a <u>risk</u>.</p>
					</div>
				`,
			},
			{
				id: 'themes',
				attachTo: {
					element: '#react-tabs-2',
					on: 'bottom'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Extracting Themes & Sentiment',
				text: `
					<div id='EL-Tour-Themes'>
						<p><b>OVIE</b> can extract the most common, most positive and most negative themes from the articles that match your search, and also provides the sentences that contain these themes.</p>
						<div class='container'>
							<img src=`+ themes + ` />
						</div>
						<p>In the example above, <b>OVIE</b> identified the theme ‘natural language processing’ when searching for articles mentioning ‘Artificial Intelligence’. A topic that is quite familiar, as <a target='_blank' href='https://www.lexalytics.com/lexablog/machine-learning-natural-language-processing/'>Natural Language Processing (NLP)</a> is a core part of <b>OVIE’s</b> engine.</p>
					</div>
				`,
			},
			{
				id: 'figures',
				attachTo: {
					element: '#react-tabs-4',
					on: 'bottom'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Next',
						type: 'next'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Extracting Figures & Numbers',
				text: `
				<div id='EL-Tour-Figures'>
					<p><b>OVIE</b> can also extract figures, numbers and currencies from the articles that match your search, and provides the sentences that contain these figures.</p>
					<div class='container'>
						<img src=`+ figures + ` />
					</div>
					<p>In the example above, <b>OVIE</b> extracted the figure $15.4 million when searching for articles mentioning ‘Tesla’. 
					</p>
				</div>
				`,
			},
			{
				id: 'outro',
				attachTo: {
					element: '#EL-Logo',
					on: 'bottom'
				},
				buttons: [
					{
						classes: 'shepherd-button-secondary',
						text: 'Back',
						type: 'back'
					},
					{
						classes: 'shepherd-button-primary',
						text: 'Exit Tour',
						type: 'cancel'
					}
				],
				popperOptions: {
					modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
				},
				title: 'Start Exploring with OVIE',
				text: `
				<div id='EL-Tour-Outro'>
					<div class='container'>
						<div class='outro'>
							<p>We're glad you got to meet <b>OVIE!</b></p>
							<p>Now you can start exploring trends, track changes in sentiment and discover new themes, or just stay up to date on the latest news about your favourite topics.</p>
						</div>
						<div class='logo'>
							<img src=`+ ovie + ` />
						</div>		
					</div>
					<p>Here are a few more ways to learn more about <b>OVIE:</b></p>
					<ol>
						<li>Check out this <a target='_blank' href='https://web.microsoftstream.com/video/28aff475-ac1f-454d-baa3-739b55718a38'>awesome short video</a> that shows an example of how to tap into the value behind text analytics.</li>
						<li>Follow our <a target='_blank' href= 'https://teams.microsoft.com/l/channel/19%3a229bb71675dc4dd59db1f68f4d5a40e7%40thread.skype/General?groupId=9ffa3436-b4cf-441e-9d49-23ce49ac56de&tenantId=cf0eed28-3144-48da-81a3-4a005701eda5'>MS Teams channel</a> to stay informed regarding new developments.</li>
						<li><a target='_blank' href='https://encana.sharepoint.com/:b:/s/EnergyLandscapeMonitoring/Ef4nquJ1uVxAoCVA7bP7o7ABglcD8J66HcSDD5iypG7ekQ?e=q38J6V'>View our presentation</a> from STE 2019 and learn more about Project ELM – the birthplace of <b>OVIE.</b></li>
					</ol>
					<p>You can relaunch this tour anytime by clicking the ‘Start Tour’ button under the Ovintiv logo.</p>		
				</div>
				`,
				when: {
					show: () => {
						this.completeTour()
					}
				}
			},

		];

		return (
			<ShepherdTour steps={tourSteps} tourOptions={tourOptions}>
				<TourMethods>
					{(tourContext) => (
						<button id='EL-Tour' className="button dark" onClick={tourContext.start}>
							Start Tour
						</button>
					)}
				</TourMethods>
			</ShepherdTour>
		)
	}
}
