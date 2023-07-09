const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentTrainTypeService {
  static getClassInstance() {
    return instance ? instance : new agentTrainTypeService();
  }

  async getAllTrainType(req, res) {
    try {
      const query = "SELECT * from train_types";
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }

  async getTrainType(req, res) {
    const trainType = req.params.trainType;

    try {
      const query = `SELECT * from train_types where ( LOWER(train_type_name) like LOWER('%${trainType}%') OR LOWER(train_type_code) like LOWER('%${trainType}%'))`;

      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async postTrainType(req, res) {
    console.log("Post req made to agent TrainType input");
    let data = req.body;
    console.log(data);

    let trainTypeNameData = data["traintype-name-input-value"];
    let trainTypeCodeData = data["traintype-code-input-value"];
    if (typeof trainTypeNameData == "string") {
      trainTypeNameData = [];
      trainTypeNameData.push(data["traintype-name-input-value"]);
    }
    if (typeof trainTypeCodeData == "string") {
      trainTypeCodeData = [];
      trainTypeCodeData.push(data["traintype-name-input-value"]);
    }

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      for (let i = 0, l = trainTypeNameData.length; i < l; i++) {
        let trainTypeName = trainTypeNameData[i];
        let trainTypeCode = trainTypeCodeData[i];
        if (!trainTypeName) {
          console.log("Train Type Name is Null");
          continue;
        }
        if (!trainTypeCode) {
          console.log("Train Type Code is Null");
          continue;
        }
        trainTypeName = trainTypeName.replace(/  +/g, " ").trim();
        trainTypeCode = trainTypeCode.replace(/  +/g, " ").trim();

        const query = `INSERT INTO train_types (train_type_name, train_type_code) VALUES (?, ?)`;

        const queryData = [trainTypeName, trainTypeCode];
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

  async patchTrainType(req, res) {
    let { trainTypeID, newTrainTypeName, newTrainTypeCode } = req.body;
    trainTypeID = parseInt(trainTypeID, 10);
    newTrainTypeName = newTrainTypeName.replace(/  +/g, " ").trim();
    newTrainTypeCode = newTrainTypeCode.replace(/  +/g, " ").trim();

    try {
      const query = `UPDATE train_types SET train_type_name = ?,
        train_type_code = ? 
        WHERE train_type_id  = ?`;

      const queryData = [newTrainTypeName, newTrainTypeCode, trainTypeID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async deleteTrainType(req, res) {
    let trainTypeID = req.params.trainTypeID;
    trainTypeID = parseInt(trainTypeID, 10);

    try {
      const query = "DELETE FROM train_types WHERE train_type_id  = ?";
      const queryData = [trainTypeID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
}

module.exports = agentTrainTypeService;
