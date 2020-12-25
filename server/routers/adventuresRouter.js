const express = require("express");
const adventures = require("../adventures.js");
const getData = require("../useData.js");

const adventureRouter = express.Router();

//Endpoint get HOME
adventureRouter.get("/home", (req, res) => {
  if (req.session.loggedUser) {
    adventures.getAll(adventuresList => {
      res.render("home", {
        layout: "logged",
        user: req.session.loggedUser,
        adventures: adventuresList
      });

    })
  } else {
    res.redirect("/pages/login");
  }
})


// Get Lista de aventuras
adventureRouter.get("/:id", (req, res) => {

  if (req.session.loggedUser) {
    adventures.getById(req.params.id, cbResponse => {

      getData.getAllGameSessions(req.params.id, allGameSessions => {
        res.render("adventure", {
          layout: "logged",
          user: req.session.loggedUser,
          message: req.session.message,
          adventure: cbResponse,
          session: allGameSessions
        }, (err, html) => {
          req.session.message = undefined;
          res.send(html);
        });

      })


    })

  } else {
    res.redirect("/pages/login");
  }

});

module.exports = adventureRouter;
