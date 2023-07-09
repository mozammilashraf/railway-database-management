const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();
const utilityModule = require("../../modules/utilities");

let instance = null;

class agentTrainTimetableService {
  static getClassInstance() {
    return instance ? instance : new agentTrainTimetableService();
  }

  async getTrainTimetable(req, res) {
    const trainID = req.params.trainID;
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = `SELECT sr_no, s.station_code, TIME_FORMAT(arrival_time, "%H:%i") AS arrival_time, 
        TIME_FORMAT(departure_time, "%H:%i") AS departure_time,
        day, distance_traveled, platform FROM train_timetable t
        INNER JOIN stations s ON t.station_id = s.station_id
        WHERE train_id = ?
        ORDER BY (sr_no)`;
      const queryData = [trainID];
      const data = await db.runQuery(query, queryData);

      responceData["data"].push(data.response);
      responceData["err"].push(data.err);
      if (data.error == true) responceData.error = true;

    } catch (err) {
      console.log(err);
    } finally {
      res.json({
        data: responceData.data,
        err: responceData.err,
        error: responceData.error,
      });
    }
  }
  async postTrainTimetable(req, res) {
    const responceData = {
      data: [],
      err: [],
      error: false,
    };
    console.log("Post req to TrainTimtable Update");
    let reqData = req.body;
    console.log(reqData);
    const trainID = parseInt(reqData["train-id"], 10);
    const stationCodeArray = reqData["station-code"].map((x) =>
      x.trim().toLowerCase()
    );
    const arrivalTimeArray = reqData["arrival-time"];
    const departureTimeArray = reqData["departure-time"];
    const dayArray = reqData["day"].map((x) => parseInt(x, 10));
    const platformArray = reqData["platform"].map((x) => parseInt(x, 10));
    const distanceTraveledArray = reqData["distance-traveled"].map((x) =>
      parseFloat(x)
    );
    const haltTime = [];
    const srNo = [];

    let specialNumberArray = [];

    for (let i = 0; i < departureTimeArray.length; i++) {
      let time = departureTimeArray[i];
      if (!time) time = arrivalTimeArray[i];

      const day = parseInt(dayArray[i], 10);
      const str = time.split(":");
      const hour = parseInt(str[0], 10);
      const minute = parseInt(str[1], 10);
      const specialNumber = (day - 1) * 24 * 60 + hour * 60 + minute;
      if (specialNumber) specialNumberArray.push(specialNumber);
    }

    specialNumberArray.sort((a, b) => a - b);

    for (let i = 0; i < departureTimeArray.length; i++) {
      const dTime = departureTimeArray[i];
      const aTime = arrivalTimeArray[i];

      if (!arrivalTimeArray[i]) {
        console.log("No Arrival Time");
        arrivalTimeArray[i] = null;
      }
      if (!departureTimeArray[i]) {
        console.log("No Departure Time");
        departureTimeArray[i] = null;
      }
      if (aTime && dTime) {
        haltTime.push(utilityModule.timeDifference(aTime, dTime));
      } else {
        haltTime.push(null);
      }

      let str = dTime.split(":");
      if (!dTime) str = aTime.split(":");

      const day = parseInt(dayArray[i], 10);
      const hour = parseInt(str[0], 10);
      const minute = parseInt(str[1], 10);
      const specialNumber = (day - 1) * 24 * 60 + hour * 60 + minute;

      if (specialNumber) {
        srNo.push(specialNumberArray.indexOf(specialNumber) + 1);
      }
    }

    const query1 = "DELETE FROM train_timetable WHERE train_id  = ?";
    const queryData1 = [trainID];
    await db.runQuery(query1, queryData1);

    try {
      for (let i = 0; i < stationCodeArray.length; i++) {
        const dataToBeSumbitted = [
          srNo[i],
          trainID,
          stationCodeArray[i],
          arrivalTimeArray[i],
          departureTimeArray[i],
          dayArray[i],
          distanceTraveledArray[i],
          platformArray[i],
          haltTime[i],
        ];
        const query2 = `INSERT INTO train_timetable (sr_no, train_id, station_id, arrival_time, 
            departure_time, day, distance_traveled, platform, halt_time ) 
            VALUES (?, ?, (SELECT station_id FROM stations WHERE LOWER(station_code) = ?), ?, ?, ?, ?, ?, ?);`;

        const data = await db.runQuery(query2, dataToBeSumbitted);

        responceData["data"].push(data.response);
        responceData["err"].push(data.err);
        if (data.error == true) responceData.error = true;
        // console.table(dataToBeSumbitted);
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
}

module.exports = agentTrainTimetableService;
