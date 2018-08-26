const MQTT_URL = "ws://localhost:8080";

const ICONS = {
  "MOVE": "fa-forward",
  "TURN_AROUND": "fa-sync-alt",
  "SET_COLOR": "fa-lightbulb"
};

const AKTIONSTYP_BESCHREIBUNGEN = {
  "MOVE": "Fahren",
  "TURN_AROUND": "Drehen",
  "SET_COLOR": "Farbe ändern"
};

const AKTIONS_EINHEITEN = {
  "MOVE": "Geschwindigkeit",
  "TURN_AROUND": "Grad",
  "SET_COLOR": ""
};

function styleCustomColorPicker() {
  const colorPickers = document.querySelectorAll("input[type='color']");
  colorPickers.forEach(function (colorPicker) {
    const colorPickerWrapper = colorPicker.parentElement;
    colorPicker.onchange = function () {
      colorPickerWrapper.style.backgroundColor = colorPicker.value;
    };
    colorPickerWrapper.style.backgroundColor = colorPicker.value;
  });
}

function eventsRegistrieren() {
  document.querySelectorAll(".aktions-auswahl > select").forEach(function(element) {
    element.addEventListener("change", aktionSetzen)
  });
}

function spielerAuswaehlenUndSpielBeitreten() {
  const spielerAuswahl = document.querySelector("#spieler");
  spielerAuswahl.addEventListener("change", spielBeitreten);
}

function spielBeitreten() {
  console.log("spielBeitreten");
  const client  = mqtt.connect(MQTT_URL);
  client.on('connect', function () {
    const spieler = document.querySelector("#spieler").value;
    client.subscribe(`spheroRallye/${spieler.toString()}/possibleActionTypes`, function (err) {
      if (err) {
        console.log(err);
      }
    })
  });

  client.on('message', function (topic, message) {
    message = JSON.parse(message);
    console.log(message);
    verfuegbareAktionstypenAnzeigen(message);
  });
}

function verfuegbareAktionstypenAnzeigen(aktionstypen) {
  let verfuegbareAktionen = document.querySelector("ul.verfuegbare-aktionen");
  verfuegbareAktionen.innerHTML = "";

  aktionstypen.forEach(function (aktionstyp) {
    let li = document.createElement("li");
    li.classList.add("verfuegbare-aktion");

    let icon = document.createElement("i");
    icon.classList.add("fas", ICONS[aktionstyp.toString()]);
    li.appendChild(icon);

    let beschreibung = document.createElement("div");
    beschreibung.innerText = AKTIONSTYP_BESCHREIBUNGEN[aktionstyp.toString()];
    li.appendChild(beschreibung);

    verfuegbareAktionen.appendChild(li);
  });
}

function aktionSetzen() {
  const aktionstyp = this.value;
  const aktion = this.parentElement.parentElement;
  const icon = this.parentElement.previousElementSibling;

  aktionZuruecksetzen(aktion, icon);

  if (aktionstyp === "") {
    icon.classList.add("fa-puzzle-piece");
    return;
  }

  aktion.classList.add(aktionstyp);
  icon.classList.remove("fa-puzzle-piece");
  icon.classList.add(ICONS[aktionstyp]);
  aktion.querySelector(`.aktions-wert.${aktionstyp}`).style.display = "block";
  aktion.querySelector(".aktions-einheit").innerHTML = AKTIONS_EINHEITEN[aktionstyp];
}

function aktionZuruecksetzen(aktion, icon) {
  Object.keys(ICONS).forEach(function(key) {
    aktion.classList.remove(key);
    icon.classList.remove(ICONS[key]);
  });
  aktion.querySelectorAll(".aktions-wert").forEach(function(element) {
    element.style.display = "none";
  });
  aktion.querySelector(".aktions-einheit").innerHTML = "";
}

styleCustomColorPicker();
eventsRegistrieren();
spielerAuswaehlenUndSpielBeitreten();
