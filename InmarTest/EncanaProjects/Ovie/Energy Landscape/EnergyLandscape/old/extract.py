import os
import tarfile
import gzip


def unTAR(path):

    for f in os.listdir(path):

        tar = tarfile.open(path+f, "r:")
        tar.extractall(path)
        tar.close()


def unZIP(path):

    for folder in os.listdir(path):

         for f in os.listdir(path+folder):

            try:

                gz = gzip.open(path+folder+"/"+f, 'rb')
                file_content = gz.read()
                file_content = file_content.decode('utf-8')

                f_out = open("./data/SeekingAlpha/json/"+f[:-2], 'w+')
                f_out.write(file_content)

                gz.close()
                f_out.close()

            except Exception as err:

                print("Could not parse file:", f)


if __name__ == "__main__":

    # unTAR('./data/SeekingAlpha/tars/')
    #unZIP('./data/SeekingAlpha/zips/')
