from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from elasticsearch import helpers
import config
import logging
import sys


LOGGER = config.LOGGER
NLTK = SentimentIntensityAnalyzer()
es = config.ES_CLIENT


def get_sentiment(text):

    try:
        score = NLTK.polarity_scores(text)
        sentiment = round(score['compound'], 3)

    except Exception as err:
        LOGGER.exception(err)
        sentiment = 0.0

    return sentiment


def update_sentiment(index, query):

    docs = helpers.scan(
        es,
        index=index,
        query=query,
        version=True,
        request_timeout=360,
        _source_includes='content,_id',
        size=100,
        scroll='10m'
    )

    for success, item in helpers.parallel_bulk(
            es,
            yielder(index, docs),
            chunk_size=10,
            thread_count=4,
            raise_on_error=False,
            raise_on_exception=False):

        if not success:
            LOGGER.error(str(item))


def yielder(index, docs):

    for doc in docs:

        try:
            new_sentiment = get_sentiment(doc['_source']['content'])
        
        except Exception as err:
            LOGGER.error(err)
            new_sentiment = 0.0

        yield {
            '_op_type': 'update',
            '_index': index,
            '_id': doc['_id'],
            'doc': {'sentiment.score': new_sentiment},
            'doc_as_upsert': True
        }


if __name__ == "__main__":

    index = sys.argv[1]
    query = {
        "_source": {
            "includes": ["_id", "content"]
        }
    }

    update_sentiment(index, query)
