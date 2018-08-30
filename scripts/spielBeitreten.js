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
