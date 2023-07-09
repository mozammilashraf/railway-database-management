// const template = document.querySelector(".form-input-row ").outerHTML;
const template = document.getElementsByTagName("template")[0].innerHTML;
const formTimetable = document.getElementById("train-timetable-form");
const trainDataSection = document.getElementById("train-data-container");

function addNewInputFormRow(row) {
  // let inputRowContainer = document.querySelector(".input-container-row");
  // console.log(inputRowContainer.childNodes);
  // inputRowContainer.insertAdjacentHTML("afterend", template);
  // inputRowContainer.appendChild(stringToHTML(template));
  // console.log(template);
  // console.log(row.parentNode);
  let a = row.parentNode;
  a.insertAdjacentHTML("afterend", template);
}
function deleteInputFormRow(row) {
  let a = row.parentNode;
  // console.log(a);
  a.remove(a);
}

// var stringToHTML = function (str) {
//   var parser = new DOMParser();
//   var doc = parser.parseFromString(str, "text/html");
//   return doc.body;
// };

// async function submitResult() {
//   let isExecuted = confirm("Are you sure to submit this form?");
//   // console.log(isExecuted);

//   if (isExecuted) {
//     let promise = new Promise((resolve, reject) => {
//       resolve(document.getElementById("train-timetable-form").submit());
//     });
//     const res = await promise;
//     const data = await res.json();
//     alert(data);
//   }
// }

const trainTimetableForm = document.getElementById("train-timetable-form");
trainTimetableForm.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  let isExecuted = confirm("Are you sure to submit this form?");
  if (!isExecuted) return;

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    let data = responseData;
    console.log(data);
    if (data.error == true) alert(data.err);
    else alert("Successfully submitted data");
  } catch (error) {
    console.error(error);
  }
}

async function postFormDataAsJson({ url, formData }) {
  // console.log(...formData);
  let tempObject = {};

  for (var [key, value] of formData.entries()) {
    console.log(key, value);

    // console.log(tempObject[key]);
    if (!tempObject[key]) {
      tempObject[key] = [];
    }
    tempObject[key].push(value);
  }
  console.log(tempObject);
  // return;

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

function calculateSrNo() {
  console.log("Form changed");
  // let myForm = document.getElementById("train-timetable-form");
  const myFormRows = document.querySelectorAll(".form-input-row");
  console.log(myFormRows[0].children);
  // let time = myFormRows[0].children[3].value;
  // let day = parseInt(myFormRows[0].children[13].value, 10);
  // let str = time.split(":");
  // let hour = parseInt(str[0], 10);
  // let minute = parseInt(str[1], 10);
  // let specialNumber = (day - 1) * 12 * 60 + hour * 60 + minute;
  // console.log(`Day : ${day * 12 * 60}, Hour : ${hour * 60}, Min : ${minute}`);
  // if (!specialNumber) console.log("No Special Number");
  // else console.log("Special Number : " + specialNumber);
  let specialNumberArray = [];
  for (let i = 0; i < myFormRows.length; i++) {
    const element = myFormRows[i];
    const dTime = element.children["departure-time"].value;
    const aTime = element.children["arrival-time"].value;
    const day = parseInt(element.children["day"].value, 10);
    let str = dTime.split(":");
    if (!dTime) str = aTime.split(":");
    const hour = parseInt(str[0], 10);
    const minute = parseInt(str[1], 10);
    const specialNumber = (day - 1) * 24 * 60 + hour * 60 + minute;
    // let specialNumber = (day - 1) * 24 * 60;
    // specialNumber += hour * 60;
    // specialNumber += minute;
    if (specialNumber) specialNumberArray.push(specialNumber);
  }
  console.table(specialNumberArray);
  specialNumberArray.sort((a, b) => a - b);
  console.table(specialNumberArray);

  for (let i = 0; i < myFormRows.length; i++) {
    const element = myFormRows[i];
    const srNo = element.children["sr-no"];
    const dTime = element.children["departure-time"].value;
    const aTime = element.children["arrival-time"].value;
    let str = dTime.split(":");
    if (!dTime) str = aTime.split(":");

    const day = parseInt(element.children["day"].value, 10);
    const hour = parseInt(str[0], 10);
    const minute = parseInt(str[1], 10);
    const specialNumber = (day - 1) * 24 * 60 + hour * 60 + minute;
    // let specialNumber = (day - 1) * 24 * 60;
    // specialNumber += hour * 60;
    // specialNumber += minute;
    if (specialNumber) {
      srNo.value = specialNumberArray.indexOf(specialNumber) + 1;
    }
  }
}

function searchTrain() {
  const searchValue = document.getElementById("search-text").value;
  if (!searchValue) {
    alert("Search Box is epmty.");
    return;
  }
  console.log("searched for : " + searchValue);
  fetch("/agent/train/" + searchValue.toLowerCase())
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      console.log(data);
      if (data.error) {
        alert(data.err);
        return;
      }
      trainDataSection.hidden = false;
      formTimetable.hidden = true;

      loadTrainTable(data);
    });
  console.log("submitterd");
  // alert("ABC")
}

function loadTrainTable(data) {
  const table = document.querySelector("table tbody");
  let tableHtml = "";
  if (data.error === true) {
    table.innerHTML = "<tr><td class='no-data' colspan='9'>No Data</td></tr>";
    console.log("No Data");
    alert("No Data Found");
    return;
  }

  let trainData = data.data[0];
  let classData = data.classes;

  for (let index = 0; index < trainData.length; index++) {
    const days = [];
    const train = trainData[index];
    train_name = capatalise(train.train_name);
    tableHtml += `<tr data-id='${train.train_id}'>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.train_no}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.return_train_no}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.train_name}</td>`;

    if (train.monday == 1) days.push("Mon");
    if (train.tuesday == 1) days.push("Tue");
    if (train.wednesday == 1) days.push("Wed");
    if (train.thursday == 1) days.push("Thur");
    if (train.friday == 1) days.push("Fri");
    if (train.saturday == 1) days.push("Sat");
    if (train.sunday == 1) days.push("Sun");

    tableHtml += `<td data-id='${train.train_id}'>${days}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.train_type_name}</td>`;

    const classes = classData.find(
      (ele) => ele.trainID === train.train_id
    ).classesID;
    tableHtml += `<td data-id='${train.train_id}'>${classes}</td>`;

    tableHtml += `<td><button class="add-edit-timetable-btn" data-id='${train.train_id}'>Add/Edit</button></td>`;
    tableHtml += "</tr>";
  }
  table.innerHTML = tableHtml;
}

const table = document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "add-edit-timetable-btn") {
      const trainDataRow = document.querySelectorAll("tr");
      // trainDataSection.hidden = true;
      for (let i = 1; i < trainDataRow.length; i++) {
        const element = trainDataRow[i];
        if (element.dataset.id == event.target.dataset.id)
          element.hidden = false;
        else element.hidden = true;
      }
      handleAddEditTimetable(event.target.dataset.id);
    }
  });

async function handleAddEditTimetable(id) {
  formTimetable.hidden = false;
  console.log(id);
  document.getElementById("train-id").value = id;
  formTimetable.dataset.id = id;

  // const url = "/agent/train-timetable";
  // const method = "GET";
  // try {
  //   const formData = new FormData();
  //   formData.append("train-id", id);
  //   const responseData = await postFormDataAsJson({ url, formData, method });
  //   let data = responseData;
  //   console.log(data);
  //   if (data.error == true) alert(data.err);
  //   else alert("Successfully submitted data");
  // } catch (error) {
  //   console.error(error);
  // }

  let formInputRow = document.querySelectorAll(".form-input-row");
  for (let i = 0; i < formInputRow.length; i++) {
    const element = formInputRow[i];
    element.remove();
  }

  const a = document.getElementById("add-new-field-permanent").parentNode;
  fetch("/agent/train-timetable/" + id)
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      trainTimtableData = data["data"][0];
      // console.log(trainTimtableData);
      for (let i = 0; i < trainTimtableData.length; i++) {
        const element = trainTimtableData[i];
        a.insertAdjacentHTML("afterend", template);
        // console.log(b);
      }

      formInputRow = document.querySelectorAll(".form-input-row");
      for (let i = 0; i < trainTimtableData.length; i++) {
        const element = trainTimtableData[i];
        console.log(element);
        formInputRow[i].children["sr-no"].value = element["sr_no"];
        formInputRow[i].children["station-code"].value =
          element["station_code"];
        formInputRow[i].children["arrival-time"].value =
          element["arrival_time"];
        formInputRow[i].children["departure-time"].value =
          element["departure_time"];
        formInputRow[i].children["day"].value = element["day"];
        formInputRow[i].children["platform"].value = element["platform"];
        formInputRow[i].children["distance-traveled"].value =
          element["distance_traveled"];

        // a.insertAdjacentHTML("afterend", template);
        // console.log(b);
      }

      // trainDataSection.hidden = false;
      // formTimetable.hidden = true;

      // loadTrainTable(data);
    });
}

var stationData;
async function handleStationList(stationInput) {
  console.log("changed");
  // const trainList = stationInput.nextElementSibling;
  const trainList = document.getElementById("station-list");
  const stationInputValue = stationInput.value.trim();

  let trainListInnerHtml = "";
  if (stationInputValue.length < 2) return;
  console.log(stationInputValue.length);

  if (stationInputValue.length === 2) {
    // fetch(
    //   "/agent/station/" + stationInputValue.toLowerCase()
    // )
    //   .then((res) => res.json())
    //   // .then((data) => console.log(data));
    //   .then((data) => {
    //     if (data.error) {
    //       alert(data.err);
    //       return;
    //     }
    //     console.log(data);
    //     stationData = data["data"];

    //     stationData.forEach(function ({ station_name, station_code }) {
    //       station_name = capatalise(station_name);
    //       // console.log(station_name);
    //       trainListInnerHtml += `<option value="${station_code}">${station_name} / ${station_code}</option>`;
    //     });
    //     trainList.innerHTML = trainListInnerHtml;
    //     // loadTrainTable(data["data"]);
    //   });

    const res = await fetch(
      "/agent/station/" + stationInputValue.toLowerCase()
    );
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

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
