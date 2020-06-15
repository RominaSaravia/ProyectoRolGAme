// control turnos y rondas
const totalRound = 4 ;
let numRound = 0;
let numTurn = 0;
let turnsDone = 0;
// control del camino elegido
let stageCount = 0;
let userOption = "A";
let idProgres = `${stageCount}${userOption}`;
// Control de quien está jugando (NO terminada)
let playerTurn = 0 ;
let playerBranch = `${stageCount}${userOption}`;
// Data consultada al server y guardada en variables
let gameScript;
let userList;

const mainPanel = document.getElementById("botones");
const userAction = document.getElementById("user-action");
const newOptionA = document.getElementById("A");
const newOptionB = document.getElementById("B");

// request al server con la userList (ATLAS)
const requestUser = new XMLHttpRequest();
requestUser.addEventListener("load", function() {
  if (this.status == 200) {
    userList = JSON.parse(this.responseText);
    console.log(`LLego la userList`);
  }else {
    console.log("ERROR");
  }
});
// request al server con el gameScript (local)
const ajaxRequest = new XMLHttpRequest();
ajaxRequest.addEventListener("load", function() {
  if (this.status == 200) {
    gameScript = JSON.parse(this.responseText);
  }else {
    console.log("ERROR")
  }
})

// Se crean los botones en cada nueva etapa con la nueva información.
function buttonDisplay () {
  ajaxRequest.open("GET", "/script?idProgres=" + idProgres);
  ajaxRequest.send();
  setTimeout(() => {
    if (newOptionA.hidden === true && newOptionB.hidden === true) {
      newOptionA.hidden = false;
      newOptionB.hidden = false;
    };
    let userStage = gameScript;
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

    showNarrative ()

  },100) 
};
// Cuando se apreta el boton el idProgres se actualiza a la decision del usuario 
// y se actualiza el fragmento de script.js con el nuevo camino (ajaxrequest)
function pressA() {
  userOption = "A";
  idProgres = `${stageCount}${userOption}`;
  ajaxRequest.open("GET", "/script?idProgres=" + idProgres);
  ajaxRequest.send();

  setTimeout( () => {
    let userStage = gameScript; 
    console.log("se tiran los dados")  
    funcDados();
    if (randNum > 3) {
      const newDialog = document.createElement("p");
      newDialog.textContent = userStage.dialogASuccess;
      newDialog.classList.add("action-dialog")
      userAction.appendChild(newDialog);
      stageCount++;
      idProgres = `${stageCount}${userOption}`;
      console.log(stageCount + userOption);
      if (newOptionA.hidden === false && newOptionB.hidden === false) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
      };  
    }else {
      const newDialog = document.createElement("p");
      newDialog.textContent = userStage.dialogAFail;
      newDialog.classList.add("action-dialog")
      userAction.appendChild(newDialog);
      stageCount++;
      idProgres = `${stageCount}${userOption}`;
      console.log(stageCount + userOption);
      if (newOptionA.hidden === false && newOptionB.hidden === false) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
      };
    };
    
  },100)
};

function pressB() {
  userOption = "B";
  idProgres = `${stageCount}${userOption}`;
  ajaxRequest.open("GET", "/script?idProgres=" + idProgres);
  ajaxRequest.send();
  setTimeout(() => {
    let userStage = gameScript;
    funcDados();
    if (randNum > 3) {
      const newDialog = document.createElement("p");
      newDialog.textContent = userStage.dialogBSuccess;
      newDialog.classList.add("action-dialog")
      userAction.appendChild(newDialog);
      stageCount++;
      idProgres = `${stageCount}${userOption}`;
      console.log(stageCount + userOption);
      if (newOptionA.hidden === false && newOptionB.hidden === false) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
      };  
    }else {
      const newDialog = document.createElement("p");
      newDialog.textContent = userStage.dialogBFail;
      newDialog.classList.add("action-dialog")
      userAction.appendChild(newDialog);
      stageCount++;
      idProgres = `${stageCount}${userOption}`;
      console.log(stageCount + userOption);
      if (newOptionA.hidden === false && newOptionB.hidden === false) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;
      };
    };
  })
};


// Tirada de dados de 6 caras, 
function funcDados () {
  randNum = Math.floor(Math.random() * 6) + 1;    
};
// una vez se crean los nuevos botones, se muestra el texto.
function showNarrative () {
  
  ajaxRequest.open("GET", "/script?idProgres=" + idProgres);
  ajaxRequest.send();
  setTimeout(() => {
    console.log(userList[playerTurn]);
    let currentPlayer = userList[playerTurn];
    const showName = document.createElement("p");
    showName.classList.add("player-dialog")
    showName.innerHTML = `Es el turno de: ${currentPlayer.username}`;
    userAction.appendChild(showName);

    let userStage = gameScript;
    const newDialog = document.createElement("p");
    newDialog.classList.add("browser-dialog")
    newDialog.innerHTML = userStage.narrative;
    userAction.appendChild(newDialog);

  })
};


// control de ciclos de turnos.(RONDAS)
function Round () {
  numRound++
  // comienzo de etapa, se muestra el contexto del juego
  if (numRound <= totalRound) {
    console.log(`------------RONDA: ${numRound}--------------`);
    asignTurn();
  }else {
    console.log(`------------Ronda:${numRound}----------`)
    console.log(`------------FIN--------------`)
  }
}
// Proceso de turnos
function asignTurn (cbTurn) {
  
  setTimeout(() => {
    console.log(`Turnos hechos ${turnsDone}, personas jugando ${userList.length}`);
    // Se determina cuantos turnos son según el numero de usuarios.
    if (turnsDone < userList.length) {
      // llamdo a una funcion asincrónica, que devuelve sumTurn(callBack)
      turnoTimer( sumTurn => {
        console.log("Se termino el tiempo,");
        turnsDone = turnsDone + sumTurn;
        playerTurn = playerTurn + sumTurn;
        console.log("Se llama al siguiente jugador");

        if (playerTurn == userList.length) {
          playerTurn = 0;
          turnsDone = 0;
          Round();
          }else {
          asignTurn();
          }
      })
    }
  },2000)
}
// Timer, se le da 5'' para que realice una acción, y se pasa al siguiente jugador
function turnoTimer(callBack) {
  console.log(`Turno de userList[${playerTurn}]: TIMER, el jugador tiene 5 segundos`);
  buttonDisplay();
  
  setTimeout( () => {
    const sumTurn = 1
    callBack(sumTurn)
    
  },5000)
}

//Inicio del juego, tiene un Timer bastante largo 
//para que llegue la info de users.json de atlas
setTimeout(()=> {
  console.log("Inicio Juego")
  Round();
  
},3000)

// pedido GET a ATLAS con la info users.json
requestUser.open("GET", "/users");
requestUser.send();