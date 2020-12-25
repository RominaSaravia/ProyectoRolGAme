// Se crean los botones en cada nueva etapa con la nueva información.
function buttonDisplay() {
  const request = new XMLHttpRequest();

  //Consulta a la DB data para mostrar los botones y la pregunta
  request.addEventListener("load", function () {
    if (this.status == 200) {
      userStage = this.responseText;

      //La consulta devuele {}, No es el turno del jugador
      if (!userStage) {
        newOptionA.hidden = true;
        newOptionB.hidden = true;

        userAction.innerHTML = "";

        const showUserTurn = document.createElement("div");
        showUserTurn.classList.add("userTurn");
        showUserTurn.innerHTML = `${userTurn} está tomando una decisión`;
        userAction.appendChild(showUserTurn);

        return;

        //Es el turno del jugador
      } else {

        //Armo el objeto para hacer el POST a /ingame/usersProgres
        let newGameState = JSON.stringify({
          idProgres,
          userTurn
        });

        const updateIdprogres = new XMLHttpRequest();
        updateIdprogres.addEventListener("load", function () {
          //Se actuzlizó corretamnete en la DB
          if (this.status == 200) {

            //Consulta que texto van a tener los botones Opcion A y B
            const buttonRequest = new XMLHttpRequest();
            buttonRequest.addEventListener("load", function () {
              if (this.status == 200) {
                let response = JSON.parse(this.responseText);

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

                newOptionA.textContent = response.optionA;
                newOptionB.textContent = response.optionB;

                showNarrative(response.narrative);

              }

            });

            buttonRequest.open("GET", "/ingame/scriptdb?idProgres=" + userStage + "&userTurn=" + userTurn);
            buttonRequest.send();

          }

        })

        updateIdprogres.open("POST", "/ingame/usersProgres");
        updateIdprogres.setRequestHeader("Content-Type", "application/json");
        updateIdprogres.send(newGameState);

      }
    }
  });

  request.open("GET", "/ingame/usersProgres?userTurn=" + userTurn);
  request.send();

};


function pressA() {
  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };

  // Se actualiza el idProgress, camino elegido por el jugador
  userOption = "A";
  idProgres = `${stageCount}${userOption}`;

  //Armo el objeto
  let newGameState = JSON.stringify({
    idProgres,
    userTurn
  });

  const request = new XMLHttpRequest();

  request.addEventListener("load", function () {
    //Se actuzlizó corretamnete en la DB
    if (this.status == 200) {
      console.log(idProgres)

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
            dialogContainer.appendChild(newDialog);

            //Se actualiza el primer valor de idProgres
            stageCount++;
            idProgres = `${stageCount}${userOption}`;

          } else {
            //Se muestra la respueta en pantalla
            const newDialog = document.createElement("p");
            newDialog.textContent = userStage.dialogAFail;
            newDialog.classList.add("action-dialog")
            dialogContainer.appendChild(newDialog);


            //Se actualiza el primer valor de idProgres
            stageCount++;
            idProgres = `${stageCount}${userOption}`;

            //Armo el objeto
            let newGameState02 = JSON.stringify({
              idProgres,
              userTurn
            });


            const updateStageCount = new XMLHttpRequest();
            updateStageCount.addEventListener("load", function () {
              if (this.status == 200) {
                console.log(idProgres)
                console.log("StageCount actualizado")
              }

            })

            updateStageCount.open("POST", "/ingame/usersProgres");
            updateStageCount.setRequestHeader("Content-Type", "application/json");
            updateStageCount.send(newGameState02);


          };


        }
      })


      pressARequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
      pressARequest.send();


    } else {

      return
    }

  })

  request.open("POST", "/ingame/usersProgres");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(newGameState);

};

function pressB() {

  if (newOptionA.hidden === false && newOptionB.hidden === false) {
    newOptionA.hidden = true;
    newOptionB.hidden = true;
  };

  // Se actualiza el segundo valor de idProgress,
  userOption = "B";
  idProgres = `${stageCount}${userOption}`;

  //Armo el objeto
  let newGameState = JSON.stringify({
    idProgres,
    userTurn
  });

  const request = new XMLHttpRequest();
  request.addEventListener("load", function () {
    //Se actualizó correctamnete en la DB
    if (this.status == 200) {

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
            dialogContainer.appendChild(newDialog);

            //Se actualiza el primer valor de idProgres
            stageCount++;
            idProgres = `${stageCount}${userOption}`;

          } else {
            //Se muestra la respueta en pantalla
            const newDialog = document.createElement("p");
            newDialog.textContent = userStage.dialogBFail;
            newDialog.classList.add("action-dialog")
            dialogContainer.appendChild(newDialog);

            //Se actualiza el primer valor de idProgres
            stageCount++;
            idProgres = `${stageCount}${userOption}`;

            //Armo el objeto
            let newGameState02 = JSON.stringify({
              idProgres,
              userTurn
            });


            const updateStageCount = new XMLHttpRequest();
            updateStageCount.addEventListener("load", function () {
              if (this.status == 200) {
                console.log(idProgres)
                console.log("StageCount actualizado")
              }


            })

            updateStageCount.open("POST", "/ingame/usersProgres");
            updateStageCount.setRequestHeader("Content-Type", "application/json");
            updateStageCount.send(newGameState02);


          };

        }
      })

      pressBRequest.open("GET", "/ingame/scriptdb?idProgres=" + idProgres + "&userTurn=" + userTurn);
      pressBRequest.send();

    }

  })

  request.open("POST", "/ingame/usersProgres");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(newGameState);


};


function showNarrative(narrative) {
  //Borra el dialogo anterior
  userAction.innerHTML = "";
  
  const showUserTurn = document.createElement("div");
  showUserTurn.classList.add("userTurn")
  showUserTurn.innerHTML = `¿Cuál será tu decisión?`;
  userAction.appendChild(showUserTurn);

  const newDialog = document.createElement("div");
  newDialog.classList.add("browser-dialog")
  newDialog.id = "dialog-container";
  newDialog.innerHTML = narrative;
  showUserTurn.appendChild(newDialog);

};
