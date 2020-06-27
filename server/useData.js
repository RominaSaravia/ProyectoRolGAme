const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";


const getGameScript = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL ,  { useUnifiedTopology: true }, (err,client)=> {
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


const getAll = (cbResult) => {
  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err,client)=> {
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
  mongodb.MongoClient.connect(mongoURL ,  { useUnifiedTopology: true }, (err,client)=> {
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

 module.exports = { 
   getAll,
   getById,
   getGameScript
  };