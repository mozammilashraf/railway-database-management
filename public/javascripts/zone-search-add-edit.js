//! Insertion Related functions
const template = document.querySelector(".form-input-row-container").innerHTML;

function addNewInputFormRow() {
  let inputRowContainer = document.querySelector(".form-input-row-container");
  // console.log(inputRowContainer.childNodes);
  inputRowContainer.insertAdjacentHTML("beforeend", template);
  // inputRowContainer.appendChild(stringToHTML(template));
  // console.log(template);
}
function deleteInputFormRow(row) {
  let a = row.parentNode;
  // console.log(a);
  a.remove(a);
}

const zoneForm = document.getElementById("zone-form");
zoneForm.addEventListener("submit", handleFormSubmit);

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
  // console.log(tempObject);
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

//! Search - Edit Related Function
function showAllZone() {
  fetch("/agent/zone/all/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadZoneTable(data["data"]);
    });
  //   loadStationTable([]);
  console.log("testing");
}

function loadZoneTable(data) {
  const table = document.querySelector("table tbody");

  let tableHtml = "";
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";
    console.log("No Data");
    alert("No Data Found");
  }

  data.forEach(function ({ zone_id, zone_name, zone_code }) {
    zone_name = capatalise(zone_name);
    tableHtml += "<tr>";
    tableHtml += `<td data-id=${zone_id}>${zone_name}</td>`;
    tableHtml += `<td data-id=${zone_id}>${zone_code}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${zone_id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${zone_id}>Edit</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

// To prevent default behaviour of form
var submit_form = document.getElementById("zone-search-form");
submit_form.onsubmit = function (e) {
  e.preventDefault();
};

const searchBtn = document.getElementById("search-btn");
function searchZone() {
  const searchValue = document.getElementById("search-text").value;
  if (!searchValue) {
    alert("Search Box is epmty.");
    return;
  }
  console.log("searched for : " + searchValue);
  fetch("/agent/zone/" + searchValue.toLowerCase())
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadZoneTable(data["data"]);
    });
  console.log("submitterd");
  // alert("ABC")
}

const table = document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "delete-row-btn") {
      let isExecuted = confirm("Are you sure to perform delete action?");
      // console.log(isExecuted);
      if (!isExecuted) return;
      deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit-row-btn") {
      handleEditRow(event.target.dataset.id);
    }
  });

function deleteRowById(id) {
  fetch("/agent/zone/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      alert("Successfully deleted data");
      location.reload();
      // }
    })
    .catch((err) => {
      console.log(err.errorMessage);
      alert("Unable to deleted data");
    });
  // .then((data) => {
  //   console.log(data["data"]);
  //   loadZoneTable(data["data"]);
  // });
}

function handleEditRow(id) {
  const updateSection = document.getElementById("update-row");
  updateSection.hidden = false;
  console.log(id);
  document.getElementById("update-row-btn").dataset.id = id;
  let temp = document.querySelectorAll(`[data-id='${id}']`);
  let tempArray = [];
  for (var [key, value] of temp.entries()) {
    // console.log(key, value);
    if (value.tagName == "TD") {
      tempArray.push(value.innerHTML);
    }
  }

  console.log(temp.values);
  document.getElementById("update-zone-name-input").dataset.id = id;
  document.getElementById("update-zone-name-input").value = tempArray[0];
  document.getElementById("update-zone-code-input").dataset.id = id;
  document.getElementById("update-zone-code-input").value = tempArray[1];
  // updateSection.dataset.id = id;
}

const updateBtn = document.getElementById("update-row-btn");
updateBtn.onclick = function () {
  const newZoneName = document.getElementById("update-zone-name-input");
  const newZoneCode = document.getElementById("update-zone-code-input");

  // console.log(newZoneName.dataset.id);
  fetch("/agent/zone/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      zoneID: newZoneName.dataset.id,
      newZoneName: newZoneName.value,
      newZoneCode: newZoneCode.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      alert("Successfully updated data");
      location.reload();
      // }
    });
};

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
