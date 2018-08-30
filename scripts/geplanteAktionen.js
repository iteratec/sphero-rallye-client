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
    geschwindigkeit.classList.add("geschwindigkeit");

    const geschwindigkeitBeschreibung = document.createElement("p");
    geschwindigkeitBeschreibung.classList.add("aktions-einheit");
    geschwindigkeitBeschreibung.innerHTML = "Geschwindigkeit";

    const dauer = document.createElement("input");
    dauer.type = "number";
    dauer.value = "0";
    dauer.classList.add("dauer");

    const dauerBeschreibung = document.createElement("p");
    dauerBeschreibung.classList.add("aktions-einheit");
    dauerBeschreibung.innerHTML = "Dauer";

    aktion.classList.add("ROLL");
    aktionsWert.classList.add("ROLL");
    aktionsWert.appendChild(geschwindigkeit);
    aktionsWert.appendChild(geschwindigkeitBeschreibung);
    aktionsWert.appendChild(dauer);
    aktionsWert.appendChild(dauerBeschreibung);
  } else if (aktionstyp === "ROTATE") {
    const grad = document.createElement("input");
    grad.type = "number";
    grad.value = "0";
    grad.classList.add("grad");

    const gradBeschreibung = document.createElement("p");
    gradBeschreibung.classList.add("aktions-einheit");
    gradBeschreibung.innerHTML = "Grad";

    aktion.classList.add("ROTATE");
    aktionsWert.classList.add("ROTATE");
    aktionsWert.appendChild(grad);
    aktionsWert.appendChild(gradBeschreibung);
  } else if (aktionstyp === "SET_RGB") {
    const farben = {
      "rot": "Rot",
      "gruen": "Grün",
      "blau": "Blau"
    };

    Object.keys(farben).forEach(function (farbe) {
      const eingabe = document.createElement("input");
      eingabe.type = "number";
      eingabe.value = "0";
      eingabe.classList.add(farbe);

      const beschreibung = document.createElement("p");
      beschreibung.classList.add("aktions-einheit");
      beschreibung.innerHTML = farben[farbe];

      aktionsWert.appendChild(eingabe);
      aktionsWert.appendChild(beschreibung);
    });

    aktion.classList.add("SET_RGB");
    aktionsWert.classList.add("SET_RGB");
  }
}

function aktionZuruecksetzen(aktion) {
  const icon = aktion.querySelector("i");

  Object.keys(ICONS).forEach(function (key) {
    aktion.classList.remove(key);
    aktion.querySelector(".aktions-wert").classList.remove(key);
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

    let parameter = {};

    if (aktionsTyp === "ROLL") {
      const geschwindigkeit = aktion.querySelector(".geschwindigkeit").value;
      const dauer = aktion.querySelector(".dauer").value;

      parameter["speed"] = parseInt(geschwindigkeit);
      parameter["durationInSecs"] = parseInt(dauer);
    } else if (aktionsTyp === "ROTATE") {
      const grad = aktion.querySelector(".grad").value;

      parameter["heading"] = parseInt(grad);
    } else if (aktionsTyp === "SET_RGB") {
      const rot = aktion.querySelector(".rot").value;
      const gruen = aktion.querySelector(".gruen").value;
      const blau = aktion.querySelector(".blau").value;

      parameter["red"] = parseInt(rot);
      parameter["green"] = parseInt(gruen);
      parameter["blue"] = parseInt(blau);
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