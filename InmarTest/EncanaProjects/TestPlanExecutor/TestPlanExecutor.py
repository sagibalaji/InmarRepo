######################################################################################
"""
This application is to get test cases from multiple excel files from the source and
combined all test cases and prepare a file csv and place it sink.
"""
######################################################################################
import logging
import math
import tkinter as tk
from tkinter.ttk import *
from tkinter import filedialog, RIGHT, N, S, W, scrolledtext, E
import xlrd
import pandas as pd
import numpy as np
import re


logging.basicConfig(filename="log-file.txt", level=logging.ERROR)

logging.warning("Process start")
parent = tk.Tk()
parent.configure()
parent.resizable(0, 0)
files = None

parent.geometry("600x400")
parent.title("Azure DevOps - Test Plan Generator")


cvs_columns = ['ID', 'Work Item Type', 'Title', 'Test Step', 'Step Action', 'Step Expected']

strpath = tk.StringVar()


def skipspecialcharacter(inputstr):
    if isinstance(inputstr, str):
        output = inputstr.replace('<', '').replace('>', '')
    else:
        output = inputstr
    return output


def create_empty_df():
    """
    This method return empty dataframe
    :param:no parameters required
    :return: dataframe
    """
    df = pd.DataFrame(columns=cvs_columns)
    return df


def openfile():
    """
    this method is get excel file from windows using filedialog control
    :param: No input parameters required
    :return: void
    """
    global files
    global strpath
    lbl_status["text"] = ""
    text_file.configure(state="normal")
    text_file.delete(0, tk.END)
    if strpath is None or strpath != "":
        file_path = strpath
    else:
        file_path = "C:/"
    strpath.set("")

    try:
        files = filedialog.askopenfiles(initialdir=file_path,
                                        filetypes=(("xlsx files", "*.xlsx"), ("xls file", "*.xls")),
                                        title="select a file")
        if len(files) > 0:
            dir1 = files[0].name
            target = re.sub(files[0].name.split('/')[-1], '', dir1)
            strpath.set(target)
            for file in files:
                data = pd.read_excel(file.name)
                filename = file.name.split('/')[-1]
                text_file.insert("end", filename + "\n")
        text_file.configure(state="disabled")

    except Exception as ex:
        logging.error("Error: " + str(ex))
        lbl_status["text"] = "file selection failed. Please check logs for more info"
        print(str(ex))


def process_file():
    """
    This method is to get all test cases information from different excel files
    and generate a csv file
    :param: No input parameters
    :return: void
    """
    try:
        global files
        df = create_empty_df()

        if files is not None and len(files) > 0:
            file_dir_ary = files[0].name.split('/')
            target = file_dir_ary[0: len(file_dir_ary) - 1]
            targetdir = '/'.join(target) + "/Test_Cases_Report.csv"
            for file in files:
                data = pd.read_excel(file.name)
                filename = file.name.split('/')[-1]
                filename = filename.split('.')[0]
                index = data.index
                no_of_rows = len(index)
                if no_of_rows > 0:
                    df = df.append(
                        {'ID': '', 'Work Item Type': 'Test Case', 'Title': filename, 'Test Step': '',
                         'Step Action': '', 'Step Expected': ''}, ignore_index=True)
                    logging.info(data.columns)
                    print(data.columns)
                    # data = data.fillna(0)
                    lst_child = []
                    i = 1
                    for item in data.index:
                        if str(data[data.columns.values[0]][item]).strip().isnumeric():
                            dic = {'ID': '', 'Work Item Type': '', 'Title': '', 'Test Step': str(data[data.columns.values[0]][item]),
                                   'Step Action': skipspecialcharacter(data[data.columns.values[1]][item]),
                                   'Step Expected': skipspecialcharacter(data[data.columns.values[2]][item])}
                            lst_child.append(dic)
                        else:
                            stepno = data[data.columns.values[0]][item]
                            if isinstance(stepno, float):
                                if not math.isnan(stepno):
                                    dic = {'ID': '', 'Work Item Type': '', 'Title': '', 'Test Step': round(stepno),
                                           'Step Action': skipspecialcharacter(data[data.columns.values[1]][item]),
                                           'Step Expected': skipspecialcharacter(
                                              data[data.columns.values[2]][item])}
                                    lst_child.append(dic)
                            elif stepno[:4] in ['Step', 'step']:
                                dic = {'ID': '', 'Work Item Type': '', 'Title': '', 'Test Step': data[data.columns.values[0]][item][4:],
                                       'Step Action': skipspecialcharacter(data[data.columns.values[1]][item]),
                                       'Step Expected': skipspecialcharacter(data[data.columns.values[2]][item])}
                                lst_child.append(dic)
                            else:
                                dic = {'ID': '', 'Work Item Type': '', 'Title': '',
                                       'Test Step': i,
                                       'Step Action': skipspecialcharacter(data[data.columns.values[0]][item]),
                                       'Step Expected': skipspecialcharacter(data[data.columns.values[1]][item])}
                                i = i+1
                                lst_child.append(dic)

                    df = df.append(lst_child, ignore_index=True)

            df.to_csv(targetdir, index=False)
            lbl_status["text"] = "CSV file created successfully."
        else:
            lbl_status["text"] = "Please select Test Case file(s) to process."
    except Exception as ex:
        logging.error("Error: " + str(ex))
        if str(ex) == "invalid index to scalar variable.":
            lbl_status["text"] = "Please select proper Test case document to process.\nCheck logs for more info"
        else:
            lbl_status["text"] = "Import process failed. Please check logs for more info"
        print(str(ex))


# windows form grid row 1 controls
lbl_name = Label(parent, text="Browse")
lbl_name.grid(row=0, column=1, columnspan=1, padx=30, pady=50)
text_path = Entry(parent, textvariable=strpath, state=tk.DISABLED, width=50)
text_path.grid(row=0, column=2)
button_open = Button(parent, text="Open File", command=openfile)
button_open.grid(row=0, column=3, columnspan=1)

# windows form grid row 2 controls
lbl_files = Label(parent, text="Selected Files")
lbl_files.grid(row=1, column=1, padx=30, pady=20)
xscrollbar = Scrollbar(parent, orient=tk.HORIZONTAL)
xscrollbar.grid(row=2, column=2, sticky=N+S+E+W)
yscrollbar = Scrollbar(parent)
yscrollbar.grid(row=1, column=3, sticky=N+S+E+W)

text_file = tk.Listbox(parent, width=53, height=10, xscrollcommand=xscrollbar.set, yscrollcommand=yscrollbar.set)  # scrolledtext.ScrolledText(parent, width=40, height=20, word=None)
xscrollbar.config(command=text_file.xview)
yscrollbar.config(command=text_file.yview)
text_file.configure(state="disabled")
text_file.grid(row=1, column=2)

# windows form grid row 3 controls
lbl_status_text = Label(parent, text="Status")
lbl_status_text.grid(row=3, column=1, padx=30, pady=20)
lbl_status = Label(parent, text="")
lbl_status.grid(row=3, column=2)
button_process = Button(parent, text="Generate", command=process_file)
button_process.grid(row=3, column=3)

parent.mainloop()

logging.warning("closed")
