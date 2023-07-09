const dbService = require("../../services/dbService");
const db = dbService.getDbServiceInstance();
const utilityModule = require("../../modules/utilities");

let instance = null;

class signupRequestTableService {
  static getClassInstance() {
    return instance ? instance : new signupRequestTableService();
  }

  async getSignupRequestTable(req, res) {
    const requestType = req.params.requestType;
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = `SELECT R.request_agent_signup_id ,R.email, R.username, R.first_name, R.last_name, R.phone_no, DATE_FORMAT(R.DOB, "%d %M %Y") AS DOB, R.request_datetime,
       R.response_datetime, R.response_status, R.username, A.email AS agent_email FROM request_agent_signup R
       LEFT JOIN agent A ON A.agent_id = R.response_agent_id
       WHERE R.response_status = ?`;
      const queryData = [requestType];
      const data = await db.runQuery(query, queryData);
      responceData["data"] = data.response;
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
  async searchSignupRequestTable(req, res) {
    const email = req.params.email;
    // console.log(req.params);
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = `SELECT R.request_agent_signup_id ,R.username,R.email , R.first_name, R.last_name, R.phone_no, DATE_FORMAT(R.DOB, "%d %M %Y") AS DOB, R.request_datetime,
       R.response_datetime, R.response_status, R.username, A.email AS agent_email FROM request_agent_signup R
       LEFT JOIN agent A ON A.agent_id = R.response_agent_id
       WHERE R.email LIKE '%${email}%';`;
      const queryData = [];
      const data = await db.runQuery(query, queryData);
      responceData["data"] = data.response;
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
  async postSignupRequestApprove(req, res) {
    const requestAgentSignupId = req.params.requestAgentSignupId;
    const agentEmail = req.user.email;
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = `INSERT INTO agent (email, username, first_name, last_name, phone_no, DOB, 
       hashed_password, salt)
       SELECT R.email, R.username, R.first_name, R.last_name, R.phone_no, R.DOB, R.hashed_password, R.salt
       FROM request_agent_signup R
       WHERE R.request_agent_signup_id = ?`;
      const queryData = [requestAgentSignupId];
      await db.runQuery(query, queryData);

      const query2 = `UPDATE request_agent_signup SET response_status = 'approved', 
      response_datetime = CURRENT_TIMESTAMP,
      response_agent_id = (SELECT agent_id FROM agent WHERE email = ?)
      WHERE request_agent_signup_id = ?`;
      const queryData2 = [agentEmail, requestAgentSignupId];
      const query3 = `UPDATE agent SET access_level = 1 
        WHERE email = (SELECT email FROM request_agent_signup
          WHERE request_agent_signup_id = ?)`;
      const queryData3 = [requestAgentSignupId];

      await Promise.all([
        await db.runQuery(query2, queryData2),
        await db.runQuery(query3, queryData3),
      ]);

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
  async postSignupRequestReject(req, res) {
    const requestAgentSignupId = req.params.requestAgentSignupId;
    const agentEmail = req.user.email;
    const responceData = {
      data: [],
      err: [],
      error: false,
    };

    try {
      const query = `UPDATE request_agent_signup SET response_status = 'rejected', 
      response_datetime = CURRENT_TIMESTAMP ,
      response_agent_id = (SELECT agent_id FROM agent WHERE email = ?)
      WHERE request_agent_signup_id = ?`;
      const queryData = [agentEmail, requestAgentSignupId];

      await db.runQuery(query, queryData);
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
}

module.exports = signupRequestTableService;
