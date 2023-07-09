function onEdit() {
  document.getElementById("edit").setAttribute("hidden", true);
  document.getElementById("change-password-btn").setAttribute("hidden", true);
  document.getElementById("submit").removeAttribute("hidden");
  let inputElements = document.querySelectorAll("input");
  for (let i = 0; i < inputElements.length; i++) {
    const e = inputElements[i];
    if (e.id === "email") continue;
    if (e.id === "access-level") continue;

    e.removeAttribute("disabled");
  }
}

function onChangePassword() {
  document.getElementById("update-details-form").setAttribute("hidden", true);
  document.getElementById("change-password-form").removeAttribute("hidden");
}
