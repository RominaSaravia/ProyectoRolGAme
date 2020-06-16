const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const exphbs = require("express-handlebars");
const mongodb = require("mongodb");
// const getGameData = require("gameData")
const getData = require("./useData.js");


const app = express();
app.use(bodyParser.json());


const userList = [];

app.engine("handlebars", exphbs({
  defaultLayout: "main", 
  layoutsDir: path.join(__dirname, "views/layout")
}))

app.set("view engine" , "handlebars");
app.set("views", path.join(__dirname , "views"));

app.use(express.static(path.join(__dirname,"../public")));
app.use(bodyParser.json());


//Un GET a la pagina inicial
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname,"../public/landing.html"));
  
});

//GET a la pagina de registro
app.get("/register-page", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"))
})

// GET de pagina principal
app.get("/main-page", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/main.html"))
})

// Post a /register
app.post("/register" , (req,res) =>{
  // verificar que recibí datos
  if (!req.body) {
    res.status(400).send("No se recibieron datos");
    return;
  };
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos");
    return;
  };
  // Valido si ya existe el username
  if (userList.filter(user => user.username === req.body.username).length > 0 ) {
    res.status(409).send("ya existe el usuario");
    return;  
  };
  
  userList.push ({
      username: req.body.username,
      password: req.body.password
    });
    res.status(200).send("usuario registrado");
    
});
  

// Post a login
app.post("/login" , (req,res) =>{
  // Validar datos ingresados
  if (!req.body) {
    res.status(400).send("No se recibieron datos");
    return;
  };
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos");
    return;
  };
  
  const foundUser = userList.filter(user => user.username === req.body.username);
  
  if (foundUser.length > 0 ) {
    const user = foundUser[0];
    
    if (user.password === req.body.password) {
      res.status(200).send("Usuario logeado");
      // la constraseña esta bien
    }else{
      res.status(403).send("Esta mal la password");
    }
    
  }else {
    res.status(403).send("No existe el usuario, necesita registrarse")
  }
  
});


// endpoint Get a MONGO ATLAS consulta: userList.json
app.get("/users", (req, res) => {
  getData.getAll(personList => {
    res.send(personList)
  });

});

//Endpoint GET a MONGO ATLAS consulta: script.json
app.get("/scriptdb", (req,res) => {
  
  getData.getGameScript( gameScript => {
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres) {
      res.json(gameScript);
    }else {
      res.json(gameScript.find(item => item.id.includes(req.query.idProgres) ));
      console.log()
    }
  });

}); 

//Endpoint GET consulta localmente: script.json 
app.get("/script", (req,res) => {
  
  getScript( gameScript => {
    
    // Una vez que llegaron los datos como parámetro se realiza un filtro
    if (!req.query.idProgres) {
      res.json(gameScript);
    }else {
      res.json(gameScript.find(item => item.id.includes(req.query.idProgres) ));
    }
  });

});  
  
/**
 * Funcion que consulta los datos del juego
 * 
 * @param {function} resultcallBack callback(gameScript:array)
 */
function getScript (resultcallBack) {
  fs.readFile(path.join(__dirname, "gameScript.json"), (err,data) => {
    
    if (err) {
      console.log("No se pudo leer el archivo.");
      resultcallBack([]);
    }else {
      resultcallBack(JSON.parse(data));
    }
  })
}


app.listen(4444, () => {
  console.log("servido iniciado en http://localhost:4444");
});