// ================     State Related   ===================
const agentStateModule = require("../modules/agent/state");
const agentState = agentStateModule.getClassInstance();

exports.agentAllState = (req, res) => {
  agentState.getAllState(req, res);
};
exports.agentStateSearch = (req, res) => {
  agentState.getState(req, res);
};
exports.agentStateInputPost = (req, res) => {
  agentState.postState(req, res);
};
exports.agentStateUpdate = (req, res) => {
  agentState.patchState(req, res);
};
exports.agentStateDelete = (req, res) => {
  agentState.deleteState(req, res);
};

// =========================================================

// ================     Zone Related      ==================
const agentZoneModule = require("../modules/agent/zone");
const agentZone = agentZoneModule.getClassInstance();

exports.getAllZone = (req, res) => {
  agentZone.getAllZone(req, res);
};
exports.postZone = (req, res) => {
  agentZone.postZone(req, res);
};
exports.getZone = (req, res) => {
  agentZone.getZone(req, res);
};
exports.patchZone = (req, res) => {
  agentZone.patchZone(req, res);
};
exports.deleteZone = (req, res) => {
  agentZone.deleteZone(req, res);
};

// =========================================================

// ================     Train Type Related      ==================
const agentTrainTypeModule = require("../modules/agent/trainType");
const agentTrainType = agentTrainTypeModule.getClassInstance();

exports.getAllTrainType = (req, res) => {
  agentTrainType.getAllTrainType(req, res);
};
exports.getTrainType = (req, res) => {
  agentTrainType.getTrainType(req, res);
};
exports.postTrainType = (req, res) => {
  agentTrainType.postTrainType(req, res);
};
exports.patchTrainType = (req, res) => {
  agentTrainType.patchTrainType(req, res);
};
exports.deleteTrainType = (req, res) => {
  agentTrainType.deleteTrainType(req, res);
};

// =========================================================

// ================     Station Related      ==================
const agentStationModule = require("../modules/agent/station");
const agentStation = agentStationModule.getClassInstance();

exports.getAllStation = (req, res) => {
  agentStation.getAllStation(req, res);
};
exports.getStation = (req, res) => {
  agentStation.getStation(req, res);
};
exports.postStation = (req, res) => {
  agentStation.postStation(req, res);
};
exports.patchStation = (req, res) => {
  agentStation.patchStation(req, res);
};
exports.deleteStation = (req, res) => {
  agentStation.deleteStation(req, res);
};

// =========================================================

// ================     Class Type Related      ==================
const agentClassTypeModule = require("../modules/agent/classType");
const agentClassType = agentClassTypeModule.getClassInstance();

exports.getAllClassType = (req, res) => {
  agentClassType.getAllClassType(req, res);
};
exports.getClassType = (req, res) => {
  agentClassType.getClassType(req, res);
};
exports.postClassType = (req, res) => {
  agentClassType.postClassType(req, res);
};
exports.patchClassType = (req, res) => {
  agentClassType.patchClassType(req, res);
};
exports.deleteClassType = (req, res) => {
  agentClassType.deleteClassType(req, res);
};

// =========================================================

// ================     Train Related      ==================
const agentTrainModule = require("../modules/agent/train");
const agentTrain = agentTrainModule.getClassInstance();

exports.getAllTrain = (req, res) => {
  agentTrain.getAllTrain(req, res);
};
exports.getTrain = (req, res) => {
  agentTrain.getTrain(req, res);
};
exports.postTrain = (req, res) => {
  agentTrain.postTrain(req, res);
};
exports.patchTrain = (req, res) => {
  agentTrain.patchTrain(req, res);
};
exports.deleteTrain = (req, res) => {
  agentTrain.deleteTrain(req, res);
};

// =========================================================

// ================     Train TImetable Related      ==================
const agentTrainTimetableModule = require("../modules/agent/trainTimetable");
const agentTrainTimetable = agentTrainTimetableModule.getClassInstance();

exports.getTrainTimetable = (req, res) => {
  agentTrainTimetable.getTrainTimetable(req, res);
};
exports.postTrainTimetable = (req, res) => {
  agentTrainTimetable.postTrainTimetable(req, res);
};

// =========================================================

// ================     SignUp Request Related      ==================
const agentSignupRequestTableModule = require("../modules/agent/signupRequestTable");
const agentSignupRequestTable =
  agentSignupRequestTableModule.getClassInstance();

exports.getSignupRequestTable = (req, res) => {
  agentSignupRequestTable.getSignupRequestTable(req, res);
};
exports.searchSignupRequestTable = (req, res) => {
  agentSignupRequestTable.searchSignupRequestTable(req, res);
};
exports.postSignupRequestApprove = (req, res) => {
  agentSignupRequestTable.postSignupRequestApprove(req, res);
};
exports.postSignupRequestReject = (req, res) => {
  agentSignupRequestTable.postSignupRequestReject(req, res);
};

// =========================================================
// Express Validator
const { check, validationResult } = require("express-validator");
const { body } = require("express-validator");
var crypto = require("crypto");
const dbService = require("../services/dbService");
const db = dbService.getDbServiceInstance();

exports.postDetailsUpdate = [
  check("first-name")
    .isLength({ min: 1 })
    .withMessage("First Name should be specified")
    .isString()
    .withMessage("First name must be alphanumeric"),
  check("last-name")
    .isLength({ min: 0 })
    .withMessage("Last Name should be specified")
    .isString()
    .withMessage("Last name must be alphanumeric"),
  check("username")
    .isLength({ min: 4 })
    .withMessage("Username Should Be grater than zero")
    .isAlphanumeric()
    .withMessage("Invalid Username"),

  body("*").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
      // console.log(requestDatetime);
      return;
    } else {
      // console.log(req.local.user);
      const agentEmail = req?.user?.email;
      // res.json(req.body);
      const username = req.body.username;
      const firstName = req.body["first-name"];
      const lastName = req.body["last-name"];
      const phoneNo = req.body["phone-number"];
      const dateOfBirth = req.body["date-of-birth"];

      try {
        const query = `UPDATE agent SET
              username = ?, first_name = ?, last_name = ?, phone_no = ?, DOB = ?
              WHERE email = ?`;
        const queryData = [
          username,
          firstName,
          lastName,
          phoneNo,
          dateOfBirth,
          agentEmail,
        ];
        const data = await db.runQuery(query, queryData);
        if (data.error) res.redirect("/agent");
        else res.redirect("/agent");
      } catch (err) {
        console.log(err);
      }
    }
  },
];
exports.postChangePassword = [
  check("new-password")
    .isLength({ min: 6 })
    .withMessage("Password length should be grater than 6"),
  check("retype-new-password")
    .custom((value, { req }) => value === req.body["new-password"])
    .withMessage("Password Do not match"),

  body("*").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
      // console.log(requestDatetime);
      return;
    } else {
      const agentEmail = req?.user?.email;
      const currentPassword = req.body["current-password"];
      const password = req.body["new-password"];

      const query = `SELECT hashed_password, salt FROM agent
      WHERE email = ?`;
      const queryData = [agentEmail];
      const data = await db.runQuery(query, queryData);
      // console.log("============================================");
      // console.log(data.response);

      try {
        crypto.pbkdf2(
          currentPassword,
          data.response[0].salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return;
            }
            if (
              !crypto.timingSafeEqual(
                data.response[0].hashed_password,
                hashedPassword
              )
            ) {
              console.log("Incorrect password");
              res.send("Wrong Password");
              return;
            }
          }
        );
      } catch (e) {
        return;
      }

      var salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return next(err);
          }

          try {
            const query = `UPDATE agent SET
              hashed_password = ?, salt = ?
              WHERE email = ?`;
            const queryData = [hashedPassword, salt, agentEmail];
            const data = await db.runQuery(query, queryData);
            if (data.error) res.redirect("/agent");
            else res.redirect("/agent");
          } catch (err) {
            // res.json({ data: {}, err: err.message, error: true });
            console.log(err);
          }
        }
      );
    }
  },
];
