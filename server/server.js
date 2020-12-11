const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const PORT = 4444;
const expSession = require("express-session");

const getData = require("./useData.js");
const adventures = require("./adventures.js");
const auth = require("./auth.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Ruta para archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//Sesiones
app.use(expSession({
  secret: "Que feo dia hoy",
  resave: false,
  saveUninitialized: false
}));

//Handlebars
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", exphbs({
  defaultLayout: "public",
  layoutsDir: path.join(__dirname, "views/layout")
}));

//Un GET a la pagina inicial
app.get("/", (req, res) => {
  if (req.session.loggedUser) {
    res.redirect("home");
  } else {
    res.redirect("/login");
  }

});

//Get a login
app.get("/login", (req, res) => {
  res.render("index", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  })
})

//GET a la pagina de registro
app.get("/signup", (req, res) => {
  res.render("signup", {
    message: req.session.message
  }, (err, html) => {
    req.session.message = undefined;
    res.send(html);
  });
});

// Post a /register
app.post("/register", (req, res) => {
  // verificar que recibí datos
  auth.getUser(req.body.user, result => {

    //No se pudo consultar los datos
    if (!result.success) {
      req.session.message = {
        text: "No se pudo registrar",
        class: "failure"
      }

      res.redirect("/signup");

      return;
    }

    // Ya existe el usuario
    if (result.user) {
      req.session.message = {
        text: "No se pudo registrar, ya esxite el usuario",
        class: "failure"
      }
      res.redirect("/signup");

      return;
    }

    //Usuario no utilizado, valido password
    if (!req.body.pass || req.body.pass !== req.body.confirmPass) {
      req.session.message = {
        text: "Las passwords deben ser iguales",
        class: "failure"
      }
      res.redirect("/signup");

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
        res.redirect("/login");

        // No se pudo registrar, renderizo signup con mesaje de error
      } else {
        req.session.message = {
          text: "Lo sentimos, no se pudo registrar el usuario",
          class: "failure"
        }
        res.redirect("/signup")

      }
    });
  });
});


//Endpoint get HOME
app.get("/home", (req, res) => {
  if (req.session.loggedUser) {
    adventures.getAll(adventuresList => {
      res.render("home", {
        layout: "logged",
        user: req.session.loggedUser,
        adventures: adventuresList
      });

    })
  } else {
    res.redirect("/login");
  }
})

// Endpoint que valida user/pass
app.post("/login", (req, res) => {
  // // Validar datos ingresados
  auth.login(req.body.user, req.body.pass, result => {

    if (result.user) {
      //Guardar user logeado en session
      req.session.loggedUser = result.user;

      //Se validaron correctamente los datos
      res.redirect("/home");

    } else {
      // CallBack de error, no se pudo validar los datos
      req.session.message = {
        class: "failure",
        text: "No se pudo logear, user/pass incorrectos"
      }
      res.redirect("login");
    }
  })


});


// Get a logout, cierra la session redirecciona a login
app.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
})



// Get Lista de aventuras
app.get("/adventures/:id", (req, res) => {

  if (req.session.loggedUser) {
    adventures.getById(req.params.id, cbResponse => {
      res.render("adventure", {
        layout: "logged",
        user: req.session.loggedUser,
        adventure: cbResponse
      });

    })

  } else {
    res.redirect("/login");
  }

});


// GET de pagina principal
app.get("/main-page", (req, res) => {
  if (req.session.loggedUser) {
    res.render("mainGame", {
      layout: "main",
      user: req.session.loggedUser})
      
    //res.sendFile(path.join(__dirname, "../client/main.html"))

  } else {

    res.redirect("/login")
  }
});

// endpoint Get a MONGO ATLAS consulta: userList.json
app.get("/users", (req, res) => {
  getData.getAll(personList => {
    res.send(personList)
  });

});

//Get a game-session devuelve el objeto gameSession
app.get("/game-session", (req,res) => {

  if(req.query.idSession) {
    getData.getGameSession(req.query.idSession, cbResponse => {
      res.send(cbResponse)
    })

  }else{
    res.sendStatus(500);
  }



})

//Verifica los userProgress
app.get("/usersProgress", (req,res) => {
  //Con la lista de usuario jugando hago un filtro
  if(req.query.usersPlaying) {
    getData.getAll()

  }


  //Devuelvo un array con los objetos de usuario

})


//Endpoint GET a MONGO ATLAS consulta: script.json
app.get("/scriptdb", (req, res) => {

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


app.listen(process.env.PORT || PORT, () => {
  console.log(`servido iniciado en http://localhost:${PORT}`);
});