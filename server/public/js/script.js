// control turnos y rondas
let stopLoop = false;
const totalRound = 4;    // numero de rondas
let roundsDone = 0;      // contador de rondas hechas
let turnsDone = 0;       // contador de turnos hechos
let timeTextValue = 0;

// control del camino elegido
let randNum = 0;         //  Tirada de dados
let stageCount = 0;      //  contador de nivel
let userOption = "A";    //  camino: A || B
let idProgres = `${stageCount}${userOption}`;    // construye el ID, lo recibe el back y devuelve objeto con el camino
let userTurn = "";

// Control de quien está jugando (NO terminada)
let playerTurn = 0;
let playerBranch = `${stageCount}${userOption}`;

// Data consultada al server y guardada en variables
let gameScript;
let userList;

const playList = document.getElementById("usersPlaying");
const playPanel = document.getElementById("show-players");
const userAction = document.getElementById("user-action");

const newOptionA = document.getElementById("A");
const newOptionB = document.getElementById("B");
const reset = document.getElementById("resetbtn");
const start = document.getElementById("startbtn");


//GET a /users.
window.addEventListener("load", () => {

  const requestUser = new XMLHttpRequest();

  requestUser.addEventListener("load", function () {
    if (this.status == 200) {
      userList = JSON.parse(this.responseText);
      console.log("Llego la lista de jugadores");
      console.log(userList.usersPlaying);

      if (reset.hidden === true && start.hidden === true) {
        reset.hidden = false;
        start.hidden = false;
      };

      //showPlayers();
    } else {
      console.log("ERROR");
    }
  });

  // pedido GET a ATLAS con la info users.json
  requestUser.open("GET", "/game-session?idSession=sala01");
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
        showUserTurn.classList.add("browser-dialog")
        showUserTurn.innerHTML = `Turno de: ${userTurn}`;
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

    } else {

      console.log("Button display ERROR")

    }

  });

  buttonRequest.open("GET", "/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
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

      let userStage = JSON.parse(this.responseText);
      console.log("se tiran los dados")
      funcDados();

      //Si los dados dan exito
      if (randNum > 3) {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogASuccess;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

        console.log(stageCount + userOption);

      } else {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogAFail;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;
        console.log(stageCount + userOption);

      };


    } else {
      console.log("ERROR")
    }
  })


  pressARequest.open("GET", "/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
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

      let userStage = JSON.parse(this.responseText);

      funcDados();

      // Si los dados dan exito
      if (randNum > 3) {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBSuccess;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;
        console.log(stageCount + userOption);

      } else {
        //Se muestra la respueta en pantalla
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBFail;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;
        console.log(stageCount + userOption);


      };

    } else {

      console.log("ERROR")
    }
  })

  pressBRequest.open("GET", "/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  pressBRequest.send();

};

// Tirada de dados de 6 caras, 
function funcDados() {
  randNum = Math.floor(Math.random() * 6) + 1;
  const diceResult = document.createElement("p");

  if (randNum > 3) {
    diceResult.textContent = `Tiras los dados: ${randNum} - Salió con éxito`;
  } else {
    diceResult.textContent = `Tiras los dados: ${randNum} - No salió bien la acción`;
  }

  diceResult.classList.add("dice-result")
  userAction.appendChild(diceResult);
};


function showNarrative() {

  const narrativeRequest = new XMLHttpRequest();

  narrativeRequest.addEventListener("load", function () {
    if (this.status == 200) {

      let userStage = JSON.parse(this.responseText);

      //Borra del dialogo anterior
      userAction.innerHTML = "";

      const showUserTurn = document.createElement("div");
      showUserTurn.classList.add("browser-dialog")
      showUserTurn.innerHTML = `Turno de: ${userTurn}`;
      userAction.appendChild(showUserTurn);

      const newDialog = document.createElement("div");
      newDialog.classList.add("browser-dialog")
      newDialog.innerHTML = userStage.narrative;
      showUserTurn.appendChild(newDialog);



    } else {
      console.log("ERROR - showNarrative");

    }
  });

  narrativeRequest.open("GET", "/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
  narrativeRequest.send();

};


function asignturn() {
  if (stopLoop) {
    console.log("Se termina el Loop");

    userAction.innerHTML = "";

    if (start.hidden === true) {
      start.hidden = false;
    };

    return;
  }

  // Control de numero de rondas
  if (roundsDone <= totalRound) {

    // Muestra los botones de acción
    userTurn = userList.usersPlaying[turnsDone];

    console.log(`Turno de: ${userList.usersPlaying[turnsDone]}`)
    buttonDisplay();

    timeTextValue = 0;
    showTimer();


    // Tiempo de espera, momento del jugador para apretar un botón de acción
    let timeOut = setTimeout(function () {
      turnsDone++;

      // Si es true, empieza una ronda nueva.
      if (turnsDone == userList.usersPlaying.length) {
        roundsDone++
        turnsDone = 0;
      }

      // Se vuelve a ejecutar la funcion creando un loop
      asignturn();

    }, 11000)


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

    if (timeTextValue >= 10) {
      time.textContent = `Tiempo: ${timeTextValue}`;
      clearTimeout(timeText);

    } else {
      showTimer();

    }
  }, 1000)

}


function showPlayers() {
  for (i = 0; i < userList.usersPlaying.length; i++) {

    const newPlayer = document.createElement("div");

    newPlayer.classList.add("player-name");
    newPlayer.innerHTML = userList[i].user;
    playPanel.appendChild(newPlayer);

  }

}

// Vuelve los valores a 0 y reinicia
function resetGame() {
  stopLoop = true;
  // control turnos y rondas
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