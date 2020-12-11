const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";
const mongoConfig = { useUnifiedTopology: true };


const getGameScript = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL , mongoConfig , (err,client) => {
    if (err) {
      cbResult(undefined)
      client.close()
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("gameData");

      userCollection.find().toArray((err, AllData) => {
        if(err){
          cbResult(undefined)
        }else {
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
const getAll = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL, mongoConfig , (err,client) => {
    if (err) {
      cbResult([]);
      client.close();
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("ConfirmUsers");

      userCollection.find().toArray((err, personList) => {
        if(err) {
          console.log(`ERROR: ${err}`)
          cbResult([]);          
        }else {
          cbResult(personList);
          
        }
        
        client.close();
      });
    }
  });
}

const getById = (id, cbResult) => {
  mongodb.MongoClient.connect(mongoURL , mongoConfig , (err,client) => {
    if (err) {
      cbResult(undefined);
      client.close();
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("ConfirmUsers");

      userCollection.findOne( {id: id}, (err, user) => {
        if (err) {
          cbResult(undefined);
        }else{
          cbResult(user);
        }
        client.close();
      });
    };
  });
};


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
  mongodb.MongoClient.connect(mongoURL , mongoConfig , (err,client) => {
    if (err) {
      cbResult(undefined);
      client.close();
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("gameSessions");

      userCollection.findOne( {idSession: idSession}, (err, gameSession) => {
        if (err) {
          
          cbResult(undefined);
        }else{
          
          cbResult(gameSession);
        }
        client.close();
      });
    };
  });
};


/**
 * Crea un objeto de session de juego
 * @param {string} username 
 * @param {string} password 
 * @param {string} nameSession 
 * @param {function} cbResult CallBack: function (result: boolean) 
 */
const newGameSession = (username, password,nameSession, cbResult) => {

  mongo.mongoClient.connect(mongo.dbURL, mongo.config , (err, client,) => {
    if (err) {
      // Si no me pude conectar al server, retorno el false
      cbResult(false);
      return;

    } else {

      const serverDB = client.db("Proyecto");
      const usersCollection = serverDB.collection("gameSessions");

      const newSession = {
        idSession:nameSession,
        gameState: "0A",
        usersPlaying: [username],
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
   getAll,
   getById,
   getGameScript,
   getGameSession,
   newGameSession
   
  };