const PORT = 4444;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expSession = require("express-session");

const authRouter = require("./routers/authRouter");
const pagesRouter = require("./routers/pagesRouter");
const adventureRouter = require("./routers/adventuresRouter");
const ingameRouter = require("./routers/ingameRouter");

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

//LANDING
app.get("/", (req, res) => {
  if (req.session.loggedUser) {
    res.redirect("/adventure/home");
  } else {
    res.redirect("/pages/login");
  }

});



//Routers
app.use("/auth", authRouter);
app.use("/pages", pagesRouter);
app.use("/adventure", adventureRouter);
app.use("/ingame", ingameRouter);


app.listen(process.env.PORT || PORT, () => {
  console.log(`servido iniciado en http://localhost:${PORT}`);
});