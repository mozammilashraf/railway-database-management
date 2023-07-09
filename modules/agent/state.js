const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();

let instance = null;

class agentStateService {
  static getClassInstance() {
    return instance ? instance : new agentStateService();
  }
  async postState(req, res) {
    console.log("Post req made to agent states input");
    let data = req.body;
    console.log(data);

    let dataList = data["state-input-value"];
    if (typeof dataList == "string") {
      dataList = [];
      dataList.push(data["state-input-value"]);
    }

    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      for (let i = 0, l = dataList.length; i < l; i++) {
        let stateName = dataList[i];
        if (!stateName) {
          console.log("State Name is Null");
          continue;
        }
        stateName = stateName.replace(/  +/g, " ").trim();

        const query = "INSERT INTO states (state_name) VALUES (? )";
        const queryData = [stateName];
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

  async getAllState(req, res) {
    try {
      const query = "SELECT * from states";
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async getState(req, res) {
    const stateName = req.params.stateName?.toLowerCase();

    try {
      const query = `SELECT * from states where LOWER(state_name) like '%${stateName}%' `;
      const queryData = [];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async patchState(req, res) {
    let { stateID, newStateName } = req.body;
    stateID = parseInt(stateID, 10);
    newStateName = newStateName.replace(/  +/g, " ").trim();

    try {
      const query = "UPDATE states SET state_name = ? WHERE state_id  = ?";
      const queryData = [newStateName, stateID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
  async deleteState(req, res) {
    let stateID = req.params.stateID;
    stateID = parseInt(stateID, 10);

    try {
      const query = "DELETE FROM states WHERE state_id  = ?";
      const queryData = [stateID];
      const data = await db.runQuery(query, queryData);

      console.log(data);

      res.json({ data: data.response, err: data.err, error: data.error });
    } catch (err) {
      res.json({ data: {}, err: err.message, error: true });
      console.log(err);
    }
  }
}

module.exports = agentStateService;
