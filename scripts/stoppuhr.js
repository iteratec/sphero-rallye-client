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

function stoppuhrAnzeigen(sekunden) {
  const stoppuhrAnker = document.querySelector("#stoppuhr-wert");
  stoppuhrAnker.innerHTML = sekunden;
}