from flask import Flask, jsonify, request, make_response
from flask_restplus import Api, Resource, fields, reqparse
from flask_cors import CORS, cross_origin
from datetime import datetime
import config, csv, logging, io, json, time
import aggs as AGS
import elastic as ES
import entities as ENT
import similarity as SIM
import topics as TOP
import themes as THE

LOGGER = logging.getLogger(__name__)
logging.getLogger('werkzeug').setLevel(LOGGER.getEffectiveLevel())

app = Flask(__name__)
api = Api(app, version='1.0', title='Encana Text Analytics API')
elm = api.namespace('ovie', description='Organic Vocabulary Intelligence Engine')

CORS(app)

@elm.route('/article/<id>/')
@elm.doc(params={
    'id': 'The id of the article in elastic search'
})
class Article(Resource):

    def get(self, id):

        article = ES.get_article(id)
        resp = article, 200

        return resp


@elm.route('/articles/')
@elm.doc(params={
    'keywords': 'The search query',
    'start': '(ex. 2019-01-31)',
    'end': '(ex. 2019-05-15)'}
)
class Articles(Resource):

    def get(self):

        keywords = request.args.get('keywords')
        start = request.args.get('start')
        end = request.args.get('end')

        print(f"keywords: {str(keywords)}")
            
        articles = ES.get_articles_by_date(keywords, start, end)
        resp = {'articles':articles}, 200

        return resp


@elm.route('/entity/')
class Entity(Resource):

    def post(self):

        ent_type = request.args.get('type')

        try:
            query = json.loads(request.data)
            
            data = ES.get_articles(query)  
            entities = ENT.get_entities(data, ent_type)

            resp = {'results':entities},200

        except Exception as err:
            LOGGER.exception(err)
            resp = {'results':[]},500
        
        return resp


@elm.route('/frequency/')
@elm.doc(params={
    'keywords': '(ex. oil + sanctions)',
    'start': '(ex. 2019-01-31)',
    'end': '(ex. 2019-05-15)'})
class Frequency(Resource):

    def get(self):
        
        try:
            keywords = request.args.get('keywords')
            start = request.args.get('start')
            end = request.args.get('end')

            data = ES.get_aggs_by_date(keywords, start, end)  
            freq = AGS.calc_frequency(data)
            freq = freq[0]['frequency']
        
        except Exception as err:
            LOGGER.exception(err)
            freq = 0

        resp = freq, 200

        return resp


    def post(self):

        try:
            query = json.loads(request.data)
            
            data = ES.get_aggs(query)  
            frequency = AGS.calc_frequency(data)

            resp = {'results':frequency},200

        except Exception as err:
            LOGGER.exception(err)
            resp = {'results':[]},500
        
        return resp


@elm.route('/sentiment/')
@elm.doc(params={
    'keywords': '(ex. oil + sanctions)'})
class Sentiment(Resource):

    def get(self):
        
        try:
            keywords = request.args.get('keywords')
            start = request.args.get('start')
            end = request.args.get('end')

            data = ES.get_aggs_by_date(keywords, start, end)  
            sentiment = AGS.calc_sentiment(data)
            sentiment = sentiment[0]['sentiment']
        
        except Exception as err:
            LOGGER.exception(err)
            sentiment = 0

        resp = sentiment, 200

        return resp


    def post(self):
        
        try:
            query = json.loads(request.data)
            
            data = ES.get_aggs(query)
            sentiment = AGS.calc_sentiment(data)

            resp = {'results':sentiment},200

        except Exception as err:
            LOGGER.exception(err)
            resp = {'results':[]},500
        
        return resp


@elm.route('/similarity/')
@elm.doc(params={
    'original': 'The original piece of text',
    'match': 'The text you would like to measure similarity for'
    })
class similarity(Resource):

    def get(self):
        
        try:
            text1 = request.args.get('original')
            text2 = request.args.get('match')
            
            similarity = SIM.get_similarity(text1, text2)
        
        except Exception as err:
            LOGGER.exception(err)
            similarity = {}

        resp = similarity, 200

        return resp



@elm.route('/theme/')
class Theme(Resource):

    def post(self):

        try:
            data = json.loads(request.data)
            query = data['query']
            theme_type = data['type']

            data = ES.get_articles(query)  
            themes = THE.get_themes(data, theme_type)

            resp = {'results':themes},200

        except Exception as err:
            LOGGER.exception(err)
            resp = {'results':[]},500
        
        return resp

      

@elm.route('/trend/')
class Trend(Resource):

    def post(self):
        
        try:
            query = json.loads(request.data)
            
            data = ES.get_aggs(query)  
            trend = AGS.calc_trend(data)

            resp = {'results':trend},200

        except Exception as err:
            LOGGER.exception(err)
            resp = {'results':[]},500
        
        return resp


@elm.route('/tour/')
class Tour(Resource):

    def get(self):

        return 200


#------- CONTENT NEGOTIATION --------------------------------------------------#

@api.representation('application/json')
def output_json(data, code, headers=None):

    resp = make_response(jsonify(data), code)
    resp.headers.extend(headers or {})

    return resp


# CSV output for docs
@api.representation('text/csv')
def output_csv(data, code, headers=None):

    headers={"Content-disposition":"attachment; filename=ELM-export.csv"}
    
    si = io.StringIO()
    cw = csv.writer(si)

    for i,obj in enumerate(data['results']):

        keys = obj.keys()
        values = obj.values()

        if(i == 0):
            cw.writerow(keys)
        
        cw.writerow(values)
        
    resp = make_response(si.getvalue(), code)
    resp.headers.extend(headers or {})

    return resp


# Text output for Excel 
@api.representation('text/plain')
def output_text(data, code, headers=None):



    resp = make_response(str(data), code)
    resp.headers.extend(headers or {})

    return resp


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)