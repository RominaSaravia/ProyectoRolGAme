const express = require("express");

const getData = require("../useData.js");
const user = require("../user");

const ingameRouter = express.Router();

// Get a la DB consulta: lista de usuarios
ingameRouter.get("/users", (req, res) => {
  user.getAll(personList => {
    res.send(personList)
  });

});

//Consulta el objeto gameSession
ingameRouter.get("/game-session", (req, res) => {
  if (req.query.idSession) {
    getData.getGameSession(req.query.idSession, cbResponse => {
      res.send(cbResponse)
    })

  } else {
    res.sendStatus(403);
  }

})

//Update a la DB de gameState
ingameRouter.post("/usersProgres", (req, res) => {
  if (req.body.userTurn == req.session.loggedUser.username) {
    getData.updateUsergameProgress(req.session.loggedUser.username, req.body.idProgres, result => {
      if (result) {
        res.send("Se hizo el cambio exitosamente")

      } else {
        res.sendStatus(404);
      }

    })

  } else {
    res.send(403);

  }

})

//Consulta el userProgress
ingameRouter.get("/usersProgres", (req, res) => {

  if (req.query.userTurn == req.session.loggedUser.username) {
    user.getByName(req.session.loggedUser.username, result => {
      res.send(result.gameState)

    })

  } else {
    res.send();
  }

})


//GET a la DB consulta: script.json
ingameRouter.get("/scriptdb", (req, res) => {

  getData.getGameScript(gameScript => {
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres || !req.query.userTurn) {
      res.send();
    } else {

      //Verifica quien puede jugar, si el userTurno coincide con el req.session.username permite jugar
      if (req.query.userTurn == req.session.loggedUser.username) {
        req.session.userProgress = req.query.idProgres

        res.json(gameScript.find(item => item.id.includes(req.query.idProgres)));

      } else {
        res.send({});

      }
    }
  });

});

module.exports = ingameRouter;