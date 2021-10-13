import config, time
import elastic as es
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text
from sklearn.decomposition import NMF

def get_topics(articles, clusters):

    start = time.time()

    topics = []
    try:

        ids = [a['_id'] for a in articles]
        texts = [a['_source']['content'] for a in articles]

        n_features = 1000
        n_clusters = clusters
        n_terms = 5
        no_top_documents = 2

        stop_words_file = open('models/stop_words.txt', 'r')
        stop_words = stop_words_file.read().split('\n')
        stop_words_file.close()

        all_stop_words = text.ENGLISH_STOP_WORDS.union(stop_words)

        tfidf_vectorizer = TfidfVectorizer(
            max_df=0.95, min_df=2, ngram_range=(2, 2),
            max_features=n_features, stop_words=all_stop_words)

        train = tfidf_vectorizer.fit_transform(texts)

        nmf = NMF(n_components=n_clusters, random_state=1,
                  alpha=.1, l1_ratio=.5, init='nndsvd')
        nmf = nmf.fit(train)

        topic_scores = nmf.transform(train)
        clusters = nmf.components_

        terms = tfidf_vectorizer.get_feature_names()

        for i, component in enumerate(clusters):

            # generate topic information
            keys = [terms[i] for i in component.argsort()[:-n_terms - 1:-1]]
            top_doc_indices = np.argsort(topic_scores[:, i])[
                ::-1][0:no_top_documents]

            docs = []
            for idx in top_doc_indices:
                docs.append({
                    "id": articles[idx]['_id'],
                    "source": articles[idx]['_source']['source']['name'],
                    "title": articles[idx]['_source']['title']
                })

            topic = {
                "documents": docs,
                "keywords": keys
            }

            topics.append(topic)

        # update each article with major topic
        for k, scores in enumerate(topic_scores):
            maj_score = 0
            maj_topic = 0
            for idx, s in enumerate(scores):
                if(s > maj_score):
                    maj_topic = idx
                    maj_score = round(s, 3)
                articles[k]['_source'].update({"topic": maj_topic})

    except Exception as err:
        config.LOGGER.exception(err)
        topics = [{'documents': [], 'keywords':[]}]

    end = time.time()
    print("Generating topics took:", round(end-start, 2), "s")

    return articles, topics


if __name__ == "__main__":

    articles = es.get_articles_by_source("Daily Oil Bulletin","3M")
    results = get_topics(articles, 3)

    for doc in results[0]:
        print(doc['_source']['title'], end="\n\n")