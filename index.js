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

function spielerAuswaehlen() {
  const spielerAuswahl = document.querySelector("#spieler");
  spielerAuswahl.addEventListener("change", verbinden);
}

function verbinden() {
  console.log("verbinden");
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

spielerAuswaehlen();