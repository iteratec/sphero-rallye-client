function aktionUebernehmen() {
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

  const aktionsWert = aktion.querySelector(".aktions-wert");

  if (aktionstyp === "ROLL") {
    const geschwindigkeit = document.createElement("input");
    geschwindigkeit.type = "number";
    geschwindigkeit.value = "0";

    const geschwindigkeitBeschreibung = document.createElement("p");
    geschwindigkeitBeschreibung.classList.add("aktions-einheit");
    geschwindigkeitBeschreibung.innerHTML = "Geschwindigkeit";

    const dauer = document.createElement("input");
    dauer.type = "number";
    dauer.value = "0";

    const dauerBeschreibung = document.createElement("p");
    dauerBeschreibung.classList.add("aktions-einheit");
    dauerBeschreibung.innerHTML = "Dauer";

    aktionsWert.appendChild(geschwindigkeit);
    aktionsWert.appendChild(geschwindigkeitBeschreibung);
    aktionsWert.appendChild(dauer);
    aktionsWert.appendChild(dauerBeschreibung);
    aktion.classList.add("ROLL");
  } else if (aktionstyp === "ROTATE") {
    const grad = document.createElement("input");
    grad.type = "number";
    grad.value = "0";

    const gradBeschreibung = document.createElement("p");
    gradBeschreibung.classList.add("aktions-einheit");
    gradBeschreibung.innerHTML = "Grad";

    aktionsWert.appendChild(grad);
    aktionsWert.appendChild(gradBeschreibung);
    aktion.classList.add("ROTATE");
  } else if (aktionstyp === "SET_RGB") {
    const farbe = document.createElement("input");
    farbe.type = "color";
    farbe.value = "#4CB944";

    const farbeBeschreibung = document.createElement("p");
    farbeBeschreibung.classList.add("aktions-einheit");

    aktionsWert.appendChild(farbe);
    aktionsWert.appendChild(farbeBeschreibung);
    aktion.classList.add("SET_RGB");
  }
}

function aktionZuruecksetzen(aktion) {
  const icon = aktion.querySelector("i");

  Object.keys(ICONS).forEach(function (key) {
    aktion.classList.remove(key);
    icon.classList.remove(ICONS[key]);
  });
  icon.classList.add("fa-puzzle-piece");

  aktion.querySelector(".aktions-wert").innerHTML = "";
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

    const aktionsWert = aktion.querySelector(`.aktions-wert.${aktionsTyp} > input`).value;

    let parameter = {};

    if (aktionsTyp === "ROLL") {
      parameter["speed"] = parseInt(aktionsWert);
      parameter["durationInSecs"] = 3;
    } else if (aktionsTyp === "ROTATE") {
      parameter["heading"] = parseInt(aktionsWert);
    } else if (aktionsTyp === "SET_RGB") {
      parameter["red"] = getRed(aktionsWert);
      parameter["green"] = getGreen(aktionsWert);
      parameter["blue"] = getBlue(aktionsWert);
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

  nachrichtSchicken(`spheroRallye/${spieler.toString()}/plannedActions`, geplanteAktionen);
}

function nachrichtSchicken(thema, nachricht) {
  client.publish(thema, JSON.stringify(nachricht), function (error) {
    if (error) {
      console.log(error);
    }
  });
}