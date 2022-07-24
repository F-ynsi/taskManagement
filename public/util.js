function addAlert(parentElement, type, message) {
    const alert = document.createElement("div");
    alert.className = type
    alert.role = "alert"
    alert.innerHTML = message
    parentElement.innerHTML = ""
    parentElement.className = "d-flex justify-content-center mt-4 card-body"
    parentElement.appendChild(alert)
}

function success(buttonId) {
    if(event.target.value==="") {
        document.getElementById(buttonId).disabled = true;
    } else {
        document.getElementById(buttonId).disabled = false;
    }
}
