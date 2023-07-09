var express = require("express");
var router = express.Router();
const getStartedService = require("../GetStarted/getStartedService");
const getStarted = getStartedService.getClassInstance();

router.get("/", async function (req, res, next) {
  // res.send("respond with a resource");
  const responseObject = { error: false, err: [] };
  let responceObject1 = await getStarted.createTables();
  if (responceObject1.error) {
    responseObject.error = true;
    responseObject.err.push(responceObject1);
  }
  let responceObject2 = await getStarted.addAdmin();
  if (responceObject2.error) {
    responseObject.error = true;
    responseObject.err.push(responceObject2);
  }
  let responceObject3 = await getStarted.addSampleData();
  if (responceObject3?.error) {
    responseObject.error = true;
    responseObject.err.push(responceObject3);
  }
  res.json(responseObject);
});

module.exports = router;
