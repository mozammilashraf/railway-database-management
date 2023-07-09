let date = new Date();
let currentDate = date.toISOString().substring(0, 10);

document.addEventListener("DOMContentLoaded", async function () {
  // fetch("/agent/all-stations/JSON")
  // let trainTypeList = document.querySelectorAll("#zonesName");

  // console.log(document.getElementById("search-date"));
  document.getElementById("search-date").value = currentDate;

  // const res = await fetch("/classtype/all");
  // const data = await res.json();
  // if (data.error) {
  //   alert(data.err);
  //   return;
  // }
  // loadClassTypeList(data["data"]);
});

function loadClassTypeList(data) {
  // let classTypeList = document.querySelectorAll("#class-type");
  const classTypeList = document.getElementById("class-type");
  // console.log(statesList);
  let classTypeListHtml = `<option value="all-classes">All Classes</option>`; //`<input type="hidden" name="class-type-name" value="0" />`;
  if (data.length === 0) {
    console.log("No Class Type Data");
  }

  data.forEach(function ({ class_type_code, class_type_name }) {
    // state_name = capatalise(state_name);
    classTypeListHtml += `<option value="${class_type_code}">${class_type_name}</option>`;
    // <input type="hidden" name="${class_type_id}" value="false" />
  });
  classTypeList.innerHTML = classTypeListHtml;
}

const formSearchTrain = document.getElementById("search-train-form");
// formSearchTrain.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  // let isExecuted = confirm("Are you sure to submit this form?");
  // if (!isExecuted) return;

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    postFormDataAsJson({ url, formData });
    // const responseData = await postFormDataAsJson({ url, formData });
    // let data = responseData;
    // console.log(responseData);

    // console.log(data);
    // if (data.error == true) alert(data.err);
    // else alert("Successfully submitted data");
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

  await fetch(url, fetchOptions);

  // if (!response.ok) {
  //   const errorMessage = await response.text();
  //   throw new Error(errorMessage);
  // }
  // return response.json();
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

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
