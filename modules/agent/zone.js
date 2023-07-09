const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentZoneService {
  static getClassInstance() {
    return instance ? instance : new agentZoneService();
  }

  async getAllZone(req, res) {
    try {
      const query = "SELECT * FROM zones";
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      // console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }

  async getZone(req, res) {
    const zone = req.params.zone;

    try {
      const query = `SELECT * FROM zones WHERE 
        ( LOWER(zone_name) LIKE LOWER('%${zone}%') 
        OR LOWER(zone_code) LIKE LOWER('%${zone}%'))`;
      const queryData = [zone];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async postZone(req, res) {
    console.log("Post req made to agent Zone input");
    let data = req.body;
    console.log(data);

    let zoneNameData = data["zone-name-input-value"];
    let zoneCodeData = data["zone-code-input-value"];
    if (typeof zoneNameData == "string") {
      zoneNameData = [];
      zoneNameData.push(data["zone-name-input-value"]);
    }
    if (typeof zoneCodeData == "string") {
      zoneCodeData = [];
      zoneCodeData.push(data["zone-code-input-value"]);
    }

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      for (let i = 0, l = zoneNameData.length; i < l; i++) {
        let zoneName = zoneNameData[i];
        let zoneCode = zoneCodeData[i];
        if (!zoneName) {
          console.log("Zone Name is Null");
          continue;
        } else if (!zoneCode) {
          console.log("Zone Code is Null");
          continue;
        }
        zoneName = zoneName.replace(/  +/g, " ").trim();
        zoneCode = zoneCode.replace(/  +/g, " ").trim();

        const query = "INSERT INTO zones (zone_name, zone_code) VALUES (?, ?)";
        const queryData = [zoneName, zoneCode];
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

  async patchZone(req, res) {
    let { zoneID, newZoneName, newZoneCode } = req.body;
    zoneID = parseInt(zoneID, 10);
    newZoneName = newZoneName.replace(/  +/g, " ").trim();
    newZoneCode = newZoneCode.replace(/  +/g, " ").trim();

    try {
      const query = `UPDATE zones SET zone_name = ?, zone_code = ? WHERE zone_id  = ?`;
      const queryData = [newZoneName, newZoneCode, zoneID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async deleteZone(req, res) {
    let zoneID = req.params.zoneID;
    zoneID = parseInt(zoneID, 10);

    try {
      const query = "DELETE FROM zones WHERE zone_id  = ?";
      const queryData = [zoneID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
}

module.exports = agentZoneService;
