const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentClassTypeService {
  static getClassInstance() {
    return instance ? instance : new agentClassTypeService();
  }

  async getAllClassType(req, res) {
    try {
      const query = "SELECT * from class_types";
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }

  async getClassType(req, res) {
    const classType = req.params.classType;
    console.log(classType);
    try {
      // ! Old Query
      // const query = `SELECT station_id, station_name,station_code, state.state_name, zone.zone_name, zone.zone_code from stations
      //   LEFT JOIN state ON state.state_id = stations.state_id
      //   LEFT JOIN zone ON zone.zone_id = stations.zone_id
      //   where ( LOWER(station_name) like LOWER('%${station}%') OR LOWER(station_code) like LOWER('%${station}%'));`;

      const query = `SELECT * from class_types WHERE LOWER(class_type_name) like LOWER('%${classType}%') OR
      LOWER(class_type_code) like LOWER('%${classType}%')`;
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      // console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }

  async postClassType(req, res) {
    console.log("Post req made to agent ClassType input");
    let data = req.body;
    console.log(data);

    let classTypeNameData = data["classtype-name-input-value"];
    let classTypeCodeData = data["classtype-code-input-value"];
    if (typeof classTypeNameData == "string") {
      classTypeNameData = [];
      classTypeNameData.push(data["classtype-name-input-value"]);
    }
    if (typeof classTypeCodeData == "string") {
      classTypeCodeData = [];
      classTypeCodeData.push(data["classtype-code-input-value"]);
    }

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      for (let i = 0, l = classTypeNameData.length; i < l; i++) {
        let classTypeName = classTypeNameData[i];
        let classTypeCode = classTypeCodeData[i];
        if (!classTypeName) {
          console.log("Class Type Name is Null");
          continue;
        }
        if (!classTypeCode) {
          console.log("Class Type Code is Null");
          continue;
        }
        classTypeName = classTypeName.replace(/  +/g, " ").trim();
        classTypeCode = classTypeCode.replace(/  +/g, " ").trim();

        const query = `INSERT INTO class_types (class_type_name, class_type_code) VALUES (?, ?)`;

        const queryData = [classTypeName, classTypeCode];
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

  async patchClassType(req, res) {
    let { classTypeID, newClassTypeName, newClassTypeCode } = req.body;

    newClassTypeName = newClassTypeName.replace(/  +/g, " ").trim();
    newClassTypeCode = newClassTypeCode.replace(/  +/g, " ").trim();

    classTypeID = parseInt(classTypeID, 10);

    console.log(req.body);

    try {
      const query = `UPDATE class_types SET class_type_name = ?,
        class_type_code = ?
        WHERE class_type_id  = ?`;
      const queryData = [newClassTypeName, newClassTypeCode, classTypeID];

      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async deleteClassType(req, res) {
    let classTypeID = req.params.classTypeID;
    classTypeID = parseInt(classTypeID, 10);

    try {
      const query = "DELETE FROM class_types WHERE class_type_id  = ?";
      const queryData = [classTypeID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
}

module.exports = agentClassTypeService;
