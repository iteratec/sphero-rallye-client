//
// Mit den folgenden Funktionen könnt ihr dem Spiel beitreten, auf Nachrichten hören und
// eure verfügbaren Spielzüge anzeigen lassen:
//
// - "wennVerbunden()": Führt eine Funktion aus wenn ihr euch mit dem Spiel verbunden habt.
//                      Zum Beispiel:
//
//                      wennVerbunden(function () {
//                        console.log("Hallo Welt!")
//                      });
//
// - "aufNachrichtenHoeren()": Hört in einem Thema auf alle Nachrichten die darin geschrieben werden.
//                             Zum Beispiel:
//
//                             aufNachrichtenHoeren("spheroRallye/player1/possibleActionTypes");
//
// - "wennNachrichtAngekommen()": Führt eine Funktion aus, wenn in einem Thema auf das ihr hört, eine Nachricht
//                                geschrieben wird.
//                                Zum Beispiel:
//
//                                wennNachrichtAngekommen(function (thema, nachricht) {
//                                  console.log(`Das Thema ist: ${thema}`);
//                                  console.log(`Die Nachricht lautet: ${nachricht}`);
//                                };
//
// - "stoppuhrStarten()": Startet die Stoppuhr wenn man eine Nachricht aus dem Thema "spheroRallye/roundEnd" bekommt
//                        und der Funktion übergibt.
//
// - "verfuegbareAktionstypenAnzeigen()": Zeigt die verfügbaren Karten eines Spielers für eine Runde an, wenn man
//                                        auf das Thema "possibleActionTypes" des Spielers hört.
//
//
// Damit ihr dem Spiel Beitreten könnt, müsst ihr auf Nachrichten hören wenn ihr mit dem Spiel verbunden seid.
// Außerdem müsst ihr die verfügbaren Aktionstypen anzeigen wenn Nachrichten angekommen sind und
// könnt dann auch die Stoppuhr starten.




function spielBeitreten() {
  client = mqtt.connect(MQTT_URL);
  spieler = document.querySelector("#spieler").value;

  wennVerbunden(function () {
    aufNachrichtenHoeren(`spheroRallye/${spieler.toString()}/possibleActionTypes`);
    aufNachrichtenHoeren("spheroRallye/roundEnd");
  });

  wennNachrichtAngekommen(function (thema, nachricht) {
    if (thema === "spheroRallye/roundEnd") {
      stoppuhrStarten(nachricht);
    } else if (thema === `spheroRallye/${spieler.toString()}/possibleActionTypes`) {
      verfuegbareAktionstypenAnzeigen(nachricht);
    }
  });
}
