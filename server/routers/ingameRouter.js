const express = require("express");

const getData = require("../useData.js");

const ingameRouter = express.Router();

// Get a la DB consulta: lista de usuarios
ingameRouter.get("/users", (req, res) => {
  getData.getAll(personList => {
    res.send(personList)
  });

});

//Consulta el objeto gameSession
ingameRouter.get("/game-session", (req, res) => {
  console.log({id: req.query.idSession})

  if (req.query.idSession) {
    getData.getGameSession(req.query.idSession, cbResponse => {
      console.log("callback" + cbResponse)
      res.send(cbResponse)
    })

  } else {
    console.log("No hay IdSession")
    res.sendStatus(500);
  }

})

//Verifica los userProgress
ingameRouter.get("/usersProgress", (req, res) => {
  //Con la lista de usuario jugando hago un filtro
  if (req.query.usersPlaying) {
    getData.getAll()

  }

})


//GET a  la DB consulta: script.json
ingameRouter.get("/scriptdb", (req, res) => {

  getData.getGameScript(gameScript => {
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres || !req.query.userTurn) {
      res.sendStatus(403);
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