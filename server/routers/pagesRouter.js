const express = require("express");

const pagesRouter = express.Router();


//Get a login
pagesRouter.get("/login", (req, res) => {
  res.render("index", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  })
})

//GET a la pagina de registro
pagesRouter.get("/signup", (req, res) => {
  res.render("signup", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  });
});


// GET de pagina principal
pagesRouter.get("/main-page", (req, res) => {
  if (req.session.loggedUser) {
    res.render("mainGame", {
      layout: "main",
      user: req.session.loggedUser})

  } else {
    res.redirect("/pages/login")
  }
});

module.exports = pagesRouter;