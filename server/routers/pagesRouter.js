const express = require("express");
const getData = require("../useData.js");

const pagesRouter = express.Router();


//Vista login
pagesRouter.get("/login", (req, res) => {
  res.render("index", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  })
})

//Vista registro
pagesRouter.get("/signup", (req, res) => {
  res.render("signup", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  });
});

//Vista cambio de contraseña
pagesRouter.get("/changepass", (req,res) => {
  res.render("changepass", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  });
});


//Vista pagina principal
pagesRouter.get("/game-page/:id", (req, res) => {
  if (req.session.loggedUser) {

    getData.getGameSession(req.params.id, sessionItem => {
      res.render("mainGame", {
        layout: "main",
        session: sessionItem,
        user: req.session.loggedUser

      })
    })
  } else {
    res.redirect("/pages/login")
  }
});

module.exports = pagesRouter;