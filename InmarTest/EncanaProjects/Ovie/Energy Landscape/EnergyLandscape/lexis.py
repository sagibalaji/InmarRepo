import config
import datetime
import hashlib
import logging
import json
import os
import requests
import time
from elasticsearch import helpers
import sentiment as SENT

LOGGER = logging.getLogger(__name__)
es = config.ES_CLIENT

API_ENDPOINT = 'http://metabase.moreover.com/api/v10/articles?'
API_KEY = '80d462436fd9404c8ba70afc2cb78dc6'
FORMAT = 'json'
PAUSE_MILLIS = 30000


# This is a simple http client which will make request url
def call_metabase(sequenceId):

    if(sequenceId):
        SEQ_ID = sequenceId
        url = API_ENDPOINT+"key="+API_KEY+"&sequence_id="+SEQ_ID+"&format="+FORMAT
    else:
        url = API_ENDPOINT+"key="+API_KEY+"&format="+FORMAT

    print("ENDPOINT:", url)
    response = requests.get(url)

    sequenceId = None

    if response:
        if (response.status_code == 200):

            data = json.loads(response.content)
            noItems = len(data['articles'])

            if noItems > 0:
                sequenceId = data['articles'][-1]['sequenceId']

            write_to_elastic(data)
    
    else:
        print("ERROR: Metabase API call failed!")
        print(response.content)

    return sequenceId


def write_to_elastic(data):

    print("No. articles in set:", len(data['articles']))

    try:
        articles = data['articles']

        for article in data['articles']:

            # set the article type
            article['type'] = "News"

            # rescore the sentiment
            article['sentiment.score'] = SENT.get_sentiment(article['content'])

        for success, info in helpers.streaming_bulk(
                es, yield_article(articles),
                raise_on_error=False,
                chunk_size=2):

            if not success:
                if(info['create']['status'] == 409):
                    handle_duplicate(info)

                else:
                    LOGGER.exception(str(info))

    except Exception as err:
        LOGGER.exception(err)


def handle_duplicate(info):

    es.update(
        index=info['create']['_index'],
        id=info['create']['_id'],
        body={
            "script": "if(ctx._source.containsKey(\"republishes\")){ctx._source.republishes++} else {ctx._source.republishes=1;}",
            "upsert": {
                "republishes": 1
            }
        })
        

def yield_article(articles):

    for article in articles:

        datestamp = article['estimatedPublishedDate'][:7]
        index = config.ES_INDEX[:9] + datestamp

        yield {
            '_op_type': 'create',
            '_index': index,
            '_id': article['duplicateGroupId'],
            '_source': article
        }


# This is where the main functionality is:
def main():

    sequenceId = None
    while True:

        nextSeqId = call_metabase(sequenceId)
        sequenceId = nextSeqId

        print('Sleeping for:', PAUSE_MILLIS/1000, ' seconds', end='\n\n')
        time.sleep(PAUSE_MILLIS / 1000)


# this is to help invoke the main function
if __name__ == '__main__':
    main()
