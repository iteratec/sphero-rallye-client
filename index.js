MQTT_URL = "ws://localhost:8080";

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
  });
}
verbinden();