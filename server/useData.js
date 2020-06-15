
const fs = require("fs");
const path = require("path");
const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";


const getGameScript = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL ,  { useUnifiedTopology: true }, (err,client)=> {
    if (err) {
      res.status(500).send(err);
      client.close()
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("GameData");

      userCollection.find({}).toArray((err, AllData) => {
        cbResult(AllData);
        client.close();

      });
    }
  });
}


const getAll = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL ,  { useUnifiedTopology: true }, (err,client)=> {
    if (err) {
      res.status(500).send(err);
      client.close()
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("Users");

      userCollection.find({}).toArray((err, personList) => {
        cbResult(personList);
        client.close();

      });
    }
  });
}
const getById = (id, cbResult) => {
  mongodb.MongoClient.connect(mongoURL ,  { useUnifiedTopology: true }, (err,client)=> {
    if (err) {
      cbResult();
      client.close();
    }else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("Users");

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

 module.exports = { 
   getAll,
   getById,
   getGameScript
  };