from elasticsearch import Elasticsearch
import json

#Pull some articles from ES
es = Elasticsearch()
index = 'articles'
query = 'url:"https://www.reuters.com/article/us-global-oil*" OR url:"https://www.reuters.com/article/global-oil*"'

docs = es.search(
    index=index, 
    q=query,
    default_operator='AND',
    filter_path=['hits.hits'],
    _source_include='title',
    size=1000,
    sort='_id'
)

articles = []

for x in (docs["hits"]["hits"]):
    
    articles.append({
        "text": x["_source"]["title"],
        "id": x["_id"]
    })

with open('./data/el_docs_price_lrg.jsonl', 'w') as outfile:
    for a in articles:
        if(a['text'] != None):
            outfile.write('%s\n' % json.dumps(a))

print('Articles saved to: ' + outfile.name)