exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/agent-login");
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/agent");
  }
  return next();
};

exports.agentHomePage = (req, res) => {
  console.log("Get  request to agent home route");
  res.render("agent/agent-home");
};

exports.state = (req, res) => {
  res.render("agent/state-search-add-edit");
};
exports.zone = (req, res) => {
  res.render("agent/zone-search-add-edit");
};
exports.trainType = (req, res) => {
  res.render("agent/traintype-search-add-edit");
};
exports.classType = (req, res) => {
  res.render("agent/classType-search-add-edit");
};
exports.station = (req, res) => {
  res.render("agent/station-search-add-edit");
};
exports.trainAdd = (req, res) => {
  res.render("agent/train-add");
};
exports.trainSearch = (req, res) => {
  res.render("agent/train-search-edit");
};
exports.trainTimetable = (req, res) => {
  res.render("agent/train-timetable-input");
};

exports.agentRequestSignUpTable = (req, res) => {
  res.render("agent/signup-request-table");
};
