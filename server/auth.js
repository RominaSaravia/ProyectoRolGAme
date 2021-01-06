const db = require("./const");

/**
 * 
 * Función que valida user/pass. Retorna un objeto con un boolean que indica si las credenciales
 * son válidas y un string con un mensaje para errores.
 * 
 * funcion que valida usuario
 * @param {string} user username
 * @param {string} pass password
 * @param {function} cbResult Callback: function(result: { 
 * user?: {
    username: string,
    userGameState:string
    }, 
    msg: string 
  })
 */
const login = (user, pass, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false con un mensaje apropiado para el front
      cbResult({
        msg: "Sorry, site is under maintenance now, retry later."
      });

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      usersCollection.findOne({ user: user, password: pass }, (err, foundUser) => {
        if (err) {
          // Si no pude consultar la colección, también retorno false con un mensaje
          cbResult({
            msg: "Sorry, the site is under maintenance now, retry later."
          });

        } else {
          // Si pude consultar los datos, valido si encontré esa combinación usr/pwd o no.
          if (!foundUser) {
            cbResult({
              msg: "Invalid user/password."
            });
          } else {
            cbResult({
              user: {
                username: foundUser.user,
                UserGameState: foundUser.gameState
              }
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
 * user: {user:string,password:string }
 * })  
 */
const getUser = (username, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
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

  db.mongoClient.connect(db.dbURL, db.config, (err, client,) => {
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

const changepass = (username, newPassword, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client,) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false
      cbResult(false);
      return;

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      let findQuery = { user: username };
      let updateQuery = { $set: {password: newPassword}  }

      //Actualizo la clave en la DB
      usersCollection.updateOne( findQuery , updateQuery , (err, result) => {
        if(err) {
          cbResult(false)
        }else {
          cbResult(true)
        }

        client.close();

      });
    }

  })

}

/**
 * Crea un objeto de session de juego
 * @param {string} creator 
 * @param {array} users 
 * @param {string} password 
 * @param {string} gameId
 * @param {function} cbResult CallBack: function (result: boolean) 
 */
const newGameSession = (users, password, gameId, creator, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client,) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false
      cbResult(false);
      return;

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("gameSessions");

      const newGameSession = {
        creator,
        users: [
          {name:users[0], progresId: '0A'},
          {name:users[1], progresId: '0A'},
          {name:users[2], progresId: '0A'}
        ],
        password,
        gameId
      };

      usersCollection.insertOne(newGameSession, (err, result) => {
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
  login,
  getUser,
  registerUser,
  changepass,
  newGameSession
}