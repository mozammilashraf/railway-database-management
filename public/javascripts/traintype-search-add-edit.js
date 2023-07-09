//! Insertion Related functions
const template = document.querySelector(".form-input-row ").outerHTML;

const trainTypeForm = document.getElementById("traintype-form");
trainTypeForm.addEventListener("submit", handleFormSubmit);

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
    else {
      alert("Successfully submitted data");
    }
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
function showAllTrainType() {
  fetch("/agent/traintype/all/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadTrainTypeTable(data["data"]);
    });
  //   loadStationTable([]);
  console.log("testing");
}

function loadTrainTypeTable(data) {
  const table = document.querySelector("table tbody");

  let tableHtml = "";
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";
    console.log("No Data");
    alert("No Data Found");
  }

  data.forEach(function ({ train_type_id, train_type_name, train_type_code }) {
    train_type_name = capatalise(train_type_name);
    tableHtml += "<tr>";
    tableHtml += `<td data-id=${train_type_id}>${train_type_name}</td>`;
    tableHtml += `<td data-id=${train_type_id}>${train_type_code}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${train_type_id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${train_type_id}>Edit</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

// To prevent default behaviour of form
var submit_form = document.getElementById("traintype-search-form");
submit_form.onsubmit = function (e) {
  e.preventDefault();
};

const searchBtn = document.getElementById("search-btn");
function searchTrainType() {
  const searchValue = document.getElementById("search-text").value;
  if (!searchValue) {
    alert("Search Box is epmty.");
    return;
  }
  console.log("searched for : " + searchValue);
  fetch("/agent/traintype/" + searchValue.toLowerCase())
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadTrainTypeTable(data["data"]);
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
  fetch("/agent/traintype/delete/" + id, {
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
    });
  // .then((data) => {
  //   console.log(data["data"]);
  //   loadtraintypeTable(data["data"]);
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
  document.getElementById("update-traintype-name-input").dataset.id = id;
  document.getElementById("update-traintype-name-input").value = tempArray[0];
  document.getElementById("update-traintype-code-input").dataset.id = id;
  document.getElementById("update-traintype-code-input").value = tempArray[1];
  // updateSection.dataset.id = id;
}

const updateBtn = document.getElementById("update-row-btn");
updateBtn.onclick = function () {
  const newTrainTypeName = document.getElementById(
    "update-traintype-name-input"
  );
  const newTrainTypeCode = document.getElementById(
    "update-traintype-code-input"
  );

  // console.log(newtraintypeName.dataset.id);
  fetch("/agent/traintype/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      trainTypeID: newTrainTypeName.dataset.id,
      newTrainTypeName: newTrainTypeName.value,
      newTrainTypeCode: newTrainTypeCode.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error == true) alert(data.err + "Error");
      else {
        alert("Successfully Updated data");
        location.reload();
      }
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
