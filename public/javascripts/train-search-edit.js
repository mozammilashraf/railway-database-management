document.addEventListener("DOMContentLoaded", function () {
  fetch("/agent/classtype/all/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadClassTypeList(data["data"]);
    })
    .then(() => {
      fetch("/agent/traintype/all/JSON")
        .then((res) => res.json())
        // .then((data) => console.log(data));
        .then((data) => {
          if (data.error) {
            alert(data.err);
            return;
          }
          console.log(data);
          loadTrainTypeList(data["data"]);
        })
        .catch((err) => {
          // res.json({ data: {}, err: err.message, error: true });
          console.log(err);
          alert("Unable to retrive train type data.");
        });
    })
    .catch((err) => {
      // res.json({ data: {}, err: err.message, error: true });
      console.log(err);
      alert("Unable to retrive class type data.");
    });
});
function loadClassTypeList(data) {
  let classTypeList = document.querySelectorAll("#class-type");
  // console.log(statesList);
  let classTypeListHtml = ""; //`<input type="hidden" name="class-type-name" value="0" />`;
  if (data.length === 0) {
    console.log("No Class Type Data");
  }
  for (let index = 0; index < classTypeList.length; index++) {
    data.forEach(function ({ class_type_id, class_type_name }) {
      // state_name = capatalise(state_name);
      classTypeListHtml += `<li>
      <input type="checkbox" name="class-type-name" id="${class_type_name}" value="${class_type_id}" />
      <label for="${class_type_name}">${class_type_name}</label>
      </li>`;
      // <input type="hidden" name="${class_type_id}" value="false" />
    });
    classTypeList[index].innerHTML = classTypeListHtml;
  }
}
function loadTrainTypeList(data) {
  let trainTypeList = document.querySelectorAll("#train-type");
  let trainTypeListHtml = "";
  if (data.length === 0) {
    console.log("No Train Type Data");
  }
  for (let index = 0; index < trainTypeList.length; index++) {
    data.forEach(function ({ train_type_id, train_type_name }) {
      // state_name = capatalise(state_name);
      // console.log("Train type NAME : " + train_type_name);
      trainTypeListHtml += `<option value="${train_type_id}">${train_type_name} </option>`;
    });
    trainTypeList[index].innerHTML = trainTypeListHtml;
  }
}

function validateForm() {
  var dayCheckboxs = document.getElementsByName("day");
  var classTypeCheckboxs = document.getElementsByName("class-type-name");
  // console.log(dayCheckboxs);
  // console.log(classTypeCheckboxs);

  var okayDay = true;
  var okayClassType = false;
  // for (let i = 0, l = dayCheckboxs.length; i < l; i++) {
  //   if (dayCheckboxs[i].checked) {
  //     okayDay = true;
  //     break;
  //   }
  // }
  for (let i = 0, l = classTypeCheckboxs.length; i < l; i++) {
    if (classTypeCheckboxs[i].checked) {
      okayClassType = true;
      break;
    }
  }
  if (!okayDay) {
    alert("Choose atleast one day!");
    // dayCheckboxs[0].setCustomValidity("Check atleast one day");
    return false;
  } else if (!okayClassType) {
    alert("Choose atleast on class type!");
    return false;
  }
  let trainTypeList = document.getElementById("train-type");
  if (!trainTypeList.value) {
    alert("No train type selected!");
    return false;
  }

  return true;
}

const trainUpdateForm = document.getElementById("train-update-form");
trainUpdateForm.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  let isExecuted = confirm("Are you sure to submit this form?");
  if (!isExecuted) return;

  const form = event.currentTarget;
  const url = form.action;

  try {
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({ url, formData });
    let data = responseData;
    console.log(data);
    if (data.error == true) {
      alert(data.err);
      return;
    }
    alert("Successfully submitted data");
    const updateSection = document.getElementById("update-section");
    updateSection.hidden = true;
  } catch (error) {
    console.error(error);
    alert("Unable To Submit Data");
  }
}

async function postFormDataAsJson({ url, formData }) {
  // console.log(...formData);
  let tempObject = {};

  for (var [key, value] of formData.entries()) {
    // console.log(key, value);

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

  // console.table(classData);

  // console.log(trainData);

  // trainData.forEach((element) => {
  //   console.log(element);
  // });

  for (let index = 0; index < trainData.length; index++) {
    const days = [];
    const train = trainData[index];
    console.log(train);
    train_name = capatalise(train.train_name);
    tableHtml += "<tr>";
    tableHtml += `<td data-id='${train.train_id}'>${train.train_no}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.return_train_no}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.train_name}</td>`;

    if (train.sunday == 1) days.push("Sun");
    if (train.monday == 1) days.push("Mon");
    if (train.tuesday == 1) days.push("Tue");
    if (train.wednesday == 1) days.push("Wed");
    if (train.thursday == 1) days.push("Thur");
    if (train.friday == 1) days.push("Fri");
    if (train.saturday == 1) days.push("Sat");

    tableHtml += `<td data-id='${train.train_id}'>${days}</td>`;
    tableHtml += `<td data-id='${train.train_id}'>${train.train_type_name}</td>`;

    const classes = classData.find(
      (ele) => ele.trainID === train.train_id
    ).classesID;
    tableHtml += `<td data-id='${train.train_id}'>${classes}</td>`;

    tableHtml += `<td><button class="edit-row-btn" data-id='${train.train_id}'>Edit</button></td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id='${train.train_id}'>Delete</button></td>`;

    // tableHtml += `<td data-id='${train_id}'>${train_code}</td>`;
    // tableHtml += `<td data-id='${train_id}'>${state_name}</td>`;
    // tableHtml += `<td data-id='${train_id}'>${zone_name} / ${zone_code}</td>`;
    // tableHtml += `<td><button class="delete-row-btn" data-id='${train_id}'>Delete</button></td>`;
    // tableHtml += `<td><button class="edit-row-btn" data-id='${train_id}'>Edit</button></td>`;
    tableHtml += "</tr>";
  }
  //   train_id,
  //   train_no,
  //   return_train_no,
  //   train_name,
  //   runs_on,
  //   train_type,
  //   has_classes,
  //   has_pantry,
  // }) {
  //   // console.log(train_id);
  //   train_name = capatalise(train_name);
  //   tableHtml += "<tr>";
  //   tableHtml += `<td data-id='${train_id}'>${train_name}</td>`;
  //   tableHtml += `<td data-id='${train_id}'>${train_code}</td>`;
  //   tableHtml += `<td data-id='${train_id}'>${state_name}</td>`;
  //   tableHtml += `<td data-id='${train_id}'>${zone_name} / ${zone_code}</td>`;
  //   tableHtml += `<td><button class="delete-row-btn" data-id='${train_id}'>Delete</button></td>`;
  //   tableHtml += `<td><button class="edit-row-btn" data-id='${train_id}'>Edit</button></td>`;
  //   tableHtml += "</td>";
  // });

  table.innerHTML = tableHtml;
}

const searchBtn = document.getElementById("search-btn");
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
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadTrainTable(data);
    });
  console.log("submitterd");
  // alert("ABC")
}

function showAllTrain() {
  fetch("/agent/train/all/JSON")
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      // console.log(data);
      loadTrainTable(data);
    });
  //   loadStationTable([]);
  console.log("testing");
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
  fetch("/agent/train/delete/" + id, {
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
      console.log(err);
      alert("Unable to deleted data");
    });
  // .then((data) => {
  //   console.log(data["data"]);
  //   loadZoneTable(data["data"]);
  // });
}

function handleEditRow(id) {
  const updateSection = document.getElementById("update-section");
  updateSection.hidden = false;
  console.log(id);
  document.getElementById("submit-btn").dataset.id = id;
  let temp = document.querySelectorAll(`[data-id='${id}']`);
  let tempArray = [];
  for (var [key, value] of temp.entries()) {
    // console.log(key, value);
    if (value.tagName == "TD") {
      tempArray.push(value.innerHTML);
    }
  }

  console.log(temp.values);
  document.getElementById("train-id").value = id;
  document.getElementById("new-train-number").value = tempArray[0];
  document.getElementById("new-return-train-number").value = tempArray[1];
  document.getElementById("new-train-name").value = tempArray[2];
  updateSection.dataset.id = id;
}

// const updateBtn = document.getElementById("update-row-btn");
// updateBtn.onclick = function () {
//   const newZoneName = document.getElementById("update-zone-name-input");
//   const newZoneCode = document.getElementById("update-zone-code-input");

//   // console.log(newZoneName.dataset.id);
//   fetch("/agent/train/update", {
//     method: "PATCH",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify({
//       zoneID: newZoneName.dataset.id,
//       newZoneName: newZoneName.value,
//       newZoneCode: newZoneCode.value,
//     }),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.error) {
//         alert(data.err);
//         return;
//       }
//       console.log(data);
//       alert("Successfully updated data");
//       location.reload();
//       // }
//     });
// };

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
