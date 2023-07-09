const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class frontEndService {
  static getClassInstance() {
    return instance ? instance : new frontEndService();
  }

  async searchTrainBtwStations(req) {
    const responceData = {
      data: [],
      err: [],
      error: false,
    };
    let data = req.body;
    console.log(data);
    responceData.searchDate = data["search-date"];
    responceData.fromStation = data["from-station"];
    responceData.toStation = data["to-station"];
    responceData.classType = data["class-type"];
    try {
      const query = `SELECT train_id  FROM train_timetable ttb
      WHERE (ttb.station_id = (SELECT station_id FROM stations WHERE station_code = ?) AND ttb.train_id IN
      (SELECT ttb2.train_id FROM train_timetable ttb2 WHERE
      (ttb2.station_id = (SELECT station_id FROM stations WHERE station_code = ?) AND
      ttb2.sr_no > ttb.sr_no ) ) )`;
      const queryData = [data["from-station"], data["to-station"]];
      const data1 = await db.runQuery(query, queryData);
      // responceData["data"].push(data1.response);
      responceData["err"].push(data1.err);
      // responceData["error"].push(data1.error);
      if (data1.error == true) responceData.error = true;
      else {
        // let promise = new Promise((resolve, reject) => {
        for (let i = 0; i < data1.response.length; i++) {
          const trainDataObject = {};
          const element = data1.response[i];
          const trainID = element["train_id"];
          const query2 = `SELECT train_no, train_name, sunday, monday, tuesday, wednesday,
          thursday, friday, saturday, train_types.train_type_name
          FROM trains
          INNER JOIN train_types ON trains.train_type_id = train_types.train_type_id
          WHERE train_id = ?`;

          const data2 = await db.runQuery(query2, [trainID]);
          const t = data2.response[0];
          trainDataObject["train-number"] = t.train_no;
          trainDataObject["train-name"] = t.train_name;
          trainDataObject.day = [
            parseInt(t.sunday),
            parseInt(t.monday),
            parseInt(t.tuesday),
            parseInt(t.wednesday),
            parseInt(t.thursday),
            parseInt(t.friday),
            parseInt(t.saturday),
          ];
          trainDataObject["train-type"] = t.train_type_name;

          const query3 = `SELECT sr_no, s.station_name, s.station_code, 
            TIME_FORMAT(arrival_time, "%H:%i") AS arrival_time,
            TIME_FORMAT(departure_time, "%H:%i") AS departure_time, 
            day, distance_traveled, platform, halt_time FROM train_timetable t
            INNER JOIN stations s ON t.station_id = s.station_id
            WHERE (t.train_id = ? AND ( s.station_code = ? OR s.station_code = ?) )
            ORDER BY (sr_no) ASC`;
          const queryData3 = [
            trainID,
            data["from-station"],
            data["to-station"],
          ];
          const data3 = await db.runQuery(query3, queryData3);
          trainDataObject["from-station-data"] = data3.response[0];
          trainDataObject["to-station-data"] = data3.response[1];
          // responceData["data"].push(trainDataObject);

          const query4 = `SELECT c.class_type_name, c.class_type_code FROM train_has_class t
          INNER JOIN class_types c ON c.class_type_id = t.class_type_id
          WHERE t.train_id = ?;`;
          const queryData4 = [trainID];
          const data4 = await db.runQuery(query4, queryData4);

          trainDataObject["class-types"] = data4.response;

          // Class Type Filter
          if ("all-classes" == data["class-type"])
            responceData["data"].push(trainDataObject);
          else
            for (let k = 0; k < data4.response.length; k++) {
              const element = data4.response[k];
              if (element.class_type_code == data["class-type"]) {
                responceData["data"].push(trainDataObject);
                break;
              }
            }
        }
      }
    } catch (err) {
      console.log(err);
      responceData["err"].push(err.message);
      responceData["error"] = true;
    } finally {
      return {
        data: responceData.data,
        searchDate: responceData.searchDate,
        fromStation: responceData.fromStation,
        toStation: responceData.toStation,
        classType: responceData.classType,
        err: responceData.err,
        error: responceData.error,
      };
    }
  }

  async getAllClassTypeData(req, res) {
    try {
      const query = "SELECT class_type_name, class_type_code FROM class_types";
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      return { data: data.response, err: data.err, error: data.error };
    } catch (err) {
      console.log(err);
      // res.json({ data: {}, err: err.message, error: true });
      return { data: {}, err: err.message, error: true };
    }
  }
  async getStationData(req, res) {
    const station = req.params.stationName;
    try {
      // ! Old Query
      // const query = `SELECT station_id, station_name,station_code, state.state_name, zone.zone_name, zone.zone_code from stations
      //   LEFT JOIN state ON state.state_id = stations.state_id
      //   LEFT JOIN zone ON zone.zone_id = stations.zone_id
      //   where ( LOWER(station_name) like LOWER('%${station}%') OR LOWER(station_code) like LOWER('%${station}%'));`;

      const query = `SELECT station_name,station_code FROM stations 
        where ( LOWER(station_name) like LOWER('%${station}%') OR LOWER(station_code) like LOWER('%${station}%'))
        ORDER BY
          CASE
            WHEN LOWER(station_code) like LOWER('${station}%') THEN 1
            ELSE 2
          END`;
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      return { data: data.response, err: data.err, error: data.error };
    } catch (err) {
      return { data: {}, err: err.message, error: true };
    }
  }
  async getTrainTimetable(trainNumber) {
    try {
      const query = `SELECT sr_no, s.station_code, s.station_name, TIME_FORMAT(arrival_time, "%H:%i") AS arrival_time, 
        TIME_FORMAT(departure_time, "%H:%i") AS departure_time, TIME_FORMAT(halt_time, "%H:%i") AS halt_time,
        day, distance_traveled, platform FROM train_timetable t
        INNER JOIN stations s ON t.station_id = s.station_id
        WHERE train_id = (SELECT train_id FROM trains WHERE train_no = ?)
        ORDER BY (sr_no)`;
      const queryData = [trainNumber];
      const data = await db.runQuery(query, queryData);

      return { data: data.response, err: data.err, error: data.error };
    } catch (err) {
      console.log(err);
      // res.json({ data: {}, err: err.message, error: true });
      return { data: {}, err: err.message, error: true };
    }
  }
}

module.exports = frontEndService;
