import os
from azure.storage.blob import ContainerClient, BlobClient


ACCOUNT_NAME = 'edstransfer'
ACCOUNT_KEY = 'ERxVREnZEezMuRoQ3jkwGdJkg+Wi5ne+hNgE7Dlko+r+CBcgdGKBUkDwrLmBNZXJyWx1CeA20Jov9GRq/2pWLQ=='
CONTAINER = 'ovie'
CONN_STR = "DefaultEndpointsProtocol=https;AccountName="+ACCOUNT_NAME+ \
    ";AccountKey="+ACCOUNT_KEY+";EndpointSuffix=core.windows.net"


container_client = ContainerClient.from_connection_string(
    conn_str=CONN_STR,
    container_name=CONTAINER
)

blob_list = container_client.list_blobs()
for blob in blob_list:
    print("Downloading:", blob.name)
    blob_client = container_client.get_blob_client(blob.name)

    with open(blob.name, "wb") as f:
        blob_client.download_blob().readinto(f)