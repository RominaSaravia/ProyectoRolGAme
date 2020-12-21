const db = require("./const");

/**
 * Consulta la lista de aventuras, devuelve un array de objetos o un array vacio
 * @param {function} cbResult
 */
const getAll = (cbResult) => {

  db.mongoClient.connect(db.dbURL, db.config , (err, client) => {
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
 * Filtra por ID la lista de aventuras
 * @param {string} id
 * @param {function} cbResult Callback function( result:{
 * id: string,
 * name: string,
 * showPic: string,
 * single: boolean,
 * description: string
 * })
 * 
 * @returns {object || undefined}
 */
const getById = (id, cbResult) => {

  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
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