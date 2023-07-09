const searchTrainService = require("../modules/frontEnd/frontEnd");
const searchTrain = searchTrainService.getClassInstance();

exports.homePage = async (req, res) => {
  let dummyData = await searchTrain.getAllClassTypeData(req, res);
  let data = {};
  data.title = "Train Search";
  data.allClasses = dummyData.data;
  res.render("index", data);
};
