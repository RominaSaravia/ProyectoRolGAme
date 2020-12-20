const express = require("express");

const getData = require("../useData.js");

const ingameRouter = express.Router();

// endpoint Get a MONGO ATLAS consulta: userList.json
ingameRouter.get("/users", (req, res) => {
  getData.getAll(personList => {
    res.send(personList)
  });

});

//Get a game-session devuelve el objeto gameSession
ingameRouter.get("/game-session", (req,res) => {

  if(req.query.idSession) {
    getData.getGameSession(req.query.idSession, cbResponse => {
      res.send(cbResponse)
    })

  }else{
    res.sendStatus(500);
  }

})

//Verifica los userProgress
ingameRouter.get("/usersProgress", (req,res) => {
  //Con la lista de usuario jugando hago un filtro
  if(req.query.usersPlaying) {
    getData.getAll()

  }

})


//Endpoint GET a MONGO ATLAS consulta: script.json
ingameRouter.get("/scriptdb", (req, res) => {

  getData.getGameScript(gameScript => {
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres || !req.query.userTurn) {
      res.sendStatus(403);
    } else {

      //Verifica quien puede jugar, si el userTurno coincide con el req.session.username permite jugar
      if(req.query.userTurn == req.session.loggedUser.username) {
        req.session.userProgress = req.query.idProgres
        console.log(req.session.userProgress);
        res.json(gameScript.find(item => item.id.includes(req.query.idProgres)));

      }else {
        res.send({});

      }
    }
  });

});

module.exports = ingameRouter;