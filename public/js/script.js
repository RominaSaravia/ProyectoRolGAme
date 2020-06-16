// control turnos y rondas
const totalRound = 10;
let numRound = 0;
let numTurn = 0;
let turnsDone = 0;
// control del camino elegido
let randNum = 0; // Resultado de los dados( randNum < 3 = fail || randNum > 3 = success )
let stageCount = 0;
let userOption = "A";
let idProgres = `${stageCount}${userOption}`;
// Control de quien está jugando (NO terminada)
let playerTurn = 0;
let playerBranch = `${stageCount}${userOption}`;
// Data consultada al server y guardada en variables
let gameScript;
let userList;

const mainPanel = document.getElementById("botones");
const userAction = document.getElementById("user-action");
const newOptionA = document.getElementById("A");
const newOptionB = document.getElementById("B");

const playList = document.getElementById("usersPlaying");
const playPanel = document.getElementById("show-players");


//Inicio del juego, se hace un get a /users.
// Una vez se tenga la informacion empieza la ronda
window.addEventListener("load", () => {

  const requestUser = new XMLHttpRequest();

  requestUser.addEventListener("load", function () {
    if (this.status == 200) {
      userList = JSON.parse(this.responseText);
      console.log("Llego la lista de jugadores");
      Round();
      showPlayers();
    } else {
      console.log("ERROR");
    }
  });

  // pedido GET a ATLAS con la info users.json
  requestUser.open("GET", "/users");
  requestUser.send();

});

// Se crean los botones en cada nueva etapa con la nueva información.
function buttonDisplay() {
  const buttonRequest = new XMLHttpRequest();

  buttonRequest.addEventListener("load", function () {
    if (this.status == 200) {
      let userStage = JSON.parse(this.responseText);

      if (newOptionA.hidden === true && newOptionB.hidden === true) {
        newOptionA.hidden = false;
        newOptionB.hidden = false;
      };
      // Una vez con la informacion del camino, se arman los botones.
      // Verifico que si el camino es un ending
      if (userStage.gameFinal === true) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
        const newDialog = document.createElement("div");
        newDialog.innerHTML = userStage.finalText;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);
        return;
      }
      newOptionA.textContent = userStage.optionA;
      newOptionB.textContent = userStage.optionB;

      showNarrative()

    } else {

      console.log("ERROR")
    }

  });

  buttonRequest.open("GET", "/scriptdb?idProgres=" + idProgres);
  buttonRequest.send();

};

// Cuando se apreta el boton el idProgres se actualiza a la decision del usuario 
// y se actualiza el fragmento de script.js con el nuevo camino (ajaxrequest)
function pressA() {
  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };
  // Se actualiza el idProgress, camino elegido por el jugador
  // Se realiza un request con el nuevo camino
  userOption = "A";
  idProgres = `${stageCount}${userOption}`;

  const pressARequest = new XMLHttpRequest();

  pressARequest.addEventListener("load", function () {
    if (this.status == 200) {

      let userStage = JSON.parse(this.responseText);
      console.log("se tiran los dados")
      funcDados();
      //Si los dados dan exito
      if (randNum > 3) {
        //Se crea la respuesta a la accion elegida
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogASuccess;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

        console.log(stageCount + userOption);

        //Si los dados san fallo
      } else {
        //Se crea la respuesta a la accion elegida
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogAFail;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);
        stageCount++;
        idProgres = `${stageCount}${userOption}`;
        console.log(stageCount + userOption);

      };


    } else {
      console.log("ERROR")
    }
  })


  pressARequest.open("GET", "/scriptdb?idProgres=" + idProgres);
  pressARequest.send();

};

function pressB() {

  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };
  // Se actualiza el segundo valor de idProgress,
  // Se realiza un request con el nuevo camino
  userOption = "B";
  idProgres = `${stageCount}${userOption}`;

  const pressBRequest = new XMLHttpRequest();

  pressBRequest.addEventListener("load", function () {
    if (this.status == 200) {

      let userStage = JSON.parse(this.responseText);

      funcDados();
      // Si los dados dan exito
      if (randNum > 3) {
        //Se crea la respuesta a la accion elegida
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBSuccess;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        //Se actualiza el primer valor de idProgres
        stageCount++;
        idProgres = `${stageCount}${userOption}`;

        // Si los dados dan fallo
      } else {
        //Se crea la respuesta a la accion elegida
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBFail;
        newDialog.classList.add("action-dialog")
        userAction.appendChild(newDialog);

        stageCount++;
        idProgres = `${stageCount}${userOption}`;


      };

    } else {

      console.log("ERROR")
    }
  })

  pressBRequest.open("GET", "/scriptdb?idProgres=" + idProgres);
  pressBRequest.send();

};

// Tirada de dados de 6 caras, 
function funcDados() {
  randNum = Math.floor(Math.random() * 6) + 1;
};


// una vez se crean los nuevos botones, se muestra el texto.
function showNarrative() {

  const NarrativeRequest = new XMLHttpRequest();

  NarrativeRequest.addEventListener("load", function () {
    if (this.status == 200) {

      let userStage = JSON.parse(this.responseText);

      const newDialog = document.createElement("p");
      newDialog.classList.add("browser-dialog")
      newDialog.innerHTML = userStage.narrative;
      userAction.appendChild(newDialog);

    } else {
      console.log("ERROR");
    }
  });

  NarrativeRequest.open("GET", "/scriptdb?idProgres=" + idProgres);
  NarrativeRequest.send();

};


// control de ciclos de turnos.(RONDAS)
function Round() {
  numRound++
  // comienzo de etapa, se muestra el contexto del juego
  if (numRound <= totalRound) {
    console.log(`------------RONDA: ${numRound}--------------`);
    asignTurn();
  } else {
    console.log(`------------Ronda:${numRound}----------`)
    console.log(`------------FIN--------------`)
  }
}
// Iterador de turnos, asigna el turno a cada jugador
function asignTurn(cbTurn) {

  console.log(`Turnos hechos ${turnsDone}, personas jugando ${userList.length}`);
  // Se determina cuantos turnos son según el numero de usuarios.
  if (turnsDone < userList.length) {
    // llamdo a una funcion asincrónica, que devuelve sumTurn(callBack)
    turnoTimer(sumTurn => {
      console.log("Se termino el tiempo,");
      // se le suma 1 a los turnos hechos
      turnsDone = turnsDone + sumTurn;
      // Se le suma 1 a el identificador de jugador Turno
      playerTurn = playerTurn + sumTurn;
      console.log("Se llama al siguiente jugador");

      // Se verifica que todos hayan jugado.
      // Si el indicador de turno y el subIndice del ultimo player son iguales 
      if (playerTurn == userList.length) {
        // Vuelven a 0 los contadores
        playerTurn = 0;
        turnsDone = 0;
        //Comienza una nueva ronda
        Round();

      } else {
        asignTurn();
      }
    })
  }

}
// Timer, se le da 5'' para que realice una acción, y se pasa al siguiente jugador
function turnoTimer(callBack) {
  console.log(`Turno de userList[${playerTurn}]: TIMER, el jugador tiene 5 segundos`);
  buttonDisplay();

  setTimeout(() => {
    const sumTurn = 1
    callBack(sumTurn)

  }, 10000)
};


function showPlayers() {
  for (i = 0; i < userList.length; i++) {

    const newPlayer = document.createElement("div");

    newPlayer.classList.add("player-name");
    newPlayer.innerHTML = userList[i].username;
    playPanel.appendChild(newPlayer);

  }

}

function resetGame() {
  numRound = 0;
  numTurn = 0;
  turnsDone = 0;

  Round();
  showPlayers();

}