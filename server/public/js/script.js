// control turnos y rondas
let stopLoop = false;
const totalRound = 8;    // numero de rondas
let roundsDone = 0;      // contador de rondas hechas
let turnsDone = 0;       // contador de turnos hechos
let timeTextValue = 0;

// control del camino elegido
let randNum = 0;         //  Tirada de dados
let stageCount = 0;      //  contador de nivel
let userOption = "A";    //  camino: A || B
// construye el ID, lo recibe el back y devuelve objeto con el camino
let userStage = "";
let idProgres = `${stageCount}${userOption}`;
let userTurn = "";

// Control de quien está jugando
let playerTurn = 0;
let playerBranch = `${stageCount}${userOption}`;

// Data consultada al server y guardada en variables
let gameScript;
//La lista se consulta en la base de datos
let userList = [];

const playList = document.getElementById("usersPlaying");
const playPanel = document.getElementById("show-players");
const userAction = document.getElementById("user-action");
const session = document.getElementById("OidSession");
const gameId = document.getElementById("gameId");


const newOptionA = document.getElementById("A");
const newOptionB = document.getElementById("B");
const reset = document.getElementById("resetbtn");
const start = document.getElementById("startbtn");

let usersConfirm = [];
//GET a /users.
window.addEventListener("load", () => {
  const requestUser = new XMLHttpRequest();

  requestUser.addEventListener("load", function () {
    if (this.status == 200) {
      let objSession = JSON.parse(this.responseText);
      userList = objSession.users

      usersConfirm = userList.filter(e => e.name !== "")

      if (reset.hidden === true && start.hidden === true) {
        reset.hidden = false;
        start.hidden = false;
      };

      //showPlayers();
    }
  });


  // Consulto la lista de jugadores
  requestUser.open("GET", "/ingame/game-session?idSession=" + session.textContent);
  requestUser.send();

});


// Tirada de dados de 6 caras, 
function funcDados() {
  const dialogContainer = document.getElementById("dialog-container");
  randNum = Math.floor(Math.random() * 6) + 1;
  const diceResult = document.createElement("p");

  if (randNum > 3) {
    diceResult.classList.add("dice-result-success")
    diceResult.textContent = `Tiras los dados: ${randNum} - Salió con éxito`;

  } else {

    diceResult.classList.add("dice-result-fail")
    diceResult.textContent = `Tiras los dados: ${randNum} - No salió bien la acción`;
  }


  dialogContainer.appendChild(diceResult);
};


function asignturn() {
  if (stopLoop) {
    console.log("Se terminaron las rondas");

    userAction.innerHTML = "";

    if (start.hidden === true) {
      start.hidden = false;
    };

    return;
  }

  // Control de numero de rondas
  if (roundsDone <= totalRound) {

    // Muestra los botones de acción
    userTurn = usersConfirm[turnsDone].name;

    buttonDisplay();

    timeTextValue = 0;
    showTimer();


    // Tiempo de espera, momento del jugador para apretar un botón de acción
    let timeOut = setTimeout(function () {
      turnsDone++;

      // Si es true, empieza una ronda nueva.
      if (turnsDone == usersConfirm.length) {
        roundsDone++
        turnsDone = 0;
      }

      // Se vuelve a ejecutar la funcion creando un loop
      asignturn();

    }, 21000)


    if (stopLoop) {
      clearTimeout(timeOut);
    }

  } else {
    stopLoop = true;

  }

}


function showTimer() {
  let time = document.getElementById("timer")
  time.textContent = `Tiempo: ${timeTextValue}`;

  let timeText = setTimeout(function () {
    timeTextValue++;

    if (timeTextValue >= 20) {
      time.textContent = `Tiempo: ${timeTextValue}`;
      clearTimeout(timeText);

    } else {
      showTimer();

    }
  }, 1000)

}


function showPlayers() {
  for (i = 0; i < usersConfirm.length; i++) {

    const newPlayer = document.createElement("div");

    newPlayer.classList.add("player-name");
    newPlayer.innerHTML = usersConfirm[i].name;
    playPanel.appendChild(newPlayer);

  }

}