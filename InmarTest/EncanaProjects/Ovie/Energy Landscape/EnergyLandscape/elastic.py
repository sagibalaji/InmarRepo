from elasticsearch import Elasticsearch, helpers
import config
import logging
import sys

LOGGER = logging.getLogger(__name__)
es = config.ES_CLIENT

def get_aggs(query):

    body = {
        "query": query,
        "size": 0,
        "aggs": {
            "daily": {
                "date_histogram": {
                    "field": "estimatedPublishedDate",
                    "interval": "week",
                    "format": "yyyy-MM-dd"
                },
                "aggs": {
                    "avg_sent": {
                        "avg": {
                            "field": "sentiment.score"
                        }
                    },
                    "doc_count": {
                        "value_count": {
                            "field": "id.keyword"
                        }
                    }
                }
            }
        }
    }

    aggs = es.search(
        index=config.ES_INDEX,
        body=body
    )['aggregations']['daily']['buckets']

    return aggs


def get_aggs_by_date(keywords, start, end):

    query = {
        "bool": {
            "must": [
                {
                    "simple_query_string": {
                        "default_operator": "or",
                        "fields": ["title^10", "content"],
                        "query": keywords
                    }
                },
                {
                    "range": {
                        "estimatedPublishedDate": {
                            "gte": start,
                            "lte": end
                        }
                    }
                }
            ]
        }
    }

    body = {
        "query": query,
        "size": 0,
        "aggs": {
            "daily": {
                "date_histogram": {
                    "field": "estimatedPublishedDate",
                    "interval": "week",
                    "format": "yyyy-MM-dd",
                    "min_doc_count": 1
                },
                "aggs": {
                    "avg_sent": {
                        "avg": {
                            "field": "sentiment.score"
                        }
                    },
                    "doc_count": {
                        "value_count": {
                            "field": "id.keyword"
                        }
                    }
                }
            }
        }
    }

    aggs = es.search(
        index=config.ES_INDEX,
        body=body
    )['aggregations']['daily']['buckets']

    return aggs


def get_article(id):

    body = {
        "query": {
            "ids": {
                "values": [id]
            }
        }
    }

    article = es.search(
        index=config.ES_INDEX,
        body=body,
    )['hits']['hits']

    return article


def get_articles(query):

    body = {
        "query": query,
        "highlight": {
            "fields": {
              "content": {
                "fragment_size": 500,
                "number_of_fragments": 50
              }
            }
        },
        "size": 100
    }

    articles = es.search(
        index=config.ES_INDEX,
        body=body,
        _source_includes=['content', 'highlight', 'source']
    )['hits']['hits']
    
    return articles


def get_articles_by_date(keywords, start, end):

    query = {
        "bool": {
            "must": [
                {
                    "simple_query_string": {
                        "default_operator": "or",
                        "fields": ["title^10", "content"],
                        "query": keywords
                    }
                },
                {
                    "range": {
                        "estimatedPublishedDate": {
                            "gte": start,
                            "lte": end
                        }
                    }
                }
            ]
        }
    }

    body = {
        "query": query,
        "size": 10
    }

    articles = es.search(
        index=config.ES_INDEX,
        body=body
    )['hits']['hits']

    return articles


def get_inflation(start, end):

    query = {
        "bool": {
            "must": [
                {
                    "range": {
                        "estimatedPublishedDate": {
                            "gte": start,
                            "lte": end
                        }
                    }
                }
            ]
        }
    }

    body = {
        'query': query,
        'size': 0,
        'aggs': {
            "interval": {
                "date_histogram": {
                    "field": "estimatedPublishedDate",
                    "interval": 'week',
                    "format": "yyyy-MM-dd"
                }
            }
        }
    }

    aggs = es.search(
        index=config.ES_INDEX,
        body=body
    )['aggregations']['interval']['buckets']

    return aggs


def remove_duplicates(index):

    body = {
        "size": 0,
        "aggs": {
            "duplicates": {
                "terms": {
                    "field": "title.keyword",
                    "min_doc_count": 2,
                    "size": 5000
                }
            }
        },
        "_source": {"includes": ["_id"]}
    }

    for agg in es.search(
        index=index,
        body= body
    )['aggregations']['duplicates']['buckets']:
        
        query = {
            "query": {
                "match": {
                    "title.keyword": agg['key']
                }
            }
        }

        es.delete_by_query(
            index=index,
            body=query,
            params={
                'max_docs': 1
            }
        )


if __name__ == "__main__":

    while True:
        index = sys.argv[1]
        remove_duplicates(index)