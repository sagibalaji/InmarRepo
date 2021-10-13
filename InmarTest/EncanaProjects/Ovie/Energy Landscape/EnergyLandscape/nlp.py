import config, logging, sys
from gensim.summarization.summarizer import summarize

LOGGER = logging.getLogger(__name__)


def run_summarizer(text):

    try:
        # run the summerization model
        summary = summarize(text, word_count=250)

        # text must be a certain length, otherwise no return
        if summary == "":
            summary = text

    except Exception as err:
        # if something fails, assign boilerplate summary
        LOGGER.exception(err)
        summary = text

    # replace line breaks
    summary = summary.replace("\n", "")

    return summary


def create_extract(text):

    extract = text[0:200]

    return extract
