const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentTrainService {
  static getClassInstance() {
    return instance ? instance : new agentTrainService();
  }

  async getAllTrain(req, res) {
    const responceData = {
      data: [],
      err: [],
      classes: [],
      error: false,
    };

    try {
      // Getting ALl train Data
      const query1 = `SELECT train_id, train_no, return_train_no, train_name, sunday, 
        monday, tuesday, wednesday, thursday, friday, saturday, train_types.train_type_name AS train_type_name
        FROM trains LEFT JOIN train_types
        ON train_types.train_type_id = trains.train_type_id`;
      const queryData1 = [];
      const data = await db.runQuery(query1, queryData1);
      if (data.error == true) responceData.error = true;

      responceData["data"].push(data.response);
      responceData["err"].push(data.err);

      const data1 = data.response;
      for (let index = 0, l = data1.length; index < l; index++) {
        let trainIDClassObject = {};
        trainIDClassObject.trainID = data1[index].train_id;

        const trainID = parseInt(trainIDClassObject.trainID);

        // Getting trains has class data
        const query2 = `SELECT class_types.class_type_code FROM class_types 
          INNER JOIN (SELECT class_type_id from train_has_class where train_id = ?) AS temp
           ON class_types.class_type_id = temp.class_type_id`;
        const queryData2 = [trainID];
        const data2 = await db.runQuery(query2, queryData2);
        console.log(data2.response);

        const classTypeIDArray = [];
        data2.response.forEach((element) => {
          classTypeIDArray.push(element.class_type_code);
        });
        console.log(classTypeIDArray);

        trainIDClassObject.classesID = classTypeIDArray;
        responceData["classes"].push(trainIDClassObject);
        responceData["err"].push(data2.err);
        if (data2.error == true) responceData.error = true;
      }
    } catch (err) {
      console.log(err);
      responceData["err"].push(err.message);
      responceData["error"] = true;
    } finally {
      console.log(responceData.data);
      console.log(responceData.classes);
      res.json({
        data: responceData.data,
        err: responceData.err,
        classes: responceData.classes,
        error: responceData.error,
      });
    }
  }

  async getTrain(req, res) {
    const searchTerm = req.params.searchTerm;

    const responceData = {
      data: [],
      err: [],
      classes: [],
      error: false,
    };
    try {
      const query1 = `SELECT train_id, train_no, return_train_no, train_name, sunday,
        monday, tuesday, wednesday, thursday, friday, saturday, train_types.train_type_name AS train_type_name
        FROM trains INNER JOIN train_types
        ON train_types.train_type_id = trains.train_type_id
        WHERE train_no LIKE '%${searchTerm}%' OR return_train_no LIKE '%${searchTerm}%' OR train_name LIKE '%${searchTerm}%';`;

      const queryData1 = [];
      const data = await db.runQuery(query1, queryData1);
      if (data.error == true) responceData.error = true;

      responceData["data"].push(data.response);
      responceData["err"].push(data.err);

      console.log(data);
      const data1 = data.response;
      for (let index = 0, l = data1.length; index < l; index++) {
        let trainIDClassObject = {};
        trainIDClassObject.trainID = data1[index].train_id;

        const trainID = parseInt(trainIDClassObject.trainID);

        // Getting trains has class data
        const query2 = `SELECT class_types.class_type_code FROM class_types 
          INNER JOIN (SELECT class_type_id from train_has_class where train_id = ?) AS temp
           ON class_types.class_type_id = temp.class_type_id`;
        const queryData2 = [trainID];
        const data2 = await db.runQuery(query2, queryData2);
        console.log(data2.response);

        const classTypeIDArray = [];
        data2.response.forEach((element) => {
          classTypeIDArray.push(element.class_type_code);
        });
        console.log(classTypeIDArray);

        trainIDClassObject.classesID = classTypeIDArray;
        responceData["classes"].push(trainIDClassObject);
        responceData["err"].push(data2.err);
        if (data2.error == true) responceData.error = true;
      }
    } catch (err) {
      console.log(err);
      responceData["err"].push(err.message);
      responceData["error"] = true;
    } finally {
      res.json({
        data: responceData.data,
        err: responceData.err,
        classes: responceData.classes,
        error: responceData.error,
      });
    }
  }

  async postTrain(req, res) {
    console.log("Post req to trains");
    let data = req.body;
    console.log(data);

    let trainNumber = data["train-number"]
      ? parseInt(data["train-number"], 10)
      : "NULL";
    let returnTrainNumber = data["return-train-number"]
      ? parseInt(data["return-train-number"], 10)
      : "NULL";
    let trainName = data["train-name"]
      ? data["train-name"].toString()
      : "No Name";
    trainName = trainName.replace(/  +/g, " ").trim();

    let day = data.day ? data.day : 0;
    let dayInWeek = [0, 0, 0, 0, 0, 0, 0];
    if (typeof day != "number") {
      day.forEach((d) => {
        dayInWeek[parseInt(d, 10) - 1] = 1;
      });
    }
    let trainTypeID = data["train-type"]
      ? parseInt(data["train-type"], 10)
      : "NULL";
    let trainData = new Array(
      trainNumber,
      returnTrainNumber,
      trainName,
      ...dayInWeek,
      trainTypeID
    );
    let returnTrainEntry = data["return-train-entry"] ? 1 : 0;

    console.log(trainData);
    let trainClassTypes = data["class-type-name"];
    console.log(trainClassTypes);

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      let query = `INSERT INTO trains (train_no, return_train_no, train_name, 
            sunday, monday, tuesday, wednesday, thursday, friday, saturday, 
            train_type_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      let queryData = [...trainData];
      if (returnTrainEntry) {
        query = `INSERT INTO trains (train_no, return_train_no, train_name, 
            sunday, monday, tuesday, wednesday, thursday, friday, saturday, 
            train_type_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            INSERT INTO trains (return_train_no, train_no, train_name, 
            sunday, monday, tuesday, wednesday, thursday, friday, saturday,  
            train_type_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        queryData = [...trainData, ...trainData];
      }
      const data = await db.runQuery(query, queryData);

      responceData["data"].push(data.response);
      responceData["err"].push(data.err);
      if (data.error == true) responceData.error = true;

      for (let index = 0, l = trainClassTypes.length; index < l; index++) {
        const trainClassTypeID = parseInt(trainClassTypes[index], 10);

        let queryData2 = [trainNumber, trainClassTypeID];
        let query2 = `INSERT INTO train_has_class (train_id , class_type_id) 
            VALUES ((SELECT train_id from trains WHERE train_no = ?), ?);`;

        if (returnTrainEntry) {
          query2 = `INSERT INTO train_has_class (train_id , class_type_id) 
            VALUES ((SELECT train_id from trains WHERE train_no = ?), ?);
            INSERT INTO train_has_class (train_id , class_type_id) 
            VALUES ((SELECT train_id from trains WHERE train_no = ?), ?);`;
          queryData2 = [...queryData2, returnTrainNumber, trainClassTypeID];
        }
        await db.runQuery(query2, queryData2);
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

  async patchTrain(req, res) {
    console.log("Post req to Train Update");
    let data = req.body;
    console.log(data);

    let trainID = parseInt(data["train-id"]);
    let trainNumber = data["new-train-number"]
      ? parseInt(data["new-train-number"], 10)
      : "NULL";
    let returnTrainNumber = data["new-return-train-number"]
      ? parseInt(data["new-return-train-number"], 10)
      : "NULL";
    let trainName = data["new-train-name"]
      ? data["new-train-name"].toString()
      : "No Name";
    trainName = trainName.replace(/  +/g, " ").trim();

    let day = data.day ? data.day : 0;
    // let monday, tuesday, wednesday, thursday, friday, saturday, sunday;
    // monday = tuesday = wednesday = thursday = friday = saturday = sunday = 0;
    let dayInWeek = [0, 0, 0, 0, 0, 0, 0];
    if (typeof day != "number") {
      day.forEach((d) => {
        dayInWeek[parseInt(d, 10) - 1] = 1;
      });
    }
    let trainTypeID = data["train-type"]
      ? parseInt(data["train-type"], 10)
      : "NULL";
    let trainData = new Array(
      trainNumber,
      returnTrainNumber,
      trainName,
      ...dayInWeek,
      trainTypeID,
      trainID
    );
    // let returnTrainEntry = data["return-train-entry"] ? 1 : 0;

    console.log(trainData);
    let trainClassTypes = data["class-type-name"];
    console.log(trainClassTypes);
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query1 = `UPDATE trains SET train_no = ?, return_train_no = ?, train_name = ?,
              sunday = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ?,  
              train_type_id = ? WHERE train_id = ? `;

      const queryData1 = trainData;
      const data = await db.runQuery(query1, queryData1);

      responceData["data"].push(data.response);
      responceData["err"].push(data.err);
      if (data.error == true) responceData.error = true;

      const query2 = `DELETE FROM train_has_class WHERE train_id = ?`;
      const queryData2 = [trainID];
      await db.runQuery(query2, queryData2);

      for (let index = 0, l = trainClassTypes.length; index < l; index++) {
        const trainClassTypeID = parseInt(trainClassTypes[index], 10);

        const queryData3 = [trainID, trainClassTypeID];
        const query3 = `INSERT INTO train_has_class  (train_id, class_type_id) 
        VALUES ( ?, ? );`;
        await db.runQuery(query3, queryData3);
      }
    } catch (err) {
      responceData["err"].push(err.message);
      responceData["error"] = true;
      console.log(err);
    } finally {
      res.json({
        data: responceData.data,
        err: responceData.err,
        error: responceData.error,
      });
    }
  }

  async deleteTrain(req, res) {
    let trainID = req.params.trainID;
    trainID = parseInt(trainID, 10);

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = "DELETE FROM trains WHERE train_id  = ?";
      const queryData = [trainID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      const query2 = `DELETE FROM train_has_class WHERE train_id = ?`;
      const queryData2 = [trainID];
      await db.runQuery(query2, queryData2);
    } catch (err) {
      responceData["err"].push(err.message);
      responceData["error"] = true;
      console.log(err);
    } finally {
      res.json({
        data: responceData.data,
        err: responceData.err,
        error: responceData.error,
      });
    }
  }
}

module.exports = agentTrainService;
