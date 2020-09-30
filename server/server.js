const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const PORT = 4444;

const getData = require("./useData.js");
const adventures = require("./adventures.js");
const auth = require("./auth.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Ruta para archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//Handlebars
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layout")
}));

//Un GET a la pagina inicial
app.get("/", (req, res) => {
  res.render("index");

});

//GET a la pagina de registro
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Post a /register
app.post("/register", (req, res) => {
  // verificar que recibí datos
  auth.getUser(req.body.user, (result) => {

    //No se pudo consultar los datos
    if (!result.success) {
      res.render("signup", {
        msg: {
          type: "failure",
          text: "No se pudo registrar, intente nuevamente"
        }
      })
      return;
    }

    if (result.user) {
      // Ya existe el usuario
      res.render("signup", {
        msg: {
          type: "failure",
          text: "Ya existe el usuario"
        }
      })
      return;
    }

    //Usuario no utilizado, valido password
    if (!req.body.pass || req.body.pass !== req.body.confirmPass) {
      res.render("signup", {
        msg: {
          type: "failure",
          text: "Datos invalidos, las contraseñas deben ser iguales"
        }
      });
      return;
    }

    // Procesar alta de usuario
    auth.registerUser(req.body.user, req.body.pass, result => {

      // Se pudo registrar, renderizo index con mesaje de exito
      if (result) {
        res.render("index", {
          msg: {
            type: "success",
            text: "Usuario registrado"
          }
        });

      // No se pudo registrar, renderizo signup con mesaje de error
      } else {
        res.render("signup", {
          msg: {
            type: "failure",
            text: "No se pudo registrar, intente más tarde"
          }
        });
      }

    });

  });
});

// Endpoint que valida user/pass
app.post("/login", (req, res) => {
  // // Validar datos ingresados
  auth.login(req.body.user, req.body.pass, cbResponse => {

    if (!cbResponse.valid) {
      res.render("index", {
        msg: {
          type: "failure",
          text: cbResponse.msg
        }
      });

    } else {
      // Consulta de las aventuras disponibles, armado de la home
      adventures.getAll(adventuresList => {
        res.render("home", { adventures: adventuresList });

      })
    }
  })


});

// Get Lista de aventuras
app.get("/adventures/:id", (req, res) => {

  adventures.getById(req.params.id, cbResponse => {
    res.render("adventure", {
      adventure: cbResponse
    });

  })

});

// GET de pagina principal
app.get("/main-page", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/main.html"))
});

// endpoint Get a MONGO ATLAS consulta: userList.json
app.get("/users", (req, res) => {
  getData.getAll(personList => {
    res.send(personList)
  });

});

//Endpoint GET a MONGO ATLAS consulta: script.json
app.get("/scriptdb", (req, res) => {

  getData.getGameScript(gameScript => {
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres) {
      res.json(gameScript);
    } else {
      res.json(gameScript.find(item => item.id.includes(req.query.idProgres)));
    }
  });

});


app.listen(process.env.PORT || PORT, () => {
  console.log("servido iniciado en http://localhost:4444");
});