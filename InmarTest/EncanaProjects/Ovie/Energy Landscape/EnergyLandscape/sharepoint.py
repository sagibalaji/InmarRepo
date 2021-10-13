from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
from base64 import b64encode
import elastic as ES
import config
import datetime
import os

SP_HOST = "https://encana.sharepoint.com/"
SP_SITE = "teams/businessintelligence"
SP_AUTH = AuthenticationContext(SP_HOST+SP_SITE)

if SP_AUTH.acquire_token_for_user(config.UN, config.PW):
    ctx = ClientContext(SP_HOST+SP_SITE, SP_AUTH)


def call_sharepoint(relative_url):

    new_files = []
    last_hour = datetime.datetime.now() - datetime.timedelta(hours=87600)

    libraryRoot = ctx.web.get_folder_by_server_relative_url(relative_url)
    ctx.load(libraryRoot)
    ctx.execute_query()

    files = libraryRoot.files
    ctx.load(files)
    ctx.execute_query()

    for my_file in files:

        created = datetime.datetime.strptime(
            my_file.properties['TimeCreated'], '%Y-%m-%dT%H:%M:%SZ')

        if(created >= last_hour):

            metadata = my_file.listitem_allfields
            ctx.load(metadata)
            ctx.execute_query()

            data = b64encode(my_file.read()).decode("utf8")

            new_files.append({
                'id': my_file.properties['UniqueId'],
                'company': metadata.properties['tcyi'],
                'data': data,
                'estimatedPublishedDate': my_file.properties['TimeCreated'],
                'preview': metadata.properties['ServerRedirectedEmbedUrl'],
                'source': {'name': 'FactSet'},
                'subtype': libraryRoot.properties['Name'][:-1],
                'title': my_file.properties['Name'].split(".")[0],
                'type': 'Peer',
                'url': SP_HOST+my_file.properties['ServerRelativeUrl']
            })

    return new_files


def index_articles(docs):

    for success, info in helpers.streaming_bulk(
        es,
        yielder(docs),
        chunk_size=500,
        max_retries=3,
        raise_on_error=False,
        params={"pipeline": "attachment"}
    ):
        if success:
            LOGGER.info("Documents indexed successfully:"+str(info))
        else:
            LOGGER.error("Error indexing documents:"+str(info))


def yielder(docs):

    for doc in docs:

        index = config.ES_INDEX[:6]+doc['estimatedPublishedDate'][:4]

        yield {
            '_op_type': 'create',
            '_index': index,
            '_type': '_doc',
            '_id': doc['id'],
            '_source': doc
        }


if __name__ == '__main__':

    targets = [
        'Shared Documents/Call Transcripts',
        'Shared Documents/Corporate Presentations',
        'Shared Documents/News Releases'
    ]
    
    #update_metadata(targets[3])

    # while True:
    for path in targets:
        
        docs = call_sharepoint(path)
        ES.index_documents(docs)


    #    print('Sleeping for: 1 hour', end='\n\n')
    #    time.sleep(3600)