var express = require("express");
var router = express.Router();

const agentController = require("../controllers/agentController");
const agentPagesController = require("../controllers/agentPagesController");

// Agent Home Page
router.get(
  "/",
  agentPagesController.checkAuthenticated,
  agentPagesController.agentHomePage
);
router.get("/*", agentPagesController.checkAuthenticated);

// Agent Pages Route
router.get("/state-search-add-edit", agentPagesController.state);
router.get("/zone-search-add-edit", agentPagesController.zone);
router.get("/traintype-search-add-edit", agentPagesController.trainType);
router.get("/classType-search-add-edit", agentPagesController.classType);
router.get("/station-search-add-edit", agentPagesController.station);
router.get("/train-add", agentPagesController.trainAdd);
router.get("/train-search-edit", agentPagesController.trainSearch);
router.get("/train-timetable-input", agentPagesController.trainTimetable);
router.get(
  "/signup-request-table",
  agentPagesController.agentRequestSignUpTable
);

// State Routes
router.get("/state/all/JSON", agentController.agentAllState);
router.get("/state/:stateName", agentController.agentStateSearch);
router.post("/state-input", agentController.agentStateInputPost);
router.patch("/state/update", agentController.agentStateUpdate);
router.delete("/state/delete/:stateID", agentController.agentStateDelete);

// Zone Routes
router.get("/zone/all/JSON", agentController.getAllZone);
router.post("/zone-input", agentController.postZone);
router.get("/zone/:zone", agentController.getZone);
router.patch("/zone/update", agentController.patchZone);
router.delete("/zone/delete/:zoneID", agentController.deleteZone);

// Train Type Route
router.get("/traintype/all/JSON", agentController.getAllTrainType);
router.get("/traintype/:trainType", agentController.getTrainType);
router.post("/traintype-input", agentController.postTrainType);
router.patch("/traintype/update", agentController.patchTrainType);
router.delete(
  "/traintype/delete/:trainTypeID",
  agentController.deleteTrainType
);

// Staion route
router.get("/station/all/JSON", agentController.getAllStation);
router.get("/station/:station", agentController.getStation);
router.post("/station-input", agentController.postStation);
router.patch("/station/update", agentController.patchStation);
router.delete("/station/delete/:stationID", agentController.deleteStation);

// Class Type Route
router.get("/classtype/all/JSON", agentController.getAllClassType);
router.get("/classtype/:classType", agentController.getClassType);
router.post("/classtype-input", agentController.postClassType);
router.patch("/classtype/update", agentController.patchClassType);
router.delete(
  "/classtype/delete/:classTypeID",
  agentController.deleteClassType
);

// Train Route
router.get("/train/all/JSON", agentController.getAllTrain);
router.get("/train/:searchTerm", agentController.getTrain);
router.post("/train-add", agentController.postTrain);
router.post("/train/update", agentController.patchTrain);
router.delete("/train/delete/:trainID", agentController.deleteTrain);

// Train Timtable Post
router.get("/train-timetable/:trainID", agentController.getTrainTimetable);
router.post("/train-timetable/update", agentController.postTrainTimetable);

// Agent Request Table
router.get(
  "/signup-request-json/search/:email",
  agentController.searchSignupRequestTable
);
router.get(
  "/signup-request-json/:requestType",
  agentController.getSignupRequestTable
);
router.post(
  "/signup-request-json/approve/:requestAgentSignupId",
  agentController.postSignupRequestApprove
);
router.post(
  "/signup-request-json/reject/:requestAgentSignupId",
  agentController.postSignupRequestReject
);

// Agent Details Update
router.post("/update-details", agentController.postDetailsUpdate);
router.post("/change-password", agentController.postChangePassword);
module.exports = router;
