const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";


/**
 * @param {function} cbResult 
 */
const getAll = (cbResult) => {

  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      cbResult([]);
      client.close();

    }else {
      const serverDB = client.db("Proyecto");
      const adventuresCol = serverDB.collection("adventures");

      adventuresCol.find().toArray((err , adventuresList) => {
        if (err) {
          cbResult([])
        }else {
          cbResult(adventuresList);
        }
        client.close();

      });

    }
  })

}

/**
 * 
 * @param {string} id
 * @param {function} cbResult 
 * 
 * @returns {object || undefined}
 */
const getById = (id, cbResult) => {

  mongodb.MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      cbResult(undefined);
      client.close();

    }else {
      const serverDB = client.db("Proyecto");
      const adventuresCol = serverDB.collection("adventures");

      adventuresCol.findOne( {id: id}  , (err , adventure) => {
        if(err) {
          cbResult(undefined);
        }else {
          cbResult(adventure);
        }
        client.close();
      });

    }
  })

}


module.exports = {
  getAll: getAll,
  getById: getById
}