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
let idProgres = `${stageCount}${userOption}`;
let userTurn = "";

// Control de quien está jugando
let playerTurn = 0;
let playerBranch = `${stageCount}${userOption}`;

// Data consultada al server y guardada en variables
let gameScript;
//La lista se consulta en la base de datos
let userList=[];

const playList = document.getElementById("usersPlaying");
const playPanel = document.getElementById("show-players");
const userAction = document.getElementById("user-action");
const session = document.getElementById("OidSession");


const newOptionA = document.getElementById("A");
const newOptionB = document.getElementById("B");
const reset = document.getElementById("resetbtn");
const start = document.getElementById("startbtn");


//GET a /users.
window.addEventListener("load", () => {
  const requestUser = new XMLHttpRequest();

  requestUser.addEventListener("load", function () {
    if (this.status == 200) {
      let objSession = JSON.parse(this.responseText);

      userList = objSession.users
      if (reset.hidden === true && start.hidden === true) {
        reset.hidden = false;
        start.hidden = false;
      };

      //showPlayers();
    }
  });

  
  // pedido GET a ATLAS con la info users.json
  requestUser.open("GET", "/ingame/game-session?idSession=" + session.textContent);
  requestUser.send();

});

// Se crean los botones en cada nueva etapa con la nueva información.
function buttonDisplay() {
  const buttonRequest = new XMLHttpRequest();

  buttonRequest.addEventListener("load", function () {
    if (this.status == 200) {
      let userStage = JSON.parse(this.responseText);

      //Si no es el turno del jugador
      if (!userStage.id) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;

        userAction.innerHTML = "";

        const showUserTurn = document.createElement("div");
        showUserTurn.classList.add("userTurn");
        showUserTurn.innerHTML = `${userTurn} está tomando una decisión`;
        userAction.appendChild(showUserTurn);

        return;
      }

      // Verifico si el camino es un ending
      if (userStage.gameFinal === true) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
        const newDialog = document.createElement("div");
        newDialog.innerHTML = userStage.finalText;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);
        return;
      }

      if (newOptionA.hidden === true && newOptionB.hidden === true) {
        newOptionA.hidden = false;
        newOptionB.hidden = false;
      };

      newOptionA.textContent = userStage.optionA;
      newOptionB.textContent = userStage.optionB;

      showNarrative();

    }

  });

  buttonRequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  buttonRequest.send();

};


function pressA() {
  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };

  // Se actualiza el idProgress, camino elegido por el jugador
  userOption = "A";
  idProgres = `${stageCount}${userOption}`;

  // Request con el nuevo camino
  const pressARequest = new XMLHttpRequest();

  pressARequest.addEventListener("load", function () {
    if (this.status == 200) {
      const dialogContainer = document.getElementById("dialog-container");

      let userStage = JSON.parse(this.responseText);

      funcDados();

      //Si los dados dan exito
      if (randNum > 3) {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogASuccess;
        newDialog.classList.add("action-dialog")
        dialogContainer.appendChild( newDialog );

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

      } else {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogAFail;
        newDialog.classList.add("action-dialog")
        dialogContainer.appendChild( newDialog );

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

      };


    }
  })


  pressARequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  pressARequest.send();

};

function pressB() {

  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };

  // Se actualiza el segundo valor de idProgress,
  userOption = "B";
  idProgres = `${stageCount}${userOption}`;

  // Request con el nuevo camino
  const pressBRequest = new XMLHttpRequest();

  pressBRequest.addEventListener("load", function () {
    if (this.status == 200) {
      const dialogContainer = document.getElementById("dialog-container");

      let userStage = JSON.parse(this.responseText);

      funcDados();

      // Si los dados dan exito
      if (randNum > 3) {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBSuccess;
        newDialog.classList.add("action-dialog")
        dialogContainer.appendChild( newDialog );

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

      } else {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBFail;
        newDialog.classList.add("action-dialog")
        dialogContainer.appendChild( newDialog );

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

      };

    }
  })

  pressBRequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  pressBRequest.send();

};

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


function showNarrative() {

  const narrativeRequest = new XMLHttpRequest();

  narrativeRequest.addEventListener("load", function () {
    if (this.status == 200) {

      let userStage = JSON.parse(this.responseText);

      //Borra del dialogo anterior
      userAction.innerHTML = "";

      const showUserTurn = document.createElement("div");
      showUserTurn.classList.add("userTurn")
      showUserTurn.innerHTML = `¿Cuál será tu decisión?`;
      userAction.appendChild(showUserTurn);

      const newDialog = document.createElement("div");
      newDialog.classList.add("browser-dialog")
      newDialog.id = "dialog-container" ;
      newDialog.innerHTML = userStage.narrative;
      showUserTurn.appendChild(newDialog);

    }
  });

  narrativeRequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  narrativeRequest.send();

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
    userTurn = userList[turnsDone].name;

    buttonDisplay();

    timeTextValue = 0;
    showTimer();


    // Tiempo de espera, momento del jugador para apretar un botón de acción
    let timeOut = setTimeout(function () {
      turnsDone++;

      // Si es true, empieza una ronda nueva.
      if (turnsDone == userList.length) {
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
  for (i = 0; i < userList.length; i++) {

    const newPlayer = document.createElement("div");

    newPlayer.classList.add("player-name");
    newPlayer.innerHTML = userList[i].name;
    playPanel.appendChild(newPlayer);

  }

}

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
  if (start.hidden === false) {
    start.hidden = true;

  };

  asignturn()
}