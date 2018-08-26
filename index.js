const MQTT_URL = "ws://localhost:8080";
let client = null;
let spieler = null;

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
  document.querySelectorAll(".aktions-auswahl").forEach(function (element) {
    element.addEventListener("change", aktionSetzen)
  });

  document.querySelector("#alle-aktionen-zuruecksetzen")
    .addEventListener("click", alleAktionenZuruecksetzen);

  document.querySelector("#abschicken")
    .addEventListener("click", geplanteAktionenAbschicken)
}

function spielerAuswaehlenUndSpielBeitreten() {
  const spielerAuswahl = document.querySelector("#spieler");
  spielerAuswahl.addEventListener("change", spielBeitreten);
}

function spielBeitreten() {
  client  = mqtt.connect(MQTT_URL);
  spieler = document.querySelector("#spieler").value;

  client.on('connect', function () {
    client.subscribe(`spheroRallye/${spieler.toString()}/possibleActionTypes`, function (error) {
      if (error) {
        console.log(error);
      }
    })
  });

  client.on('message', function (topic, message) {
    message = JSON.parse(message);
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
  const aktion = this.parentElement;
  const icon = aktion.querySelector("i");

  aktionZuruecksetzen(aktion);

  if (aktionstyp === "") {
    return;
  }

  aktion.classList.add(aktionstyp);
  icon.classList.remove("fa-puzzle-piece");
  icon.classList.add(ICONS[aktionstyp]);
  aktion.querySelector(`.aktions-wert.${aktionstyp}`).style.display = "block";
  aktion.querySelector(".aktions-einheit").innerHTML = AKTIONS_EINHEITEN[aktionstyp];
}

function aktionZuruecksetzen(aktion) {
  const icon = aktion.querySelector("i");

  Object.keys(ICONS).forEach(function (key) {
    aktion.classList.remove(key);
    icon.classList.remove(ICONS[key]);
  });
  icon.classList.add("fa-puzzle-piece");
  aktion.querySelectorAll(".aktions-wert").forEach(function (element) {
    element.style.display = "none";
  });
  aktion.querySelector(".aktions-einheit").innerHTML = "";
}

function alleAktionenZuruecksetzen() {
  document.querySelectorAll(".aktion").forEach(function (aktion) {
    aktionZuruecksetzen(aktion);
    aktion.querySelector(".aktions-auswahl").value = "";
  });
}

function geplanteAktionenAbschicken() {
  let geplanteAktionen = [];

  document.querySelectorAll(".aktion").forEach(function (aktion) {
    const aktionsTyp = aktion.querySelector(".aktions-auswahl").value;

    if (!aktionsTyp) {
      return;
    }

    const aktionsWert = aktion.querySelector(`.${aktionsTyp}`).value;
    geplanteAktionen.push({
      "actionType": aktionsTyp,
      "value": aktionsWert
    });

  });

  if (client === null) {
    alert("Es muss ein Spieler ausgewählt sein.");
    return;
  }

  if (geplanteAktionen.length < 5) {
    alert("Es müssen alle 5 Aktionen ausgefüllt sein.");
    return;
  }

  client.publish(`spheroRallye/${spieler.toString()}/plannedActions`, JSON.stringify(geplanteAktionen), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

styleCustomColorPicker();
eventsRegistrieren();
spielerAuswaehlenUndSpielBeitreten();
