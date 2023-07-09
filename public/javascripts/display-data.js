// console.log("Testing");

document.addEventListener("DOMContentLoaded", function () {
  // fetch("/agent/all-stations/JSON")
  fetch("/agent/all-stations/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      console.log(data["data"]);
      loadStationData(data["data"]);
    });
  //   loadStationTable([]);
  // console.log("testing");
});

function loadStationData(data) {
  // const table = document.querySelectorAll("station-data-row");

  //   console.log(typeof data);
  let displayContainer = document.querySelector(".dislpay-data-container");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    console.log("No Data");
  }

  data.forEach(function ({
    station_id,
    station_code,
    station_name,
    zone,
    state,
  }) {
    const template = `<div class="station-data-row">
          <div class="station-code">${station_code}</div>
          <div class="station-name">${station_name}</div>
          <div class="state">${state}</div>
          <div class="zone">${zone}</div>
          <div class="edit"><button class="edit-btn">Edit</button></div>
          <div class="delete"><button class="delete-btn">Delete</button></div>
        </div>`;

    displayContainer.insertAdjacentHTML("beforeend", template);
  });
}
