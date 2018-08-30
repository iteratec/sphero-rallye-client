function wennVerbunden(callback) {
  client.on("connect", callback);
}

function aufNachrichtenHoeren(topic) {
  client.subscribe(topic, function (error) {
    if (error) {
      console.log(error);
    }
  });
}

function wennNachrichtAngekommen(callback) {
  client.on("message", callback);

  const player = document.querySelector("#spieler").value.toString();
  client.on("message", function (topic, message) {
    if (topic === `spheroRallye/${player}/errors`) {
      console.error(`Error for ${player}:`);
      console.log(message);
    }
  });
}

function getRed(farbe) {
  return hexToRgb(farbe).r;
}

function getGreen(farbe) {
  return hexToRgb(farbe).g;
}

function getBlue(farbe) {
  return hexToRgb(farbe).b;
}

function validateActionTypeSelection() {
  const actionType = this.value.toString();

  if (actionType === "") {
    return;
  }

  const available = document.querySelectorAll(`.verfuegbare-aktionen .${actionType}`).length;
  const selected = document.querySelectorAll(`.geplante-aktionen .aktion.${actionType}`).length;

  if (available < selected) {
    aktionZuruecksetzen(this.parentElement);
    this.parentElement.querySelector(".aktions-auswahl").value = "";
    alert("Dieser Aktionstyp ist nicht mehr verfügbar");
  }
}

function modifyAvailableActionTypes() {
  const actionType = this.value.toString();
  const id = this.parentElement.id;

  if (actionType === "") {
    const selected = document.querySelector(`.verfuegbare-aktionen li.ausgewaehlt.${id}`);
    if (selected) {
      selected.classList.remove("ausgewaehlt", id);
    }
  } else {
    const available = document.querySelector(`.verfuegbare-aktionen li:not(.ausgewaehlt).${actionType}`);
    if (available) {
      available.classList.add("ausgewaehlt", id);
    }
  }
}

function styleCustomColorPicker() {
  const colorPickers = document.querySelectorAll(".aktions-wert > input[type='color']");
  colorPickers.forEach(function (colorPicker) {
    const colorPickerWrapper = colorPicker.parentElement;
    colorPickerWrapper.style.backgroundColor = colorPicker.value;

    colorPicker.addEventListener("change", function () {
      colorPickerWrapper.style.backgroundColor = colorPicker.value;
    });
  });
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
