MQTT_URL = "ws://localhost:8080";

ICONS = {
  "MOVE": "fa-forward",
  "TURN_AROUND": "fa-sync-alt",
  "SET_COLOR": "fa-lightbulb"
};

AKTIONSTYP_BESCHREIBUNGEN = {
  "MOVE": "Fahren",
  "TURN_AROUND": "Drehen",
  "SET_COLOR": "Farbe ändern"
};

function verbinden() {
  const client  = mqtt.connect(MQTT_URL);
  client.on('connect', function () {
    client.subscribe('spheroRallye/player1/possibleActionTypes', function (err) {
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

verbinden();