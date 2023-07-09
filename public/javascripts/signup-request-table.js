function showRequest(requestType) {
  fetch("/agent/signup-request-json/" + requestType)
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadRequestTableTable(data["data"], requestType);
    });
  //   loadStationTable([]);
  console.log("testing");
}

function loadRequestTableTable(data, requestType) {
  const table = document.querySelector("table tbody");

  let tableHtml = "";
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='4'>No Data</td></tr>";
    console.log("No Data");
    alert("No Data Found");
    return;
  }

  data.forEach(function ({
    request_agent_signup_id,
    email,
    username,
    first_name,
    last_name,
    phone_no,
    DOB,
    request_datetime,
    response_status,
    response_datetime,
    agent_email,
  }) {
    // zone_name = capatalise(zone_name);
    console.log(typeof request_datetime);
    // 	2022-03-10T08:23:13.000Z
    // console.log(new Date(request_datetime));
    let responseDatetime = null;
    let dateOfBirth = null;
    if (response_datetime)
      responseDatetime = new Date(response_datetime).toLocaleString();
    // if (DOB) dateOfBirth = new Date(DOB).toLocaleString();
    tableHtml += "<tr>";
    tableHtml += `<td data-id=${request_agent_signup_id}>${email}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${username}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${first_name}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${last_name}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${phone_no}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${DOB}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${new Date(
      request_datetime
    ).toLocaleString()}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${response_status}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${responseDatetime}</td>`;
    tableHtml += `<td data-id=${request_agent_signup_id}>${agent_email}</td>`;
    if (requestType === "pending" || response_status === "pending") {
      tableHtml += `<td><button class="approve-row-btn" data-id=${request_agent_signup_id}>Approve</button></td>`;
      tableHtml += `<td><button class="reject-row-btn" data-id=${request_agent_signup_id}>Reject</button></td>`;
    } else {
      tableHtml += `<td></td>`;
      tableHtml += `<td></td>`;
    }
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

// // To prevent default behaviour of form
// var submit_form = document.getElementById("zone-search-form");
// submit_form.onsubmit = function (e) {
//   e.preventDefault();
// };

const searchBtn = document.getElementById("search-btn");
function searchUsername() {
  const searchValue = document.getElementById("search-text").value;
  if (!searchValue) {
    alert("Search Box is epmty.");
    return;
  }
  console.log("searched for : " + searchValue);
  fetch("/agent/signup-request-json/search/" + searchValue)
    .then((res) => res.json())
    // .then((data) => console.log(data));
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      loadRequestTableTable(data["data"]);
    });
  console.log("submitterd");
  // alert("ABC")
}

const table = document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "reject-row-btn") {
      let isExecuted = confirm("Are you sure to reject?");
      // console.log(isExecuted);
      if (!isExecuted) return;
      rejectRowById(event.target.dataset.id);
    }

    if (event.target.className === "approve-row-btn") {
      let isExecuted = confirm("Are you sure to Approve?");
      // console.log(isExecuted);
      if (!isExecuted) return;
      approveRow(event.target.dataset.id);
    }
  });

function rejectRowById(id) {
  fetch("/agent/signup-request-json/reject/" + id, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      alert("Successfully rejected request");
      location.reload();
      // }
    })
    .catch((err) => {
      console.log(err.errorMessage);
      alert("Unable to reject request");
    });
  // .then((data) => {
  //   console.log(data["data"]);
  //   loadZoneTable(data["data"]);
  // });
}

function approveRow(id) {
  fetch("/agent/signup-request-json/approve/" + id, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.err);
        return;
      }
      console.log(data);
      alert("Successfully approved request");
      location.reload();
      // }
    })
    .catch((err) => {
      console.log(err.errorMessage);
      alert("Unable to approve request");
    });
}

let capatalise = (str) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (!words[i]) continue;
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};
