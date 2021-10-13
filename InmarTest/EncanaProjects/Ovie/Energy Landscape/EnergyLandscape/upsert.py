import config
import datetime
import elasticsearch as ES
import hashlib
import json
import logging
import os
import requests
import time

es = config.ES_CLIENT
LOGGER = logging.getLogger(__name__)
PAUSE_SECONDS = 3600


def update_call_transcripts(index):

    query = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "type.keyword": "News"
                        }
                    },
                    {
                        "match_phrase": {
                            "title": "Earnings Call Transcript"
                        }
                    },
                    {
                        "nested": {
                            "path": "source",
                            "query": {
                                "match": {
                                    "source.name.keyword": "Seeking Alpha"
                                }
                            }
                        }
                    }
                ]
            }
        },
        "script": {
            "source": "ctx._source.type='Peer'; ctx._source.subtype='Call Transcript'"
        }
    }

    try:
        es.update_by_query(
            index=index,
            body=query
        )

        print("Call Transcripts updated")

    except Exception as err:
        LOGGER.exception(err)


if __name__ == '__main__':

    while True:
        indices = es.indices.get_alias(index='articles')
        for index in sorted(indices.keys()):

            print()
            print("UPDATING INDEX:", index)
            update_call_transcripts(index)

        print('Sleeping for:', PAUSE_SECONDS/3600, ' hour', end='\n\n')
        time.sleep(PAUSE_SECONDS)
