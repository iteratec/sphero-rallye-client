function wennVerbunden(callback) {
  client.on("connect", callback);
}

function aufNachrichtenHoeren(topic) {
  client.subscribe(topic, function (error) {
    if (error) {
      console.log(error);
    }
  });
}

function wennNachrichtAngekommen(callback) {
  client.on("message", callback);


  client.on("message", function (topic, message) {
    if (topic === "spheroRallye/roundEnd") {
      alleAktionenZuruecksetzen();
      document.querySelector(".stoppuhr").style.opacity = "100";
    }
  });

  const player = document.querySelector("#spieler").value.toString();
  client.on("message", function (topic, message) {
    if (topic === `spheroRallye/${player}/errors`) {
      console.error(`Error for ${player}:`);
      console.log(message);
    }
  });
}

function alleElementeMitKlasse(selector) {
  return document.querySelectorAll(`.${selector}`);
}

function wertVon(parent, selector) {
  return parseInt(parent.querySelector(`.${selector}`).value);
}

function validateActionTypeSelection() {
  const actionType = this.value.toString();

  if (actionType === "") {
    return;
  }

  const available = document.querySelectorAll(`.verfuegbare-aktionen .${actionType}`).length;
  const selected = document.querySelectorAll(`.geplante-aktionen .aktion.${actionType}`).length;

  if (available < selected) {
    aktionZuruecksetzen(this.parentElement);
    this.parentElement.querySelector(".aktions-auswahl").value = "";
    alert("Dieser Aktionstyp ist nicht mehr verfügbar");
  }
}

function modifyAvailableActionTypes() {
  const actionType = this.value.toString();
  const id = this.parentElement.id;
  const selected = document.querySelector(`.verfuegbare-aktionen li.ausgewaehlt.${id}`);
  const available = document.querySelector(`.verfuegbare-aktionen li:not(.ausgewaehlt).${actionType}`);

  if (selected) {
    selected.classList.remove("ausgewaehlt", id);
  }

  if (available) {
    available.classList.add("ausgewaehlt", id);
  }
}

function registerColorizeHandler() {
  const actionType = this.value.toString();

  if (actionType !== "SET_RGB") {
    return;
  }

  this.parentElement.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("change", colorizeSetRgbAction);
  });
}

function colorizeSetRgbAction() {
  const action = this.parentElement.parentElement;
  const red = parseInt(action.querySelector(".rot").value);
  const green = parseInt(action.querySelector(".gruen").value);
  const blue = parseInt(action.querySelector(".blau").value);

  action.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
}
