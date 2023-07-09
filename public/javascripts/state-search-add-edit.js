// const { temp } = require("../../controllers/railwayController");

//! Insertion Related functions
const template = document.querySelector(".form-input-row ").outerHTML;

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

const stateForm = document.getElementById("state-form");
stateForm.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  let isExecuted = confirm("Are you sure to submit this form?");
  if (!isExecuted) return;

  // let response = await fetch(event.currentTarget.action, {
  //   method: "POST",
  //   body: new FormData(stateForm),
  // });
  // let result = await response.json();
  // alert(result.message);

  const form = event.currentTarget;
  const url = form.action;
  // console.log(url);
  // return;
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
  // const plainFormData = Object.fromEntries(formData.entries());
  // const formDataJsonString = JSON.stringify(plainFormData);

  console.log(...formData);
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
    // body: formDataJsonString,
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
function showAllState() {
  fetch("/agent/state/all/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadStateTable(data["data"]);
    });
  //   loadStationTable([]);
  console.log("testing");
}

function loadStateTable(data) {
  const table = document.querySelector("table tbody");

  //   console.log(typeof data);

  let tableHtml = "";
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
    console.log("No Data");
    alert("No Data Found");
  }

  data.forEach(function ({ state_id, state_name }) {
    state_name = capatalise(state_name);
    tableHtml += "<tr>";
    tableHtml += `<td data-id=${state_id}>${state_name}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${state_id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${state_id}>Edit</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

// To prevent default behaviour of form
var submit_form = document.getElementById("state-search-form");
submit_form.onsubmit = function (e) {
  e.preventDefault();
};

const searchBtn = document.getElementById("search-btn");
function searchState() {
  const searchValue = document.getElementById("search-text").value;
  if (!searchValue) {
    alert("Search Box is epmty.");
    return;
  }
  console.log("searched for : " + searchValue);
  fetch("/agent/state/" + searchValue.toLowerCase())
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadStateTable(data["data"]);
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
  fetch("/agent/state/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      alert("Successfully Deleted Data")
      console.log(data);
      location.reload();
      // if (data.success) {
      // }
    });
  // .then((data) => {
  //   console.log(data["data"]);
  //   loadStateTable(data["data"]);
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
    console.log(key, value);
    if (value.tagName == "TD") {
      tempArray.push(value.innerHTML);
    }
  }
  console.log(temp.values);

  document.getElementById("update-state-name-input").dataset.id = id;
  document.getElementById("update-state-name-input").value = tempArray[0];
}

const updateBtn = document.getElementById("update-row-btn");
updateBtn.onclick = function () {
  const newStateName = document.getElementById("update-state-name-input");

  // console.log(newStateName.dataset.id);
  fetch("/agent/state/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      stateID: newStateName.dataset.id,
      newStateName: newStateName.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      alert("Successfully updated data")
      console.log(data);
      // if (data.success) {
      location.reload();
      // }
    });
};

let capatalise = (str) => {
  const words = str.split(" ");

  // console.log(words);
  // console.log(words);
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
