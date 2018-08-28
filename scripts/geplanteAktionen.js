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