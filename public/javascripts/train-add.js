document.addEventListener("DOMContentLoaded", function () {
  // fetch("/agent/all-stations/JSON")
  // let trainTypeList = document.querySelectorAll("#zonesName");

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

const trainAddForm = document.getElementById("train-add-form");
trainAddForm.addEventListener("submit", handleFormSubmit);

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
    if (data.error == true) alert(data.err);
    else alert("Successfully submitted data");
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

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
