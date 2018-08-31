const MQTT_URL = "ws://sphero2.local:8000";
let client = null;
let spieler = null;

const ICONS = {
  "ROLL": "fa-angle-double-right",
  "ROTATE": "fa-sync-alt",
  "SET_RGB": "fa-paint-brush"
};

const AKTIONSTYP_BESCHREIBUNGEN = {
  "ROLL": "Fahren",
  "ROTATE": "Drehen",
  "SET_RGB": "Farbe ändern"
};

const AKTIONS_EINHEITEN = {
  "ROLL": "Geschwindigkeit",
  "ROTATE": "Grad",
  "SET_RGB": ""
};