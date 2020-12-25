// Vuelve los valores a 0 y reinicia
function resetGame() {
  stopLoop = true;
  // control turnos y rondas
  playerTurn = 0;
  roundsDone = 0;
  turnsDone = 0;
  // control del camino elegido
  randNum = 0;
  stageCount = 0;
  userOption = "A";
  idProgres = `${stageCount}${userOption}`;

  userAction.innerHTML = "";

  // show or hide main buttons
  if (newOptionA.hidden === false && newOptionB.hidden === false) {

    newOptionA.hidden = true;
    newOptionB.hidden = true;

  };
  // show or hide start button
  if (start.hidden === false) {
    start.hidden = true;
  } else {
    start.hidden = false;

  }


}

// comienza el juego
function Start() {
  stopLoop = false;

  // show or hide start button
  if (start.hidden === false) {
    start.hidden = true;
  } else {
    start.hidden = false;

  }
  asignturn()
}