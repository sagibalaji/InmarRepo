from flask import Flask, jsonify, request, render_template, send_from_directory
from Controllers import AreaRouteController as arc
from Controllers import FieldStatusController as field
from Controllers import DashBoardController as dashBoard

app = Flask(__name__)

@app.route('/')
def root():
    return render_template("index.html")

@app.route('/api/AreaRoute/BasinAreas/')
def basinAreas():
    areas = arc.AreaBasinController()
    return jsonify(areas.get())

@app.route('/api/AreaRoute/RoutesForBasinArea/')
def routeBasinAreas():
    basin = request.args.get("basin")
    area = request.args.get("area")
    return jsonify(arc.RouteController().get(basin, area))

@app.route('/api/FieldStatus/', methods=['POST'])
def saveFieldStatus():
    fieldStatus = request.get_json()
    print(f"fieldstatus from angular: {fieldStatus}")
    return jsonify(field.FieldStatusController().post(fieldStatus))

@app.route('/api/StatusForEmail/<string:email>')
def fieldStatus(email):
    print(email)
    return jsonify(field.FieldStatusController().get(email))

@app.route('/api/DashBoard/GetStatusForDate/<string:statusDate>/<string:userName>')
def GetStatusForDate(statusDate, userName):
    return jsonify(dashBoard.DashBoardController().GetStatusForDate(statusDate, userName))


if __name__ == "__main__":
    # app.run(debug=True, port=44340)
    app.run(debug=True, ssl_context='adhoc', port=44340)