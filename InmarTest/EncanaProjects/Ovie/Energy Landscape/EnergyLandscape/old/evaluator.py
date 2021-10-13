from elasticsearch import Elasticsearch
import json_lines

es = Elasticsearch()
index = 'news'
doc_type = '_doc'

# Load up the gold standard dataset
path = "data/el_articles.jsonl"
results = []

# insert docs
with open(path, 'rb') as f:
    for row in json_lines.reader(f):
        text = row['text']
        prediction = row['accept'][0]

        doc = es.search(
            index=index,
            doc_type=doc_type,
            q='"'+text+'"',
            default_operator='AND',
            filter_path=['hits.hits'],
            _source_include='sentiment',
            size=1
        )

        if(doc['hits']['hits']):
            sentiment = (doc['hits']['hits'][0]['_source']['sentiment'])

            if(prediction[0].lower() == sentiment[0].lower()):
                results.append("correct")
            else:
                results.append("incorrect")
        
        else:
            print(doc)

correct = results.count('correct')
incorrect = results.count('incorrect')
accuracy = correct/len(results)

print("")
print("Total predictions: "+ str(len(results)))
print("-----------------------")
print("Correct predictions: "+ str(correct))
print("Incorrect predictions: "+ str(incorrect))
print("Accuracy: "+ str(accuracy)[0:4])