const db = require("./const");

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

const getByName = (user, cbResult) => {
  db.mongoClient.connect(db.dbURL, db.config, (err, client) => {
    if (err) {
      cbResult(undefined);
      client.close();
    } else {
      const serverGame = client.db("Proyecto");
      const userCollection = serverGame.collection("ConfirmUsers");

      userCollection.findOne({ user: user }, (err, user) => {
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

module.exports = {
  getAll,
  getByName
};
