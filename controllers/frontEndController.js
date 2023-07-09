const frontEndService = require("../modules/frontEnd/frontEnd");
const frontEnd = frontEndService.getClassInstance();

exports.searchResult = async (req, res) => {
  let data = await frontEnd.searchTrainBtwStations(req);
  data = handleTrainData(data);
  let dummyData = await frontEnd.getAllClassTypeData(req, res);
  if (data) data.allClasses = dummyData.data;
  else data = { allClasses: dummyData.data };
  res.render("train-search-result", data);
};
exports.searchTrainBtwStations = async (req, res) => {
  let outData = await frontEnd.searchTrainBtwStations(req);
  res.json(outData);
};

exports.allClassType = async (req, res) => {
  let outData = await frontEnd.getAllClassTypeData(req, res);
  res.json(outData);
};
exports.getStationData = async (req, res) => {
  let outData = await frontEnd.getStationData(req, res);
  console.log(outData);
  res.json(outData);
};

exports.trainTimetable = async (req, res) => {
  let outData = await frontEnd.getTrainTimetable(req.params.trainNumber);
  res.json(outData);
};

function handleTrainData(trainDataObject) {
  const returnObject = new Object();
  const trainData = trainDataObject.data;
  const searchDate = new Date(trainDataObject.searchDate);
  const trainDataLength = trainData.length;

  if (trainDataLength === 0) return;
  let trainSearchFromStation = trainData[0]["from-station-data"].station_name;
  returnObject.trainSearchFromStation = trainSearchFromStation;

  let trainSearchToStation = trainData[0]["to-station-data"].station_name;
  returnObject.trainSearchToStation = trainSearchToStation;

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let searchDateString = searchDate.toString();
  let temp = `${searchDateString.substring(0, 3)}, ${searchDateString.substring(
    8,
    10
  )} ${searchDateString.substring(4, 7)} ${searchDateString.substring(11, 15)}`;

  const currentDate = temp;
  const trainNames = [];
  const trainTypes = [];
  const trainNumbers = [];
  const trainRunnigDays = [];
  const trainDepartureTimes = [];
  const trainDepartureStations = [];
  const trainArrivalTimes = [];
  const trainArrivalStations = [];
  const trainTravelTimes = [];
  const trainDepartureDates = [];
  const trainArrivalDates = [];
  const trainClassTypeNames = [];

  let i = 0;

  for (i = 0; i < trainDataLength; i++) {
    trainNames.push(trainData[i]["train-name"]);
    trainTypes.push(trainData[i]["train-type"]);
    trainNumbers.push(trainData[i]["train-number"]);
    trainRunnigDays.push(trainData[i]["day"]);

    trainDepartureTimes.push(trainData[i]["from-station-data"].departure_time);
    trainDepartureStations.push(trainData[i]["from-station-data"].station_name);
    trainArrivalTimes.push(trainData[i]["to-station-data"].arrival_time);
    trainArrivalStations.push(trainData[i]["to-station-data"].station_name);

    let departureDayNumber =
      parseInt(trainData[i]["from-station-data"].day) - 1;
    let arrivalDayNumber = parseInt(trainData[i]["to-station-data"].day) - 1;

    let departureTime = new Date(0, 0, 0, 0, 0, 0);
    let arrivalTime = new Date(0, 0, 0, 0, 0, 0);
    departureTime.setDate(departureDayNumber);
    departureTime.setHours(
      ...trainData[i]["from-station-data"].departure_time.split(":")
    );
    arrivalTime.setDate(arrivalDayNumber);
    arrivalTime.setHours(
      ...trainData[i]["to-station-data"].arrival_time.split(":")
    );
    trainTravelTimes.push(DateTimeDifference(departureTime, arrivalTime));

    let departureDate = new Date(
      searchDate.getFullYear(),
      searchDate.getMonth(),
      searchDate.getDate() + departureDayNumber
    );

    let departureDateString = departureDate.toString();
    temp = `${departureDateString.substring(
      0,
      3
    )}, ${departureDateString.substring(8, 10)} ${departureDateString.substring(
      4,
      7
    )}`;

    trainDepartureDates.push(temp);

    let arrivaleDate = new Date(
      searchDate.getFullYear(),
      searchDate.getMonth(),
      searchDate.getDate() + arrivalDayNumber
    );
    let arrivalDateString = arrivaleDate.toString();
    temp = `${arrivalDateString.substring(0, 3)}, ${arrivalDateString.substring(
      8,
      10
    )} ${arrivalDateString.substring(4, 7)}`;

    trainArrivalDates.push(temp);

    const trainClassTypes = [];
    for (j = 0, l = trainData[i]["class-types"].length; j < l; j++) {
      trainClassTypes.push(trainData[i]["class-types"][j].class_type_name);
    }
    trainClassTypeNames.push(trainClassTypes);
  }

  returnObject.searchDate = trainDataObject.searchDate;
  returnObject.fromStation = trainDataObject.fromStation;
  returnObject.toStation = trainDataObject.toStation;
  returnObject.classTypeSelected = trainDataObject.classType;
  returnObject.trainDataLength = trainDataLength;
  returnObject.currentDate = currentDate;
  returnObject.trainNames = trainNames;
  returnObject.trainTypes = trainTypes;
  returnObject.trainNumbers = trainNumbers;
  returnObject.trainRunnigDays = trainRunnigDays;
  returnObject.trainDepartureTimes = trainDepartureTimes;
  returnObject.trainDepartureStations = trainDepartureStations;
  returnObject.trainArrivalTimes = trainArrivalTimes;
  returnObject.trainArrivalStations = trainArrivalStations;
  returnObject.trainTravelTimes = trainTravelTimes;
  returnObject.trainDepartureDates = trainDepartureDates;
  returnObject.trainArrivalDates = trainArrivalDates;
  returnObject.trainClassTypeNames = trainClassTypeNames;

  return returnObject;
}

function DateTimeDifference(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);

  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0) hours = hours + 24;

  return (
    (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes
  );
}
