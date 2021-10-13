from sqlalchemy import create_engine, MetaData, Table, Column, String, DateTime, Boolean, NVARCHAR, BINARY, select
import pandas as pd
import pyodbc
import uuid
from . import BasinArea, FieldStatus
from configparser import ConfigParser

parser = ConfigParser()

parser.read("appSettings.ini")

"""
////  Azure Sql Server Details
"""
a_server = parser.get("Azure_Db", "a_server")
a_database = parser.get("Azure_Db", "a_database")
a_username = parser.get("Azure_Db", "a_username")
a_password = parser.get("Azure_Db", "a_password")
a_driver = parser.get("Azure_Db", "a_driver")


"""
////  Sql Server Details
"""
driver = parser.get("SQL_Db", "driver")
database = parser.get("SQL_Db", "database")
server = parser.get("SQL_Db", "server")
username = parser.get("SQL_Db", "username")
password = parser.get("SQL_Db", "password")

meta = MetaData()

field_Status = Table(
    'Field_Status', meta,
    Column('id', NVARCHAR, primary_key=True, autoincrement=False),
    Column('CreatedAt', DateTime),
    Column('UpdatedAt', DateTime),
    Column('Version', BINARY),
    Column('Deleted', Boolean),
    Column('Email', String),
    Column('Status', String),
    Column('PhoneNumber', String),
    Column('StatusDate', DateTime),
    Column('AppNameVersion', String),
    Column('Manager', String),
    Column('Comment', String),
    Column('ChangedBy', String),
    Column('Area', String),
    Column('route', String)
)

"""
/// Get a list of available basins and areas.
"""
def readBasinAreas():
    conn = pyodbc.connect('DRIVER=' + a_driver + ';SERVER=' + a_server + ';PORT=1433;DATABASE=' + a_database + ';UID=' + a_username + ';PWD=' + a_password)
    areaBasin = pd.read_sql_query("SELECT DISTINCT basin, area FROM cygnet_usa.facility_vw WHERE basin <> '' AND area <> 'TEMPLATE' AND area <> '' AND route <> ''", conn)
    count = 0
    basinList = []

    for item in areaBasin.index:
        basinarea = BasinArea.BasinArea()
        basinarea.Area = str(areaBasin[areaBasin.columns.values[1]][item])
        basinarea.Basin = str(areaBasin[areaBasin.columns.values[0]][item])
        # data = {"Area": basinarea.Area, "Basin": basinarea.Basin}
        basinList.append(basinarea)
        count += 1

    return basinList

"""
/// Get a list of routes for the given basin/area from the database.
"""
def readRoutesForBasinArea(basin, area):
    conn = pyodbc.connect('DRIVER=' + a_driver + ';SERVER=' + a_server + ';PORT=1433;DATABASE=' + a_database + ';UID=' + a_username + ';PWD=' + a_password)
    query = "SELECT DISTINCT route FROM cygnet_usa.facility_vw  WHERE basin = '"+ basin +"' AND area = '"+ area +"' AND route <> ''"
    routeAreaBasin = pd.read_sql_query(query, conn)
    routesList = []

    for item in routeAreaBasin.index:
        route = str(routeAreaBasin[routeAreaBasin.columns.values[0]][item])
        routesList.append(route)
        
    print(len(routesList))
    return routesList

"""
/// Add a field status to the database.
"""
def saveFieldStatus(fieldStatus):
    db_con = f'mssql://{username}:{password}@{server}/{database}?driver={driver}'
    engine = create_engine(db_con)
    conn = engine.connect()

    uuidnumber = str(uuid.uuid4())
    
    conn.execute(field_Status.insert(),
                 {
                     "id": uuidnumber,
                     "CreatedAt": fieldStatus.get("createdAt"),
                     "UpdatedAt": fieldStatus.get("updatedAt"),
                     "Version": fieldStatus.get("version"),
                     "Deleted": False,
                     "Email": fieldStatus.get("email"),
                     "Status": fieldStatus.get("status"),
                     "PhoneNumber": fieldStatus.get("phoneNumber"),
                     "StatusDate": fieldStatus.get("statusDate"),
                     "AppNameVersion": fieldStatus.get("appNameVersion"),
                     "Manager": fieldStatus.get("manager"),
                     "Comment": fieldStatus.get("comment"),
                     "ChangedBy": fieldStatus.get("changedBy"),
                     "Area": fieldStatus.get("area"),
                     "route": fieldStatus.get("route")
                 })

"""
/// Get field Status based on email
"""
def getStatusField(email):
    db_con = f'mssql://{username}:{password}@{server}/{database}?driver={driver}'
    engine = create_engine(db_con)
    conn = engine.connect()
    result = None
    try:
        fieldStatus_email = select([field_Status]).where(field_Status.c.Email == email).order_by(field_Status.c.CreatedAt.desc())
        result = conn.execute(fieldStatus_email)
    except Exception as e:
        print("Error: " + str(e))
    
    firResult = result.fetchone()
    return firResult

"""
/// Determine if the field status with the given Id exists.
"""
def _fieldStatusExists(id):
        # Code need to implement for id check
        Id = id

"""
/// Get Status of the employees
"""
def getStatusEmployees(statusDate, userName):
    db_con = f'mssql://{username}:{password}@{server}/{database}?driver={driver}'
    engine = create_engine(db_con)
    sqlQuery = f"""WITH a (email, manager, status, area, route,statusDate, currentTimeMST, statusDateAtMST, createdAt) as
                                                  (SELECT f.email, f.manager, f.status, f.area, f.route, f.statusDate, 
                                                  (getutcdate() AT TIME ZONE 'UTC') AT TIME ZONE 'Mountain Standard Time', 
                                                  f.statusDate at TIME ZONE 'Mountain Standard Time' statusDateAtMST, 
                                                  f.createdAt FROM FIELD_STATUS f)
                                                  SELECT ISNULL(CAST((row_number() OVER(ORDER BY f.statusDate, f.email)) AS int), 0) AS id, 
                                                  f.email, f.manager, f.status, f.area, f.route, f.statusDate, f.createdAt, f.statusDateAtMST, 
                                                  s.Value EndOfDay, CONVERT(varchar(30), f.currentTimeMST, 114) currentTimeMST, 
                                                  CASE 
                                                  WHEN CONVERT(varchar(30), f.currentTimeMST, 114) BETWEEN s.Value AND '23:59:59' AND STATUS = 'IN' then 1 
                                                  WHEN CONVERT(date, f.currentTimeMST) >  statusDateAtMST AND STATUS = 'IN' then 1 
                                                  ELSE 0  
                                                  END as isLate 
                                                  FROM a f 
                                                  JOIN (SELECT email, MAX(F2.statusDate) lastUpdatedAt FROM a F2 where F2.statusDateAtMST <=  cast('{statusDate}' as datetime) GROUP BY email) F2 ON F2.email = f.EMAIL 
                                                  LEFT JOIN SYSTEM_SETTING S on S.Setting = 'EndOfDay' 
                                                  where f.statusDate = F2.lastUpdatedAt 
                                                  and f.email<> ''
                                                  ORDER BY isLate desc, f.status, f.statusDate desc"""
    employeesList = []
    with engine.connect() as con:
        rs = con.execute(sqlQuery)
        for row in rs:
            print(row)
            employeesList.append(row)
    
    return employeesList