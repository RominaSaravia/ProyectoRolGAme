const mongoClient = require("mongodb").MongoClient;
const mongoURL = "mongodb+srv://Romina:R25l1194s@proyectorol.rl6g4.gcp.mongodb.net/Proyecto?retryWrites=true&w=majority";
const mongoConfig = { useUnifiedTopology: true };

module.exports = {
  mongodb:{
    mongoClient,
    dbURL:mongoURL,
    config:mongoConfig
  }
}