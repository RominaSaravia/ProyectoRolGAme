const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";


/**
 * 
 * Función que valida user/pass. Retorna un objeto con un boolean que indica si las credenciales
 * son válidas y un string con un mensaje para errores.
 * 
 * funcion que valida usuario
 * @param {string} user username
 * @param {string} pass password
 * @param {function} cbResult Callback: function(result: { valid: boolean, msg: string })
 */
const login = (user, pass, cbResult) => {
  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false con un mensaje apropiado para el front
      cbResult({
        valid: false,
        msg: "Sorry, site is under maintenance now, retry later."
      });

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      usersCollection.findOne({ user: user, password: pass }, (err, foundUser) => {
        if (err) {
          // Si no pude consultar la colección, también retorno false con un mensaje
          cbResult({
            valid: false,
            msg: "Sorry, the site is under maintenance now, retry later."
          });

        } else {
          // Si pude consultar los datos, valido si encontré esa combinación usr/pwd o no.
          if (!foundUser) {
            cbResult({
              valid: false,
              msg: "Invalid user/password."
            });
          } else {
            // Si valida ok, no mando mensaje porque no se va a usar.
            cbResult({
              valid: true
            });
          }
        }

        client.close();
      });

    }

  });
}

/**
 * 
 * @param {string} username Nombre de usuario 
 * @param {function} cbResult CallBack: funcion(result: {
 * success: boolean
 * user: {
 *  user:string,
 *  password:string
 * }
 * })  
 */
const getUser = (username, cbResult) => {

  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client,) => {
    if (err) {
      cbResult({
        success: false
      });

    } else {
      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      usersCollection.findOne({ user: username }, (err, result) => {

        if (err) {
          cbResult({
            success: false
          });
        } else {
          cbResult({
            success: true,
            user: result
          })

        }

        client.close();

      });

    }
  });

}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {function} cbResult CallBack: function (result: boolean) 
 */
const registerUser = (username, password, cbResult) => {

  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client,) => {

    if (err) {
      // Si no me pude conectar al server, retorno el false
      cbResult(false);
      return;

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      const newUser = {
        gameState: "0A",
        user: username,
        password: password
      };

      usersCollection.insertOne(newUser, (err, result) => {
        if (err) {
          cbResult(false);

        } else {
          cbResult(true)
        }

        client.close();


      })
    }

  })

}

module.exports = {
  login: login,
  getUser: getUser,
  registerUser: registerUser
}