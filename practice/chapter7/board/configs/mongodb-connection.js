const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://kttak0315:pvdrlm3gRCMtrhyE@cluster0.atil3ka.mongodb.net/board";

module.exports = function (callback) {
    return MongoClient.connect(uri, callback);
};