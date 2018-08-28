function stoppuhrStarten(rundenende) {
  const x = setInterval(function () {
    const verbleibendeSekunden = Math.round((Date.parse(rundenende.toString()) - Date.now()) / 1000);
    stoppuhrAnzeigen(verbleibendeSekunden);

    if (verbleibendeSekunden < 0) {
      clearInterval(x);
    }
  }, 1000);
}

function stoppuhrAnzeigen(sekunden) {
  const stoppuhr = document.querySelector("#stoppuhr-wert");
  stoppuhr.innerHTML = sekunden;
}