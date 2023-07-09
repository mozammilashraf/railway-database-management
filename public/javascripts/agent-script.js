let id = 1;

const startFormTemplate = document.querySelector(".input-state-data").innerHTML;

var addNewInputStateForm = () => {
  var formTemplate = document.querySelector(".input-form");
  var inputTemplate = startFormTemplate;
  var newDiv = document.createElement("div");
  newDiv.className = "input-state-data";
  newDiv.id = "input-state-data-" + id;

  inputTemplate = inputTemplate.replace(
    "input-state-data-bin-0",
    "input-state-data-bin-" + id
  );
  newDiv.innerHTML = inputTemplate;
  formTemplate.appendChild(newDiv);

  id++;
};
var deleteInputStateForm = (id) => {
  console.log(id);
  var abc = document.getElementById(id);
  console.log(abc);
  console.log(abc.parentNode);
  abc.parentElement.remove();
};

const addBtn = document.querySelector("#submit-btn");

addBtn.onclick = function () {
  // console.log("success");
  const stationName = document.querySelectorAll("input");

  let station_code;
  let station_name;
  let state;
  let zone;

  let stationObjectArray = [];
  console.log(stationName.length);
  for (let index = 0; index < stationName.length; index += 4) {
    station_code = stationName[index];
    station_name = stationName[index + 1];
    state = stationName[index + 2];
    zone = stationName[index + 3];
    console.log(
      station_code.value,
      station_name.value,
      state.value,
      zone.value
    );
    stationObjectArray.push(
      JSON.stringify({
        station_code: station_code.value,
        station_name: station_name.value,
        state: state.value,
        zone: zone.value,
      })
    );
    // .then((data) => insertRowIntoTable(data["data"]));
  }
  console.log(stationObjectArray);
  fetch("/agent/station-input", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(
      // station_code: station_code.value,
      // station_name: station_name.value,
      // state: state.value,
      // zone: zone.value,
      stationObjectArray
    ),
  });
  // .then((response) =>
  //   response.json().then((data) => {
  //     console.log("Success:", data);
  //   })
  // )
  // .catch((error) => {
  //   console.log("Error : ", error);
  // });
  // .then((response) => response.json());
};

// function insertRowIntoTable(data) {}
