import config
import elastic as es
import numpy as np
import pandas as pd
from pandas.io.json import json_normalize
from sklearn.preprocessing import MinMaxScaler

pd.set_option('display.max_rows', 1000)

def calc_frequency(data):

    df = pd.DataFrame.from_dict(json_normalize(data), orient='columns')
    
    df['date'] = df['key_as_string']
    dates = df['date'].tolist()

    df['inflation'] = calc_inflation(dates)
    df['frequency'] = df['doc_count.value'] / df['inflation']    

    df = df.replace(np.nan, 0, regex=True)
    df = df.drop(columns=['key', 'key_as_string', 'avg_sent.value','doc_count.value'])

    frequency = df[:-1].to_dict(orient='records')

    return frequency


def calc_sentiment(data):

    df = pd.DataFrame.from_dict(json_normalize(data), orient='columns')
    
    df['date'] = df['key_as_string']
    df['sentiment'] = df['avg_sent.value'] - 0.5

    df = df.dropna(axis = 0, how ='any')
    df = df.drop(columns=['avg_sent.value','doc_count.value','key', 'key_as_string'])
    
    sentiment = df[:-1].to_dict(orient='records')

    return sentiment


def calc_trend(data):
    
    df = pd.DataFrame.from_dict(json_normalize(data), orient='columns')

    df['date'] = df['key_as_string']
    dates = df['date'].tolist()

    df['inflation'] = calc_inflation(dates)
    df['frequency'] = df['doc_count.value'] / df['inflation']
    
    scaler = MinMaxScaler(feature_range=(0, 10))
    #df['frequency'] = scaler.fit_transform(df[['frequency']])
    
    df['sentiment'] = df['avg_sent.value'] - 0.5
    df['score'] = df['frequency'] * df['sentiment']    
    df['trend'] = df['score'].rolling((30), min_periods=1).mean()
    
    df = df.replace(np.nan, 0, regex=True)
    df = df.drop(columns=['key', 'key_as_string','doc_count.value','avg_sent.value','inflation','score'])

    trend = df[:-1].to_dict(orient='records')

    return trend


def calc_quotes(data):

    df = pd.DataFrame.from_dict(json_normalize(data), orient='columns')

    df['delta'] = round((df['price'].astype(float)-df['backcast'].astype(float)), 2)

    quotes = df.to_dict(orient='records')

    return quotes


def calc_inflation(dates):

    start = dates[0]
    end = dates[-1]

    baseline = 47431 #total articles in 2011-01-02 to 2011-01-08
    weeks = es.get_inflation(start, end)

    inflation = [week['doc_count'] / baseline for week in weeks]

    return inflation