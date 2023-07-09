let date = new Date();
let currentDate = date.toISOString().substring(0, 10);
console.log(date);
let searchDate;

// document.getElementById("search-date").value = currentDate;

document.addEventListener("DOMContentLoaded", async function () {
  const results = document.querySelectorAll(".result-tempelate-item");
  if (!results) {
    alert("No train found");
    return;
  }

  const rusultClassItems = document.querySelectorAll(".result-class-item");
  const classNames = [];
  const trainTypeNames = [];
  // console.log(rusultClassItems);
  for (let i = 0, l = results.length; i < l; i++) {
    const trainTypeName = results[i].dataset.trainType;
    if (trainTypeNames.indexOf(trainTypeName) === -1)
      trainTypeNames.push(trainTypeName);
  }
  for (let i = 0, l = rusultClassItems.length; i < l; i++) {
    const className = rusultClassItems[i].innerText;
    if (classNames.indexOf(className) === -1) classNames.push(className);
  }
  // console.log(trainTypeNames);
  // console.log(classNames);
  setClassFilter(classNames);
  // setTrainTypeFilter(trainTypeNames);
});
function selectAllClassFilter() {
  let filterClassItems = document.querySelectorAll(".filter-class-item input");
  for (let i = 0; i < filterClassItems.length; i++)
    filterClassItems[i].checked = true;
  filter();
}

function setClassFilter(classNames) {
  let filterClassItems = document.querySelectorAll(".filter-class-item");
  for (let i = 0, l = filterClassItems.length; i < l; i++) {
    const filterClass = filterClassItems[i];
    filterClass.remove();
  }
  let filterClassContatiner = document.querySelector(".filter-class-container");
  classNames.forEach((className) => {
    filterClassContatiner.innerHTML += `<div class='filter-class-item'>
    <input id='${className}' type='checkbox' checked name='${className}' onchange="filter()">
    <label for='${className}'> ${className}</label>
    </div>`;
  });

  filter();
}
function setTrainTypeFilter(trainTypeNames) {
  let filterTrainTypeItems = document.querySelectorAll(
    ".filter-train-type-item"
  );
  for (let i = 0, l = filterTrainTypeItems.length; i < l; i++) {
    const filterTrainType = filterTrainTypeItems[i];
    filterTrainType.remove();
  }

  let filterTrainTypeContatiner = document.querySelector(
    ".filter-train-type-container"
  );
  trainTypeNames.forEach((trainTypeName) => {
    filterTrainTypeContatiner.innerHTML += `<div class='filter-train-type-item'>
    <input id='${trainTypeName}' type='checkbox' checked name='${trainTypeName}' onchange="filter()">
    <label for='${trainTypeName}'> ${trainTypeName}</label>
    </div>`;
  });
  filter();
}

function filter() {
  let totalResults = 0;
  const numberOfResultsSpan = document.getElementById("number-of-results");

  const results = document.querySelectorAll(".result-tempelate-item");
  let filterClassItems = document.querySelectorAll(".filter-class-item input");
  let filterTrainTypeItems = document.querySelectorAll(
    ".filter-train-type-item  input"
  );

  for (let i = 0; i < results.length; i++) {
    const e = results[i];
    e.setAttribute("hidden", true);
  }

  // console.log(filterClassItems);
  for (let i = 0; i < filterClassItems.length; i++) {
    const element = filterClassItems[i];
    if (element.checked) {
      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        const temp = result.getElementsByClassName("result-class-item");
        for (let k = 0; k < temp.length; k++) {
          if (
            temp[k].innerText.trim() == element.name.trim() &&
            result.hasAttribute("hidden")
          ) {
            // totalResults++;
            result.removeAttribute("hidden");
          }
        }
      }
    }
  }
  // for (let i = 0; i < filterTrainTypeItems.length; i++) {
  //   const element = filterTrainTypeItems[i];
  //   if (element.checked) {
  //     for (let j = 0; j < results.length; j++) {
  //       const result = results[j];
  //       const temp = result.dataset.trainType;
  //       if (
  //         temp.trim() == element.name.trim() &&
  //         result.hasAttribute("hidden")
  //       ) {
  //         result.removeAttribute("hidden");
  //       }
  //     }
  //   }
  // }

  for (let i = 0; i < results.length; i++) {
    const e = results[i];
    if (!e.hasAttribute("hidden")) totalResults++;
  }

  numberOfResultsSpan.innerText = totalResults;
}

const fromStation = document.getElementById("from-station");
const toStation = document.getElementById("to-station");
function onExchangeStation() {
  let tempStation = fromStation.value;
  fromStation.value = toStation.value;
  toStation.value = tempStation;
}

const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close-button");
// modal.showModal();

async function showTrainTimetable(trainTimetableDiv) {
  let trainTimetableDivParent = trainTimetableDiv?.parentElement;
  const trainNumber = trainTimetableDivParent.dataset.trainNumber;
  const trainName = trainTimetableDivParent.dataset.trainName;
  const runsOn = trainTimetableDivParent.dataset.trainRunningDay;
  console.log(trainNumber);
  const res = await fetch("/train-search/traintimetable/" + trainNumber);
  const data = await res.json();
  // console.log(data.data);
  loadTrainTimetable(data.data, trainNumber, trainName, runsOn);
  modal.showModal();

  // const openModal = document.querySelector(".open-button");
}
closeModal.addEventListener("click", () => {
  modal.close();
});

function loadTrainTimetable(data, trainNumber, trainName, runsOn) {
  const trainInfoTable = document.querySelector(".train-info-table tbody");

  runsOn = runsOn?.split(",");
  let runningDaysHTML = "";
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  // console.log(runsOn);
  for (let index = 0; index < runsOn.length; index++) {
    const day = runsOn[index];
    if (day == 1)
      runningDaysHTML += `<span class="green-bg">${days[index]}</span>`;
    else runningDaysHTML += `<span class="red-bg">${days[index]}</span>`;
  }

  trainInfoTable.innerHTML = `<tr>
  <td>${trainNumber}</td>
  <td>${trainName}</td>
  <td>${data[0].station_name}</td>
  <td>${data[data.length - 1].station_name}</td>
  <td>${runningDaysHTML}</td>
  </tr>`;

  const trainTimetableTable = document.querySelector(
    ".train-timetable-table tbody"
  );
  trainTimetableTable.innerHTML = "";

  let trainTimetableTableInnerHTML = "";
  // console.log(trainTimetableTable);
  data.forEach((trainTimtableRow) => {
    // console.log(trainTimtableRow);
    trainTimetableTableInnerHTML += "<tr>";
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.sr_no}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.station_code}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.station_name}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.arrival_time}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.departure_time}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.halt_time}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.distance_traveled}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.day}</td>`;
    trainTimetableTableInnerHTML += `<td>${trainTimtableRow?.platform}</td>`;
    trainTimetableTableInnerHTML += "</tr>";
  });
  trainTimetableTable.innerHTML = trainTimetableTableInnerHTML;
}

function loadClassTypeList(data) {
  // let classTypeList = document.querySelectorAll("#class-type");
  const classTypeList = document.getElementById("class-type");
  // console.log(statesList);
  let classTypeListHtml = `<option value="all-classes">All Classes</option>`; //`<input type="hidden" name="class-type-name" value="0" />`;
  if (data.length === 0) {
    console.log("No Class Type Data");
  }

  data.forEach(function ({ class_type_code, class_type_name }) {
    classTypeListHtml += `<option value="${class_type_code}">${class_type_name}</option>`;
  });
  classTypeList.innerHTML = classTypeListHtml;
}

const formSearchTrain = document.getElementById("search-train-form");
formSearchTrain.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  console.log(event);
  event?.preventDefault?.();
  const form = event.currentTarget;
  console.log(form);
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    // let data = responseData;
    console.log(responseData);
    handleTrainData(responseData);
    // console.log(data);
    // if (data.error == true) alert(data.err);
    // else alert("Successfully submitted data");
  } catch (error) {
    console.error(error);
  }
}

async function postFormDataAsJson({ url, formData }) {
  let tempObject = {};

  for (var [key, value] of formData.entries()) {
    console.log(key, value);

    if (!tempObject[key]) {
      tempObject[key] = [];
    }
    tempObject[key].push(value);
  }
  console.log(tempObject);

  searchDate = new Date(tempObject["search-date"]);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(tempObject),
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
}

var stationData;
async function handleStationList(stationInput) {
  console.log("changed");
  const trainList = document.getElementById("station-list");
  const stationInputValue = stationInput.value.trim();

  let trainListInnerHtml = "";
  if (stationInputValue.length < 2) return;
  console.log(stationInputValue.length);

  if (stationInputValue.length === 2) {
    const res = await fetch("/station/" + stationInputValue.toLowerCase());
    const data = await res.json();

    let promise = new Promise((resolve, reject) => {
      resolve(data["data"]);
    });
    stationData = await promise;
    console.log(stationData);

    stationData.forEach(function ({ station_name, station_code }) {
      station_name = capatalise(station_name);
      // console.log(station_name);
      trainListInnerHtml += `<option value="${station_code}">${station_name} / ${station_code}</option>`;
    });
    trainList.innerHTML = trainListInnerHtml;
    // loadTrainTable(data["data"]);
  } else {
    trainListInnerHtml = "";
    // console.log("Station Data : " + stationData);
    stationData.forEach(function ({ station_name, station_code }) {
      if (
        station_name.toLowerCase().indexOf(stationInputValue.toLowerCase()) !=
          -1 ||
        station_code.toLowerCase().indexOf(stationInputValue.toLowerCase()) !=
          -1
      ) {
        station_name = capatalise(station_name);
        trainListInnerHtml += `<option value="${station_code}">${station_name} / ${station_code}</option>`;
      }
    });
    trainList.innerHTML = trainListInnerHtml;
  }
}

function handleTrainData(trainDataObject) {
  const trainData = trainDataObject.data;
  console.log(trainData);
  document.getElementById("number-of-results").innerText = trainData.length;
  if (trainData.length === 0) {
    alert("No train found");
    // document.getElementById("result-meta-data").innerText = "0 Results";
    return;
  }

  document.getElementById("train-search-from-station").innerText =
    trainData[0]["from-station-data"].station_name;
  document.getElementById("train-search-to-station").innerText =
    trainData[0]["to-station-data"].station_name;
  // Tue, 05 Apr 2022
  // Tue Apr 05 2022 05:30:00 GMT+0530 (India Standard Time)
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // document.getElementById("current-date").innerText = searchDate;
  // searchDate.toLocaleDateString("en-US", options);
  let searchDateString = searchDate.toString();
  let temp = `${searchDateString.substring(0, 3)}, ${searchDateString.substring(
    8,
    10
  )} ${searchDateString.substring(4, 7)} ${searchDateString.substring(11, 15)}`;
  document.getElementById("current-date").innerText = temp;
  // console.log(temp);

  // console.log(searchDate);

  let resultContainer = document.querySelector(".result-tempelate-container");
  let resultCardTempelate = document.getElementById(
    "result-card-tempelate"
  ).innerHTML;
  let resultClassItemTempelate = document.getElementById(
    "result-class-item-tempelate"
  ).innerHTML;
  resultContainer.innerHTML = "";
  let i = 0;
  for (i = 0; i < trainData.length; i++) {
    // const element = trainData[i];
    resultContainer.insertAdjacentHTML("beforeend", resultCardTempelate);
  }
  let trainResultCards = document.querySelectorAll(".result-tempelate-item");
  for (i = 0; i < trainResultCards.length; i++) {
    // console.log(trainData);
    const trainResultCard = trainResultCards[i];
    trainResultCard.dataset.trainType = trainData[i]["train-type"];
    trainResultCard.getElementsByClassName("train-name")[0].innerHTML =
      trainData[i]["train-name"];
    trainResultCard.getElementsByClassName("train-number")[0].innerHTML =
      trainData[i]["train-number"];

    const trainScheduleLink = trainResultCard.getElementsByClassName(
      "train-schedule-link"
    )[0];
    trainScheduleLink.dataset.trainNumber = trainData[i]["train-number"];
    trainScheduleLink.dataset.trainName = trainData[i]["train-name"];
    trainScheduleLink.dataset.trainRunningDay = trainData[i]["day"];

    const runningDay =
      trainResultCard.getElementsByClassName("train-running-day");
    for (let j = 0; j < runningDay.length; j++) {
      if (trainData[i]["day"][j] !== 1) {
        runningDay[j].style.color = "lightgray";
      }
    }
    trainResultCard.getElementsByClassName("departure-time")[0].innerText =
      trainData[i]["from-station-data"].departure_time;
    trainResultCard.getElementsByClassName("departure-station")[0].innerText =
      trainData[i]["from-station-data"].station_name;
    trainResultCard.getElementsByClassName("arrival-time")[0].innerText =
      trainData[i]["to-station-data"].arrival_time;
    trainResultCard.getElementsByClassName("arrival-station")[0].innerText =
      trainData[i]["to-station-data"].station_name;

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
    // console.log(arrivalTime);

    trainResultCard.getElementsByClassName("travel-time-value")[0].innerText =
      DateTimeDifference(departureTime, arrivalTime);

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
    trainResultCard.getElementsByClassName("departure-date")[0].innerText =
      temp;

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
    trainResultCard.getElementsByClassName("arrival-date")[0].innerText = temp;
    let resultClassContainer = trainResultCard.getElementsByClassName(
      "train-result-card-classes"
    )[0];
    resultClassContainer.innerHTML = "";
    for (j = 0, l = trainData[i]["class-types"].length; j < l; j++) {
      // const element = trainData[i];
      resultClassContainer.insertAdjacentHTML(
        "beforeend",
        resultClassItemTempelate
      );
    }
    let trainClassTypeCards =
      trainResultCard.getElementsByClassName("result-class-item");
    for (j = 0; j < trainClassTypeCards.length; j++) {
      trainClassTypeCards[j].innerText =
        trainData[i]["class-types"][j].class_type_name;
    }
  }

  // *   =========================
  const rusultClassItems = document.querySelectorAll(".result-class-item");
  const classNames = [];
  // console.log(rusultClassItems);
  for (let i = 0, l = rusultClassItems.length; i < l; i++) {
    const className = rusultClassItems[i].innerText;
    if (classNames.indexOf(className) === -1) classNames.push(className);
    // classNames.push(className);
  }
  // console.log(classNames);
  setClassFilter(classNames);
}

function searchForNextDay() {
  searchDate = document.getElementById("search-date")?.valueAsDate;
  if (!searchDate) return;
  searchDate.setDate(searchDate.getDate() + 1);
  document.getElementById("search-date").valueAsDate = searchDate;
  let form = document.getElementById("search-train-form");
  if (!form) return;
  let event = {};
  event.currentTarget = form;
  // document.["search-train-form"].submit();
  handleFormSubmit(event);
}
function searchForPreviousDay() {
  searchDate = document.getElementById("search-date")?.valueAsDate;
  if (!searchDate) return;
  searchDate.setDate(searchDate.getDate() - 1);
  document.getElementById("search-date").valueAsDate = searchDate;
  let form = document.getElementById("search-train-form");
  if (!form) return;
  let event = {};
  event.currentTarget = form;
  // document.["search-train-form"].submit();
  handleFormSubmit(event);
}

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

function timeDifference(start, end) {
  start = start.split(":");
  end = end.split(":");
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
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
function DateTimeDifference(startDate, endDate) {
  // start = start.split(":");
  // end = end.split(":");
  // var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  // var endDate = new Date(0, 0, 0, end[0], end[1], 0);
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
