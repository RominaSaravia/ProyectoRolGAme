const express = require("express");
const auth = require("../auth.js");

const authRouter = express.Router()

// Endpoint que valida user/pass
authRouter.post("/login", (req, res) => {
  // // Validar datos ingresados
  auth.login(req.body.user, req.body.pass, result => {

    if (result.user) {
      //Guardar user logeado en session
      req.session.loggedUser = result.user;

      //Se validaron correctamente los datos
      res.redirect("/adventure/home");

    } else {
      // CallBack de error, no se pudo validar los datos
      req.session.message = {
        class: "failure",
        text: "No se pudo logear, user/pass incorrectos"
      }
      res.redirect("/pages/login");
    }
  })


});


// Post a /auth/register
authRouter.post("/register", (req, res) => {
  // verificar que recibí datos
  auth.getUser(req.body.user, result => {

    //No se pudo consultar los datos
    if (!result.success) {
      req.session.message = {
        text: "No se pudo registrar",
        class: "failure"
      }

      res.redirect("/pages/signup");

      return;
    }

    // Ya existe el usuario
    if (result.user) {
      req.session.message = {
        text: "No se pudo registrar, ya esxite el usuario",
        class: "failure"
      }
      res.redirect("/pages/signup");

      return;
    }

    //Usuario no utilizado, valido password
    if (!req.body.pass || req.body.pass !== req.body.confirmPass) {
      req.session.message = {
        text: "Las passwords deben ser iguales",
        class: "failure"
      }
      res.redirect("/pages/signup");

      return;
    }

    // Procesar alta de usuario
    auth.registerUser(req.body.user, req.body.pass, result => {

      // Se pudo registrar, renderizo index con mesaje de exito
      if (result) {
        req.session.message = {
          text: "Usuario registrado",
          class: "success"
        }
        res.redirect("/pages/login");

        // No se pudo registrar, renderizo signup con mesaje de error
      } else {
        req.session.message = {
          text: "Lo sentimos, no se pudo registrar el usuario",
          class: "failure"
        }
        res.redirect("/pages/signup")

      }
    });
  });
});

// Get a logout, cierra la session redirecciona a login
authRouter.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/pages/login");
})

module.exports = authRouter;