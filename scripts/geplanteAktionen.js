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




// So muss die Nachricht aussehen die ihr zum Spiel schicken könnt:

// [
//   {
//     "ActionType": "ROLL",
//     "Config": {
//       "speed": 10,
//       "durationInSecs": 3
//     }
//   },
//   {
//     "ActionType": "ROTATE",
//     "Config": {
//       "heading": 180
//     }
//   },
//   {
//     "ActionType": "SET_RGB",
//     "Config": {
//       "red": 100,
//       "green": 255,
//       "blue": 50
//     }
//   }
// ]

// Beschreibung:
//
// var geschwindigkeit = wertVon(aktion, "geschwindigkeit");
//
// parameter["speed"] = geschwindigkeit;
//
// nachrichtSchicken(thema, nachricht);


function geplanteAktionenAbschicken() {
  var geplanteAktionen = [];

  alleElementeMitKlasse("aktion").forEach(function (aktion) {
    var aktionsTyp = aktion.querySelector(".aktions-auswahl").value;

    var parameter = {};

    if (aktionsTyp === "ROLL") {  // ROLLEN

      // <input class="geschwindigkeit" type="number">
      // <input class="dauer" type="number">

      // HIER KÖNNT IHR EUREN CODE SCHREIBEN





    } else if (aktionsTyp === "ROTATE") {  // DREHEN

      // <input class="grad" type="number">

      // HIER KÖNNT IHR EUREN CODE SCHREIBEN






    } else if (aktionsTyp === "SET_RGB") {  // FARBE SETZEN

      // <input class="rot" type="number">
      // <input class="gruen" type="number">
      // <input class="blau" type="number">

      // HIER KÖNNT IHR EUREN CODE SCHREIBEN






    }

    geplanteAktionen.push({
      "ActionType": aktionsTyp,
      "Config": parameter
    });

  });


  if (client === null) {
    console.log("Es muss ein Spieler ausgewählt sein.");
    return;
  }

  if (geplanteAktionen.length < 5) {
    console.log("Es müssen alle 5 Aktionen ausgefüllt sein.");
    return;
  }


  // HIER KÖNNT IHR DIE NACHRICHT ZUM SPIEL SCHICKEN:


}

function nachrichtSchicken(thema, nachricht) {
  client.publish(thema, JSON.stringify(nachricht), function (error) {
    if (error) {
      console.log(error);
    }
  });
}