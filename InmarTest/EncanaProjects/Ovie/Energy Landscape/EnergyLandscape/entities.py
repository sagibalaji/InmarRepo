import elastic as es
import pandas as pd
import spacy
import textacy
import sentiment as SENT
import config

nlp = spacy.load('en_core_web_sm')

def get_entities(articles, ent_type):

    texts = [a['_source']['content'] for a in articles]
    sources = [s['_source']['source']['name'] for s in articles]
    
    entities = []
    for idx, text in enumerate(texts):

        print("Extracting entities from doc:", (idx+1), "/", len(texts))
        doc = nlp(text)

        for i, sent in enumerate(doc.sents):  

            ents = list(textacy.extract.entities(sent, drop_determiners=True, min_freq=0, include_types=[ent_type]))
            
            for ent in ents:
                entities.append({
                    'id': i,
                    'entity': ent.text,
                    'sentence': sent.text,
                    'source': sources[idx]
                })

    df = pd.DataFrame.from_dict(entities, orient='columns')

    df['sentiment'] = df['sentence'].map(SENT.get_sentiment)

    df = df.groupby('entity').agg({
        'id': 'count',
        'sentiment': ['mean', lambda s: list(s)],
        'sentence': lambda s: list(s),
        'source': lambda s: list(s)
    }).reset_index()

    df.columns = ['entity', 'count', 'avg_sentiment',
                  'score_list', 'sentence_list', "source"]

    df = df.round(2).sort_values(by='avg_sentiment', ascending=False)

    # optional export to csv
    # df.to_csv(r'exports/ELM-Entities'+'.csv')

    entities = df.to_dict(orient='records')

    return entities


if __name__ == "__main__":

    test = [
        {
            
        }
    ]
