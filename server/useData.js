const db = require("./const");

const getGameScript = (gameId , cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult(undefined)
      client.close()
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("allGamesScript");

      userCollection.findOne({id: gameId}, (err, AllData) => {
        if (err) {
          cbResult(undefined)
        } else {
          cbResult(AllData);
        }
        client.close();

      });
    }
  });
}


const getAllGameSessions = (nameFilter, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult([]);
      client.close();

    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("gameSessions");

      const filter = {}

      if (nameFilter) {
        filter.gameId = nameFilter;
      }

      userCollection.find(filter).toArray((err, gameSessionList) => {
        if (err) {
          cbResult([]);
        } else {
          gameSessionList = gameSessionList.map(session => ({
            oid: session._id.toString(),
            creator: session.creator,
            users: session.users,
            password: session.password,
            gameId: session.gameId
          }));

          cbResult(gameSessionList);

        }

        client.close();
      });
    }
  });

}


/**
 * Devuelve un objeto de session de la sala de juego
 * 
 * @param {string} idSession 
 * @param {function} cbResult CallBack: function(
 * result:{
 * idSession:string,
 * gameState:string,
 * usersPlaying:array,
 * password:string
 * })
 */
const getGameSession = (idSession, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult(undefined);
      client.close();
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("gameSessions");

      userCollection.findOne({ _id: new db.mongodb.ObjectID(idSession) }, (err, gameSession) => {
        if (err) {
          cbResult(undefined);

        } else {
          cbResult({
            oid: gameSession._id.toString(),
            creator:gameSession.creator,
            users: gameSession.users,
            password: gameSession.password,
            gameId:gameSession.gameId
          });
        }
        client.close();
      });
    };
  });
};


const updateUsergameProgress = (username, newGameState, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client,) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false
      cbResult(false);
      return;

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("ConfirmUsers");

      let findQuery = { user: username };
      let updateQuery = { $set: {gameState: newGameState}  }

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

module.exports = {
  getGameScript,
  getAllGameSessions,
  getGameSession,
  updateUsergameProgress

};