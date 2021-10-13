from elasticsearch import Elasticsearch
import logging, sys

logging.basicConfig(
    stream=sys.stdout,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.WARNING
)

LOGGER = logging.getLogger(__name__)

ES_CLIENT = Elasticsearch(
    ['http://elastic:elastic@es.encana.com:9200'], timeout=1000)

ES_INDEX = 'articles-*'

SP500 = [{
    'sector': 'Communication Services',
    'symbols': ['ATVI', 'CBS', 'CHTR', 'CMCSA', 'CTL', 'DIS', 'DISCA', 'DISH', 'EA', 'FB', 'FOX', 'GOOG', 'IPG', 'NFLX', 'NWS', 'OMC', 'T', 'TMUS', 'TRIP', 'TTWO', 'TWTR', 'VIAB', 'VZ']
}, {
    'sector': 'Consumer Discretionary',
    'symbols': ['AAP', 'AMZN', 'APTV', 'AZO', 'BBY', 'BKNG', 'BWA', 'CCL', 'CMG', 'CPRI', 'DG', 'DHI', 'DLTR', 'DRI', 'EBAY', 'EXPE', 'F', 'GM', 'GPC', 'GPS', 'GRMN', 'HAS', 'HBI', 'HD', 'HLT', 'HOG', 'HRB', 'JWN', 'KMX', 'KSS', 'LB', 'LEG', 'LEN', 'LKQ', 'LOW', 'M', 'MAR', 'MCD', 'MGM', 'MHK', 'NCLH', 'NKE', 'NWL', 'ORLY', 'PHM', 'PVH', 'RCL', 'RL', 'ROST', 'SBUX', 'TGT', 'TIF', 'TJX', 'TPR', 'TSCO', 'UA', 'ULTA', 'VFC', 'WHR', 'WYNN', 'YUM']
}, {
    'sector': 'Consumer Staples',
    'symbols': ['ADM', 'BF.B', 'CAG', 'CHD', 'CL', 'CLX', 'COST', 'COTY', 'CPB', 'EL', 'GIS', 'HRL', 'HSY', 'K', 'KHC', 'KMB', 'KO', 'KR', 'LW', 'MDLZ', 'MKC', 'MNST', 'MO', 'PEP', 'PG', 'PM', 'SJM', 'STZ', 'SYY', 'TAP', 'TSN', 'WBA', 'WMT']
}, {
    'sector': 'Energy',
    'symbols': ['AXAS', 'AR', 'APA', 'BTE', 'BRY', 'BSM', 'BCEI', 'BP', 'MNRL', 'COG', 'CRC', 'CPE', 'CNQ', 'CRZO', 'CVE', 'CDEV', 'CHAP', 'CHK', 'CVX', 'SNP', 'XEC', 'CEO', 'CNX', 'CRK', 'CXO', 'COP', 'CLR', 'CPG', 'DNR', 'DVN', 'DO', 'FANG', 'DMLP', 'ESTE', 'EC', 'ECA', 'ERF', 'E', 'EOG', 'EPSN', 'EQT', 'EQNR', 'EPM', 'XOG', 'XOM', 'FLMN', 'GPRK', 'GDP', 'GTE', 'GPOR', 'HP', 'HES', 'HESM', 'HPR', 'IMO', 'IO', 'ISRL', 'JAG', 'KOS', 'LPI', 'LONE', 'MGY', 'MRO', 'MTDR', 'MR', 'MUR', 'NBR', 'NE', 'NBL', 'NOG', 'OMP', 'OAS', 'OBE', 'OXY', 'OVV', 'PACD', 'PARR', 'PKD', 'PE', 'PTEN', 'PDCE', 'PED', 'PBA', 'PVAC', 'PTR', 'PBR', 'PXD', 'PDS', 'PNRG', 'QEP', 'RRC', 'REI', 'ROAN', 'ROSE', 'SD', 'SSL', 'SDRL', 'SBOW', 'SM', 'SWN', 'SRCI', 'SU', 'TALO', 'TELL', 'TTI', 'TPL', 'TRCH', 'TOT', 'TGA', 'RIG', 'UNT', 'EGY', 'VAL', 'VET', 'VNOM', 'WTI', 'WLL', 'WPX', 'YPF', 'BHGE', 'COG', 'COP', 'CVX', 'CXO', 'DVN', 'EOG', 'FANG', 'FTI', 'HAL', 'HES', 'HFC', 'HP', 'KMI', 'MPC', 'MRO', 'NBL', 'NOV', 'OKE', 'OXY', 'PSX', 'PXD', 'SLB', 'VLO', 'WMB', 'XEC', 'XOM']
}, {
    'sector': 'Financials',
    'symbols': ['AFL', 'AIG', 'AIZ', 'AJG', 'ALL', 'AMG', 'AMP', 'AON', 'AXP', 'BAC', 'BBT', 'BEN', 'BK', 'BLK', 'BRK.B', 'C', 'CB', 'CBOE', 'CFG', 'CINF', 'CMA', 'CME', 'COF', 'DFS', 'ETFC', 'FITB', 'FRC', 'GL', 'GS', 'HBAN', 'HIG', 'ICE', 'IVZ', 'JEF', 'JPM', 'KEY', 'L', 'LNC', 'MCO', 'MET', 'MKTX', 'MMC', 'MS', 'MSCI', 'MTB', 'NDAQ', 'NTRS', 'PBCT', 'PFG', 'PGR', 'PNC', 'PRU', 'RE', 'RF', 'RJF', 'SCHW', 'SIVB', 'SPGI', 'STI', 'STT', 'SYF', 'TROW', 'TRV', 'UNM', 'USB', 'WFC', 'WLTW', 'ZION']
}, {
    'sector': 'Health Care',
    'symbols': ['ABBV', 'ABC', 'ABMD', 'ABT', 'AGN', 'ALGN', 'ALXN', 'AMGN', 'ANTM', 'BAX', 'BDX', 'BIIB', 'BMY', 'BSX', 'CAH', 'CELG', 'CERN', 'CI', 'CNC', 'COO', 'CVS', 'DGX', 'DHR', 'DVA', 'EW', 'GILD', 'HCA', 'HOLX', 'HSIC', 'HUM', 'IDXX', 'ILMN', 'INCY', 'IQV', 'ISRG', 'JNJ', 'LH', 'LLY', 'MCK', 'MDT', 'MRK', 'MTD', 'MYL', 'NKTR', 'PFE', 'PKI', 'PRGO', 'REGN', 'RMD', 'SYK', 'TFX', 'TMO', 'UHS', 'UNH', 'VAR', 'VRTX', 'WAT', 'WCG', 'XRAY', 'ZBH', 'ZTS']
}, {
    'sector': 'Industrials',
    'symbols': ['AAL', 'ALK', 'ALLE', 'AME', 'AOS', 'ARNC', 'BA', 'CAT', 'CHRW', 'CMI', 'CPRT', 'CSX', 'CTAS', 'DAL', 'DE', 'DOV', 'EFX', 'EMR', 'ETN', 'EXPD', 'FAST', 'FBHS', 'FDX', 'FLS', 'FTV', 'GD', 'GE', 'GWW', 'HII', 'HON', 'IEX', 'INFO', 'IR', 'ITW', 'JBHT', 'JCI', 'JEC', 'KSU', 'LHX', 'LMT', 'LUV', 'MAS', 'MMM', 'NLSN', 'NOC', 'NSC', 'PCAR', 'PH', 'PNR', 'PWR', 'RHI', 'ROK', 'ROL', 'ROP', 'RSG', 'RTN', 'SNA', 'SWK', 'TDG', 'TXT', 'UAL', 'UNP', 'UPS', 'URI', 'UTX', 'VRSK', 'WAB', 'WM', 'XYL']
}, {
    'sector': 'Information Technology',
    'symbols': ['AAPL', 'ACN', 'ADBE', 'ADI', 'ADP', 'ADS', 'ADSK', 'AKAM', 'AMAT', 'AMD', 'ANET', 'ANSS', 'APH', 'AVGO', 'BR', 'CDNS', 'CRM', 'CSCO', 'CTSH', 'CTXS', 'DXC', 'FFIV', 'FIS', 'FISV', 'FLIR', 'FLT', 'FTNT', 'GLW', 'GPN', 'HPE', 'HPQ', 'IBM', 'INTC', 'INTU', 'IPGP', 'IT', 'JKHY', 'JNPR', 'KEYS', 'KLAC', 'LDOS', 'LRCX', 'MA', 'MCHP', 'MSFT', 'MSI', 'MU', 'MXIM', 'NTAP', 'NVDA', 'ORCL', 'PAYX', 'PYPL', 'QCOM', 'QRVO', 'SNPS', 'STX', 'SWKS', 'SYMC', 'TEL', 'TSS', 'TXN', 'V', 'VRSN', 'WDC', 'WU', 'XLNX', 'XRX']
}, {
    'sector': 'Materials',
    'symbols': ['ALB', 'AMCR', 'APD', 'AVY', 'BLL', 'CE', 'CF', 'CTVA', 'DD', 'DOW', 'ECL', 'EMN', 'FCX', 'FMC', 'IFF', 'IP', 'LIN', 'LYB', 'MLM', 'MOS', 'NEM', 'NUE', 'PKG', 'PPG', 'SEE', 'SHW', 'VMC', 'WRK']
}, {
    'sector': 'Real Estate',
    'symbols': ['AIV', 'AMT', 'ARE', 'AVB', 'BXP', 'CBRE', 'CCI', 'DLR', 'DRE', 'EQIX', 'EQR', 'ESS', 'EXR', 'FRT', 'HCP', 'HST', 'IRM', 'KIM', 'MAA', 'MAC', 'O', 'PLD', 'PSA', 'REG', 'SBAC', 'SLG', 'SPG', 'UDR', 'VNO', 'VTR', 'WELL', 'WY']
}, {
    'sector': 'Utilities',
    'symbols': ['AEE', 'AEP', 'AES', 'ATO', 'AWK', 'CMS', 'CNP', 'D', 'DTE', 'DUK', 'ED', 'EIX', 'ES', 'ETR', 'EVRG', 'EXC', 'FE', 'LNT', 'NEE', 'NI', 'NRG', 'PEG', 'PNW', 'PPL', 'SO', 'SRE', 'WEC', 'XEL']
}]

EP = [
    {'name': 'Abraxas Petroleum Corp', 'symbol': 'AXAS'},
    {'name': 'Antero Resources Corp', 'symbol': 'AR'},
    {'name': 'Apache Corp', 'symbol': 'APA'},
    {'name': 'Baytex Energy Corp', 'symbol': 'BTE'},
    {'name': 'Berry Petroleum Corp', 'symbol': 'BRY'},
    {'name': 'Black Stone Minerals LP', 'symbol': 'BSM'},
    {'name': 'Bonanza Creek Energy Inc', 'symbol': 'BCEI'},
    {'name': 'BP PLC', 'symbol': 'BP'},
    {'name': 'Brigham Minerals Inc', 'symbol': 'MNRL'},
    {'name': 'Cabot Oil & Gas Corp', 'symbol': 'COG'},
    {'name': 'California Resources Corp', 'symbol': 'CRC'},
    {'name': 'Callon Petroleum Co', 'symbol': 'CPE'},
    {'name': 'Canadian Natural Resources Ltd', 'symbol': 'CNQ'},
    {'name': 'Carrizo Oil & Gas Inc', 'symbol': 'CRZO'},
    {'name': 'Cenovus Energy Inc', 'symbol': 'CVE'},
    {'name': 'Centennial Resource Development Inc', 'symbol': 'CDEV'},
    {'name': 'Chaparral Energy Inc', 'symbol': 'CHAP'},
    {'name': 'Chesapeake Energy Corp', 'symbol': 'CHK'},
    {'name': 'Chevron Corp', 'symbol': 'CVX'},
    {'name': 'China Petroleum & Chemical Corp', 'symbol': 'SNP'},
    {'name': 'Cimarex Energy Co', 'symbol': 'XEC'},
    {'name': 'CNOOC Ltd', 'symbol': 'CEO'},
    {'name': 'CNX Resources Corp', 'symbol': 'CNX'},
    {'name': 'Comstock Resources Inc', 'symbol': 'CRK'},
    {'name': 'Concho Resources Inc', 'symbol': 'CXO'},
    {'name': 'ConocoPhillips', 'symbol': 'COP'},
    {'name': 'Continental Resources Inc', 'symbol': 'CLR'},
    {'name': 'Crescent Point Energy Corp', 'symbol': 'CPG'},
    {'name': 'Denbury Resources Inc', 'symbol': 'DNR'},
    {'name': 'Devon Energy Corp', 'symbol': 'DVN'},
    {'name': 'Diamond Offshore Drilling Inc', 'symbol': 'DO'},
    {'name': 'Diamondback Energy Inc', 'symbol': 'FANG'},
    {'name': 'Dorchester Minerals LP', 'symbol': 'DMLP'},
    {'name': 'Earthstone Energy Inc', 'symbol': 'ESTE'},
    {'name': 'Ecopetrol SA', 'symbol': 'EC'},
    {'name': 'Encana Corp', 'symbol': 'ECA'},
    {'name': 'Enerplus Corp', 'symbol': 'ERF'},
    {'name': 'Eni SpA', 'symbol': 'E'},
    {'name': 'EOG Resources Inc', 'symbol': 'EOG'},
    {'name': 'Epsilon Energy Ltd', 'symbol': 'EPSN'},
    {'name': 'EQT Corp', 'symbol': 'EQT'},
    {'name': 'Equinor ASA', 'symbol': 'EQNR'},
    {'name': 'Evolution Petroleum Corp', 'symbol': 'EPM'},
    {'name': 'Extraction Oil & Gas Inc', 'symbol': 'XOG'},
    {'name': 'Exxon Mobil Corp', 'symbol': 'XOM'},
    {'name': 'Falcon Minerals Corp', 'symbol': 'FLMN'},
    {'name': 'GeoPark Ltd', 'symbol': 'GPRK'},
    {'name': 'Goodrich Petroleum Corp', 'symbol': 'GDP'},
    {'name': 'Gran Tierra Energy Inc', 'symbol': 'GTE'},
    {'name': 'Gulfport Energy Corp', 'symbol': 'GPOR'},
    {'name': 'Helmerich and Payne Inc', 'symbol': 'HP'},
    {'name': 'Hess Corp', 'symbol': 'HES'},
    {'name': 'Hess Midstream Partners LP', 'symbol': 'HESM'},
    {'name': 'HighPoint Resources Corp', 'symbol': 'HPR'},
    {'name': 'Imperial Oil Ltd', 'symbol': 'IMO'},
    {'name': 'ION Geophysical Corp', 'symbol': 'IO'},
    {'name': 'Isramco Inc', 'symbol': 'ISRL'},
    {'name': 'Jagged Peak Energy Inc', 'symbol': 'JAG'},
    {'name': 'Kosmos Energy Ltd', 'symbol': 'KOS'},
    {'name': 'Laredo Petroleum Inc', 'symbol': 'LPI'},
    {'name': 'Lonestar Resources US Inc', 'symbol': 'LONE'},
    {'name': 'Magnolia Oil & Gas Corp', 'symbol': 'MGY'},
    {'name': 'Marathon Oil Corp', 'symbol': 'MRO'},
    {'name': 'Matador Resources Co', 'symbol': 'MTDR'},
    {'name': 'Montage Resources Corp', 'symbol': 'MR'},
    {'name': 'Murphy Oil Corp', 'symbol': 'MUR'},
    {'name': 'Nabors Industries Ltd', 'symbol': 'NBR'},
    {'name': 'Noble Corporation PLC', 'symbol': 'NE'},
    {'name': 'Noble Energy Inc', 'symbol': 'NBL'},
    {'name': 'Northern Oil and Gas Inc', 'symbol': 'NOG'},
    {'name': 'Oasis Midstream Partners LP', 'symbol': 'OMP'},
    {'name': 'Oasis Petroleum Inc', 'symbol': 'OAS'},
    {'name': 'Obsidian Energy Ltd', 'symbol': 'OBE'},
    {'name': 'Occidental Petroleum Corp', 'symbol': 'OXY'},
    {'name': 'Pacific Drilling SA', 'symbol': 'PACD'},
    {'name': 'Par Pacific Holdings Inc', 'symbol': 'PARR'},
    {'name': 'Parker Drilling Co', 'symbol': 'PKD'},
    {'name': 'Parsley Energy Inc', 'symbol': 'PE'},
    {'name': 'Patterson-UTI Energy Inc', 'symbol': 'PTEN'},
    {'name': 'PDC Energy Inc', 'symbol': 'PDCE'},
    {'name': 'PEDEVCO Corp', 'symbol': 'PED'},
    {'name': 'Pembina Pipeline Corp', 'symbol': 'PBA'},
    {'name': 'Penn Virginia Corp', 'symbol': 'PVAC'},
    {'name': 'PetroChina Co Ltd', 'symbol': 'PTR'},
    {'name': 'Petroleo Brasileiro SA Petrobras', 'symbol': 'PBR'},
    {'name': 'Pioneer Natural Resources Co', 'symbol': 'PXD'},
    {'name': 'Precision Drilling Corp', 'symbol': 'PDS'},
    {'name': 'Primeenergy Resources Corp', 'symbol': 'PNRG'},
    {'name': 'QEP Resources Inc', 'symbol': 'QEP'},
    {'name': 'Range Resources Corp', 'symbol': 'RRC'},
    {'name': 'Ring Energy Inc', 'symbol': 'REI'},
    {'name': 'Roan Resources Inc', 'symbol': 'ROAN'},
    {'name': 'Rosehill Resources Inc', 'symbol': 'ROSE'},
    {'name': 'SandRidge Energy Inc', 'symbol': 'SD'},
    {'name': 'Sasol Ltd', 'symbol': 'SSL'},
    {'name': 'Seadrill Ltd', 'symbol': 'SDRL'},
    {'name': 'SilverBow Resources Inc', 'symbol': 'SBOW'},
    {'name': 'SM Energy Co', 'symbol': 'SM'},
    {'name': 'Southwestern Energy Co', 'symbol': 'SWN'},
    {'name': 'SRC Energy Inc', 'symbol': 'SRCI'},
    {'name': 'Suncor Energy Inc', 'symbol': 'SU'},
    {'name': 'Talos Energy Inc', 'symbol': 'TALO'},
    {'name': 'Tellurian Inc', 'symbol': 'TELL'},
    {'name': 'Tetra Technologies Inc', 'symbol': 'TTI'},
    {'name': 'Texas Pacific Land Trust', 'symbol': 'TPL'},
    {'name': 'Torchlight Energy Resources Inc', 'symbol': 'TRCH'},
    {'name': 'Total SA', 'symbol': 'TOT'},
    {'name': 'TransGlobe Energy Corp', 'symbol': 'TGA'},
    {'name': 'Transocean Ltd', 'symbol': 'RIG'},
    {'name': 'Unit Corp', 'symbol': 'UNT'},
    {'name': 'VAALCO Energy Inc', 'symbol': 'EGY'},
    {'name': 'Valaris PLC', 'symbol': 'VAL'},
    {'name': 'Vermilion Energy Inc', 'symbol': 'VET'},
    {'name': 'Viper Energy Partners LP', 'symbol': 'VNOM'},
    {'name': 'W&T Offshore Inc', 'symbol': 'WTI'},
    {'name': 'Whiting Petroleum Corp', 'symbol': 'WLL'},
    {'name': 'WPX Energy Inc', 'symbol': 'WPX'},
    {'name': 'YPF SA', 'symbol': 'YPF'}
]
