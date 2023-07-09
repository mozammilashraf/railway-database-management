const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentStationService {
  static getClassInstance() {
    return instance ? instance : new agentStationService();
  }

  async getAllStation(req, res) {
    try {
      const query = `SELECT station_id, station_name,station_code, states.state_name, zones.zone_name, zones.zone_code from stations
        LEFT JOIN states ON states.state_id = stations.state_id
        LEFT JOIN zones ON zones.zone_id = stations.zone_id`;
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }

  async getStation(req, res) {
    const station = req.params.station;

    try {
      // ! Old Query
      // const query = `SELECT station_id, station_name,station_code, states.state_name, zones.zone_name, zones.zone_code from stations
      //   LEFT JOIN states ON states.state_id = stations.state_id
      //   LEFT JOIN zones ON zones.zone_id = stations.zone_id
      //   where ( LOWER(station_name) like LOWER('%${station}%') OR LOWER(station_code) like LOWER('%${station}%'));`;

      const query = `SELECT station_id, station_name,station_code, states.state_name, zones.zone_name, zones.zone_code from stations 
        LEFT JOIN states ON states.state_id = stations.state_id
        LEFT JOIN zones ON zones.zone_id = stations.zone_id
        where ( LOWER(station_name) like LOWER('%${station}%') OR LOWER(station_code) like LOWER('%${station}%'))
        ORDER BY
          CASE
            WHEN LOWER(station_code) like LOWER('${station}%') THEN 1
            ELSE 2
          END`;
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async postStation(req, res) {
    console.log("Post req made to agent Station input");
    let data = req.body;
    console.log(data);

    let stationNameData = data["station-name-input-value"];
    let staionCodeData = data["station-code-input-value"];
    let stateIDData = data["station-state-input-value"];
    let zoneIDData = data["station-zone-input-value"];

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      for (let i = 0, l = stationNameData.length; i < l; i++) {
        let stationName = stationNameData[i];
        let stationCode = staionCodeData[i];
        let stateID = parseInt(stateIDData[i]);
        let zoneID = parseInt(zoneIDData[i]);
        if (!stationName) {
          console.log("Train Type Name is Null");
          continue;
        } else if (!stationCode) {
          console.log("Train Type Description is Null");
          continue;
        }
        stationName = stationName.replace(/  +/g, " ").trim();
        stationCode = stationCode.replace(/  +/g, " ").trim();
        stationCode = stationCode.toUpperCase();

        const query = `INSERT INTO stations (station_name, station_code, state_id, zone_id) VALUES (?, ?, ?, ?)`;

        const queryData = [stationName, stationCode, stateID, zoneID];
        const data = await db.runQuery(query, queryData);

        console.log(data);

        responceData["data"].push(data.response);
        responceData["err"].push(data.err);
        if (data.error == true) responceData.error = true;
      }
    } catch (err) {
      console.log(err);
      responceData["err"].push(err.message);
      responceData["error"] = true;
    } finally {
      res.json({
        data: responceData.data,
        err: responceData.err,
        error: responceData.error,
      });
    }
  }

  async patchStation(req, res) {
    let { stationID, newStationName, newStationCode, newStateID, newZoneID } =
      req.body;

    newStationName = newStationName.replace(/  +/g, " ").trim();
    newStationCode = newStationCode.replace(/  +/g, " ").trim();
    newStationCode = newStationCode.toUpperCase();

    stationID = parseInt(stationID, 10);
    newStateID = parseInt(newStateID, 10);
    newZoneID = parseInt(newZoneID, 10);

    console.log(req.body);

    try {
      const query = `UPDATE stations SET station_name = ?, station_code = ?, state_id = ?, zone_id = ? WHERE station_id  = ?`;

      const queryData = [
        newStationName,
        newStationCode,
        newStateID,
        newZoneID,
        stationID,
      ];

      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async deleteStation(req, res) {
    let stationID = req.params.stationID;
    stationID = parseInt(stationID, 10);

    try {
      const query = "DELETE FROM stations WHERE station_id  = ?";
      const queryData = [stationID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
}

module.exports = agentStationService;
