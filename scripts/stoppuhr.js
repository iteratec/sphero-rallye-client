//
//
// Die Funktion "stoppuhrStarten" wird in der Datei "spielBeitreten.js" benutzt um die Stoppuhr zu starten
// wenn eine Nachricht in dem Thema "spheroRallye/roundEnd" geschrieben wird.
//
// Damit die Stoppuhr startet muss sie hier erst einmal programmiert werden.
// Dazu sollt ihr zwei Funktionen programmieren. Eine Funktion die die Stoppuhr startet und eine Funktion
// die die Stoppuhr auf der Webseite anzeigt.


let stoppuhr;

function stoppuhrStarten(rundenende) {
  clearInterval(stoppuhr);
  const ende = Date.parse(rundenende.toString());

  stoppuhr = setInterval(function () {
    const verbleibendeSekunden = Math.round((ende - Date.now()) / 1000);
    stoppuhrAnzeigen(verbleibendeSekunden);

    if (verbleibendeSekunden < 0) {
      clearInterval(stoppuhr);
      stoppuhrAnzeigen(0);
    }
  }, 1000);
}




// Damit der Wert der verbleibenden Sekunden auf der Webseite angezeigt werden,
// müsst ihr diese in das richtige Element schreiben.
// Ein Element auf der Webseite könnt ihr auswählen, indem ihr schreibt:
//
//   const element = document.querySelector("#identifikator");
//
// wenn das Element die Beschreibung id="identifikator" hat.
//
// Um Text auf die Webseite zu schreiben, kann man folgendes nutzen:
//
//   element.innerHTML = "Dieser Text soll auf die Webseite"


function stoppuhrAnzeigen(sekunden) {
  const stoppuhrAnker = document.querySelector("#stoppuhr-wert");
  stoppuhrAnker.innerHTML = sekunden;
}