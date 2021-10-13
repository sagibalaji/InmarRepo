import elastic as es
import pandas as pd
import spacy
import textacy
import sentiment as SENT
import config

nlp = spacy.load('en_core_web_sm')

def get_themes(articles, theme_type):

    themes = []
    for article in articles:

        if theme_type == 0:
            try:
                text = article['highlight']['content'][0]
            except:
                text = article['_source']['content']            
        else:
            text = article['_source']['content']

        doc = nlp(text)

        for i, sent in enumerate(doc.sents):

            ents = list(textacy.extract.entities(sent))

            noun_chunks = list(textacy.extract.noun_chunks(sent, drop_determiners=True))

            bi_grams = list(textacy.extract.ngrams(sent, 2, filter_stops=True, filter_punct=True,
                        filter_nums=True, include_pos=["ADJ","NOUN","VERB"], min_freq=0))
            
            tri_grams = list(textacy.extract.ngrams(sent, 3, filter_stops=True, filter_punct=True,
                        filter_nums=True, include_pos=["ADJ","NOUN","VERB"], min_freq=0))
            
            for chunk in noun_chunks:

                if(chunk in bi_grams or chunk in tri_grams and chunk not in ents):
                    themes.append({
                        'id': i,
                        'phrase': chunk.lemma_,
                        'sentence': sent.text,
                        'source': article['_source']['source']['name']
                    })

    df = pd.DataFrame.from_dict(themes, orient='columns')

    df['sentiment'] = df['sentence'].map(SENT.get_sentiment)

    df = df.groupby('phrase').agg({
        'id': 'count',
        'sentiment': ['mean', lambda s: list(s)],
        'sentence': lambda s: list(s),
        'source': lambda s: list(s)
    }).reset_index()

    df.columns = ['phrase', 'count', 'avg_sentiment',
                  'score_list', 'sentence_list', 'source']

    df = df.round(2).sort_values(by='count', ascending=False)

    themes = df.to_dict(orient='records')

    return themes


if __name__ == "__main__":

    query = {
        "bool": {
            "must": [
                {
                    "simple_query_string": {
                        "query": "\"Yeso\"",
                        "fields": ["content"]
                    }
                },
            ]
        }
    }

    articles = es.get_articles(query)
    get_themes(articles, 0)
                
