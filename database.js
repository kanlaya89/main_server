var MongoClient = require("mongodb").MongoClient
var mongodb_url = "mongodb://localhost:27017/thesis"

exports.dbConnect = function(callback) {
    MongoClient.connect(mongodb_url, function(err, database) {
        if (err) { return callback(err, null) }
        console.log("Connected to mongodb")
        this.db = database // Apply database to Global variable db
        return callback(null, database)
    })
}