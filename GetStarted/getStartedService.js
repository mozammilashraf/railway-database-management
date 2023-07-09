const dbService = require("../services/dbService");
const db = dbService.getDbServiceInstance();
const utilityModule = require("../modules/utilities");
const crypto = require("crypto");

let instance = null;

const getStartedScripts = require("./getStartedScripts");
const sampleData = require("./sampleData");
const trainTimetableData = require("./trainTimetableData");
const stationsData = require("./stationsData");
const { time } = require("console");
class getStartedService {
  static getClassInstance() {
    return instance ? instance : new getStartedService();
  }
  async createTables() {
    const responceData = {
      data: [],
      err: [],
      error: false,
    };
    try {
      const results = await Promise.all([
        db.runQuery(getStartedScripts.createAgentTable, []),
        db.runQuery(getStartedScripts.createAgentRequestTable, []),
        db.runQuery(getStartedScripts.createStateTable, []),
        db.runQuery(getStartedScripts.createZoneTable, []),
        db.runQuery(getStartedScripts.createTrainTypeTable, []),
        db.runQuery(getStartedScripts.createClassTypeTable, []),
        db.runQuery(getStartedScripts.createStationTable, []),
        db.runQuery(getStartedScripts.createTrainTable, []),
        db.runQuery(getStartedScripts.createTrainHasClassTable, []),
        db.runQuery(getStartedScripts.createTrainTimetableTable, []),
      ]);
      results.forEach((result) => {
        responceData.data.push(result.responce);
        responceData.err.push(result.err);
        // console.log(result.err);
        if (result.error === true) responceData.error = true;
      });
    } catch (err) {
      console.log(err);
      responceData["err"].push(err.message);
      responceData["error"] = true;
    } finally {
      let responseObject = {
        error: responceData.error,
      };
      if (responceData.error) responseObject.err = responceData.err;
      return responseObject;
    }
  }

  async addAdmin() {
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    const username = sampleData.username;
    const email = sampleData.email;
    const firstName = sampleData.firstName;
    const lastName = sampleData.lastName;
    const phoneNo = sampleData.phoneNo;
    const dateOfBirth = sampleData.dateOfBirth;
    const password = sampleData.password;
    const accessLevel = sampleData.accessLevel;
    const responseObject = {
      error: false,
    };
    try {
      var salt = crypto.randomBytes(16);
      const hashedPassword = crypto.pbkdf2Sync(
        password,
        salt,
        310000,
        32,
        "sha256"
      );
      const query = `INSERT INTO agent
              (username, email, first_name, last_name, phone_no, DOB, hashed_password, salt, access_level)
              VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const queryData = [
        username,
        email,
        firstName,
        lastName,
        phoneNo,
        dateOfBirth,
        hashedPassword,
        salt,
        accessLevel,
      ];
      const data = await db.runQuery(query, queryData);
      // res.json({ data: data.response, err: data.err, error: data.error });
      responceData.data.push(data.responce);
      responceData.err.push(data.err);
      // console.log(data.err);
      if (data.error) {
        console.log(data.err);
        responseObject.error = true;
        responseObject.err = data.err;
      }
    } catch (err) {
      responseObject.error = true;
      responseObject.err = err?.message;
      console.log(err);
    } finally {
      return responseObject;
    }
  }

  async addSampleData() {
    const states = sampleData.states;
    const zones = sampleData.zones;
    const classTypes = sampleData.classTypes;
    const trainTypes = sampleData.trainTypes;
    const trains = sampleData.trains;
    const stations = stationsData.stations;
    const trainTimetable = trainTimetableData.trainTimetable;
    const responseObject = {
      err: [],
      error: false,
    };
    //* Inserting States
    for (const state of states) {
      try {
        const query = `INSERT INTO states (state_name) VALUES ( ? )`;
        const queryData = [state.stateName];
        const data = await db.runQuery(query, queryData);
        // console.log(data);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }
    //* Inserting Zones
    for (const zone of zones) {
      try {
        const query = `INSERT INTO zones (zone_name, zone_code) VALUES ( ?, ? )`;
        const queryData = [zone.zoneName, zone.zoneCode];
        const data = await db.runQuery(query, queryData);
        // console.log(data);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }

    for (const station of stations) {
      try {
        const query = `INSERT INTO stations (station_code, station_name, state_id, zone_id) 
        VALUES ( ?, ?, 
          (SELECT state_id FROM states WHERE state_name = ? ), 
          (SELECT zone_id FROM zones WHERE zone_code = ? ) )`;
        const queryData = [
          station.code,
          station.name,
          station.state,
          station.zone,
        ];
        const data = await db.runQuery(query, queryData);
        // console.log(data);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }
    //* Inserting  class type
    for (const classType of classTypes) {
      try {
        const query = `INSERT INTO class_types (class_type_name, class_type_code)
          VALUES ( ?, ?)`;
        const queryData = [classType.classTypeName, classType.classTypeCode];
        const data = await db.runQuery(query, queryData);
        // console.log(data);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }
    //* Inserting train type
    for (const trainType of trainTypes) {
      try {
        const query = `INSERT INTO train_types (train_type_name, train_type_code)
          VALUES ( ?, ?)`;
        const queryData = [trainType.trainTypeName, trainType.trainTypeCode];
        const data = await db.runQuery(query, queryData);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }
    //* Inserting trains
    for (const train of trains) {
      try {
        const query = `INSERT INTO trains (train_no, return_train_no, train_name, 
          sunday, monday, tuesday, wednesday, thursday, friday, saturday, train_type_id)
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
          (SELECT train_type_id FROM train_types WHERE train_type_code = ? ) )`;
        const queryData = [
          train["train-no"],
          train["return-train-no"],
          train["train-name"],
          ...train["running-days"],
          train["train-type-code"],
        ];
        const data = await db.runQuery(query, queryData);
        if (data.error) {
          console.log(data.err);
          responseObject.error = true;
          responseObject.err.push(data.err);
        }
        for (const classType of train.classes) {
          const query2 = `INSERT INTO train_has_class (train_id, class_type_id) VALUES
          ( (SELECT train_id FROM trains WHERE train_no = ?), 
          (SELECT class_type_id FROM class_types WHERE class_type_code = ?) )`;
          const queryData2 = [train["train-no"], classType];
          const data2 = await db.runQuery(query2, queryData2);
          if (data2.error) {
            console.log(data2.err);
            responseObject.error = true;
            responseObject.err.push(data2.err);
          }
        }
      } catch (err) {
        responseObject.error = true;
        responseObject.err.push(err?.message);
        console.log(err);
      }
    }
    //* Inserting train timetable
    for (const tt of trainTimetable) {
      const trainNumber = tt["train-no"];
      for (let j = 0, l = tt["sr-no"].length; j < l; j++) {
        try {
          let srNo = tt["sr-no"][j];
          let stationCode = tt["station-code"][j];
          let arrivalTime = tt["arrival-time"][j]
            ? tt["arrival-time"][j]
            : null;
          let departureTime = tt["departure-time"][j]
            ? tt["departure-time"][j]
            : null;
          let haltTime;
          if (arrivalTime && departureTime) {
            haltTime = utilityModule.timeDifference(arrivalTime, departureTime);
          } else {
            haltTime = null;
          }
          // let haltTime = tt["halt-time"][j] ? tt["halt-time"][j] : null;
          let platform = null;
          if (isNaN(parseInt(tt["platform"][j]))) platform = null;
          else platform = parseInt(tt["platform"][j]);
          let dayNo = parseInt(tt["day-number"][j]);
          let distance = parseFloat(tt["distance-traveled"][j]);
          let query = `INSERT INTO train_timetable (sr_no, train_id, station_id,
           arrival_time, departure_time, day, distance_traveled, platform, halt_time )
           VALUES ( ?,
             (SELECT train_id FROM trains WHERE train_no = ?),
             (SELECT station_id FROM stations WHERE station_code = ?),
             ?, ?, ?, ?, ?, ?)`;
          let queryData = [
            srNo,
            trainNumber,
            stationCode,
            arrivalTime,
            departureTime,
            dayNo,
            distance,
            platform,
            haltTime,
          ];
          let data = await db.runQuery(query, queryData);
          if (data.error) {
            console.log(data.err);
            responseObject.error = true;
            responseObject.err.push(data.err);
          }
        } catch (err) {
          responseObject.error = true;
          responseObject.err.push(err?.message);
          console.log(err);
        }
      }
    }
    return responseObject;
  }
}

module.exports = getStartedService;
