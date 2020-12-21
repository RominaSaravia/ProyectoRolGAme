const db = require("./const");

const getGameScript = cbResult => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult(undefined)
      client.close()
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("gameData");

      userCollection.find().toArray((err, AllData) => {
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

/**
 * Devuelve toda la lista de usarios registrados
 * @param {function} cbResult 
 */
const getAll = cbResult => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult([]);
      client.close();
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("ConfirmUsers");

      userCollection.find().toArray((err, personList) => {
        if (err) {
          cbResult([]);
        } else {
          cbResult(personList);

        }

        client.close();
      });
    }
  });
}

const getById = (id, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult(undefined);
      client.close();
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("ConfirmUsers");

      userCollection.findOne({ id: id }, (err, user) => {
        if (err) {
          cbResult(undefined);
        } else {
          cbResult(user);
        }
        client.close();
      });
    };
  });
};



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
          console.log("Volvio la respuesta")
          console.log(gameSession)
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


module.exports = {
  getAll,
  getById,
  getGameScript,
  getAllGameSessions,
  getGameSession,

};