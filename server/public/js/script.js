// control turnos y rondas
let stopLoop = false;    // [control del loop de turnos] - false --> continue loop  || true --> stop loop
const totalRound = 4;    // numero de rondas hardcodeadas
let roundsDone = 0;      // contador de rondas hechas
let turnsDone = 0;       // contador de turnos hechos

// control del camino elegido
let randNum = 0;         //  randNum < 3 --> fail action || randNum > 3 --> success action 
let stageCount = 0;      //  contador de nivel
let userOption = "A";    //  camino: A || B
let idProgres = `${stageCount}${userOption}`;    // construye el ID, lo recibe el back y devuelve objeto con el camino

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
      console.log(userList);

      if (reset.hidden === true && start.hidden === true) {
        reset.hidden = false;
        start.hidden = false;
      };

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
        console.log(stageCount + userOption);

        // Si los dados dan fallo
      } else {
        //Se crea la respuesta a la accion elegida
        const newDialog = document.createElement("p");
        newDialog.textContent = userStage.dialogBFail;
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

  pressBRequest.open("GET", "/scriptdb?idProgres=" + idProgres);
  pressBRequest.send();

};

// Tirada de dados de 6 caras, 
function funcDados() {
  randNum = Math.floor(Math.random() * 6) + 1;
  const diceResult = document.createElement("p");

  if (randNum > 3) {
    diceResult.textContent = `Tiras los dados: ${randNum} - Salió con éxito`;
  }else {
    diceResult.textContent = `Tiras los dados: ${randNum} - No salió bien la acción`;    
  }

  diceResult.classList.add("dice-result")
  userAction.appendChild(diceResult);
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


function asignturn() {
  // Si es true, se detiene el loop de turnos
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

    console.log("Timeout")

    // Muestra los botones de acción
    buttonDisplay();

    // Tiempo de espera, momento del jugador para apretar un botón de acción
    let timeOut = setTimeout(function () {
      console.log("Callback");

      console.log("Turno: " + turnsDone + " ,juega: " + userList[turnsDone].username)

      turnsDone++;

      // Si es true, empieza una ronda nueva.
      if (turnsDone == userList.length) {
        roundsDone++
        turnsDone = 0;
      }

      // Se vuelve a ejecutar la funcion creando un loop
      asignturn();

    }, 10000)

    // Si es true, se detiene el loop
    if (stopLoop) {
      console.log("Final ronda, final loop");
      clearTimeout(timeOut);
    }

  } else {
    console.log("Se terminaron las rondas")
    stopLoop = true;


  }

}


function showPlayers() {
  for (i = 0; i < userList.length; i++) {

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