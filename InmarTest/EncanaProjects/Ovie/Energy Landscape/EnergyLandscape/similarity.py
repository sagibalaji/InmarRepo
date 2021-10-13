from fuzzywuzzy import fuzz
import config
import logging
import sys

LOGGER = config.LOGGER

def get_similarity(text1, text2):

    try:
      ratio = fuzz.ratio(text1.lower(), text2.lower())
      partial_ratio = fuzz.partial_ratio(text1.lower(), text2.lower())
      token_sort_ratio = fuzz.token_sort_ratio(text1.lower(), text2.lower())
      token_set_ratio = fuzz.token_set_ratio(text1.lower(), text2.lower())

      similarity = {
        "ratio": ratio,
        "partial": partial_ratio,
        "sorted": token_sort_ratio,
        "set": token_set_ratio
      }

    except Exception as err:
        LOGGER.exception(err)
        similarity = {}

    return similarity