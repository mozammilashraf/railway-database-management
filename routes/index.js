var express = require("express");
var router = express.Router();

// require Controlers
const railwayController = require("../controllers/railwayController");
const frontEndController = require("../controllers/frontEndController");

/* GET home page. */
router.get("/", railwayController.homePage);

// Front End Routes
router.get("/train-search", (req, res) => {
  // res.status(500).send("Server Error");
  res.redirect("/");
});

router.post("/train-search", frontEndController.searchResult);
router.post("/train-search-result", frontEndController.searchTrainBtwStations);
router.get("/classtype/all", frontEndController.allClassType);
router.get("/station/:stationName", frontEndController.getStationData);
router.get(
  "/train-search/traintimetable/:trainNumber",
  frontEndController.trainTimetable
);

router.get("/train-search-result", (req, res) => {
  res.render("train-search-result");
});

router.get("/favicon.ico", (req, res) => {
  res.status(200);
  console.log(
    "-------------" + "/favicon.ico Requested" + "--------------------"
  );
});

module.exports = router;
