const databaseController = require("../controllers/databaseController");

let connection = databaseController.connection;
let instance = null;

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async runQuery(query, queryData) {
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, queryData, (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      // console.log(response);
      return { response: response, err: "", error: false };
    } catch (error) {
      // console.log(error.message);
      // console.log("Query : " + query + " , Query Data : " + queryData);
      return { response: {}, err: error.message, error: true };
    }
  }
}

module.exports = DbService;
