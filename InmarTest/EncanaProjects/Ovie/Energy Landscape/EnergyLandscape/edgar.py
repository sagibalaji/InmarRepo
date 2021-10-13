from sec_edgar_downloader import Downloader
import config, os


def call_edgar(symbols, download_path):

    for company in symbols:

        if(company['sector'] == "Energy"):
        
            path = download_path + company['sector']
            dl = Downloader(path)

            try:
                os.mkdir(path)

            except Exception as err:
                print("Creating directory failed", err)

            symbols = company['symbols']

            for s in symbols:

                dl.get("8-K", s, 10)
                dl.get("10-Q", s, 20)
                dl.get("10-K", s, 5)


def get_filings(path):

    filings = []
    for dir, subdir, file_list in os.walk(path):

        for fname in file_list:
            print(dir, fname)

            with open(dir+"/"+fname, "r") as file:

                content = file.read()
                 
                for line in file.readlines():

                    if 'COMPANY CONFORMED NAME:' in line:
                        company = line.split(":")[1].strip()
                    
                    if 'CONFORMED SUBMISSION TYPE:' in line:
                        sub_type = line.split(":")[1].strip()

                    if 'CONFORMED PERIOD OF REPORT:' in line:
                        date = line.split(":")[1].strip()
                        estimatedPublishedDate = date[:4]+"/"+date[4:6]+"/"+date[6:8]
                    
    return []



if __name__ == "__main__":

    path = "./data/SEC/Mini/"

    docs = get_filings(path)

    
