const MQTT_URL = "ws://sphero.local:8000";
let client = null;
let spieler = null;

const ICONS = {
  "ROLL": "fa-angle-double-right",
  "ROTATE": "fa-sync-alt",
  "SET_RGB": "fa-paint-brush"
};

const AKTIONSTYP_BESCHREIBUNGEN = {
  "ROLL": "Fahren",
  "ROTATE": "Drehen",
  "SET_RGB": "Farbe ändern"
};

const AKTIONS_EINHEITEN = {
  "ROLL": "Geschwindigkeit",
  "ROTATE": "Grad",
  "SET_RGB": ""
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

  client.on("connect", function () {
    client.subscribe(`spheroRallye/${spieler.toString()}/possibleActionTypes`, function (error) {
      if (error) {
        console.log(error);
      }
    });

    client.subscribe("spheroRallye/roundEnd", function (error) {
      if (error) {
        console.log(error);
      }
    })
  });

  client.on("message", function (topic, message) {
    if (topic === "spheroRallye/roundEnd") {
      stoppuhrStarten(message);
    } else if (topic === `spheroRallye/${spieler.toString()}/possibleActionTypes`) {
      message = JSON.parse(message);
      verfuegbareAktionstypenAnzeigen(message);
    } else {
      console.error("This topic is not handled:");
      console.log(topic);
      console.log(message);
    }
  });
}

function stoppuhrStarten(rundenende) {
  const x = setInterval(function () {
    const verbleibendeSekunden = Math.round((Date.parse(rundenende.toString()) - Date.now()) / 1000);
    stoppuhrAnzeigen(verbleibendeSekunden);

    if (verbleibendeSekunden < 0) {
      clearInterval(x);
    }
  }, 1000);
}

function stoppuhrAnzeigen(sekunden) {
  const stoppuhr = document.querySelector("#stoppuhr-wert")
  stoppuhr.innerHTML = sekunden;
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

    const selector = (aktionsTyp === "SET_RGB") ? `.aktions-wert.${aktionsTyp} input` : `.aktions-wert.${aktionsTyp}`;
    const aktionsWert = aktion.querySelector(selector).value;

    let parameter = {};

    if (aktionsTyp === "ROLL") {
      parameter["speed"] = parseInt(aktionsWert);
      parameter["durationInSecs"] = 3;
    } else if (aktionsTyp === "ROTATE") {
      parameter["heading"] = parseInt(aktionsWert);
    } else if (aktionsTyp === "SET_RGB") {
      parameter["red"] = hexToRgb(aktionsWert).r;
      parameter["green"] = hexToRgb(aktionsWert).g;
      parameter["blue"] = hexToRgb(aktionsWert).b;
    }

    geplanteAktionen.push({
      "ActionType": aktionsTyp,
      "Config": parameter
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

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

styleCustomColorPicker();
eventsRegistrieren();
spielerAuswaehlenUndSpielBeitreten();
