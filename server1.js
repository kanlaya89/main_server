var dbConnect = require('./database').dbConnect(function(err, db) {
    if (err) { return console.log("DB EORROR") }
    // require("./config").exp1(db, function(err, cb) {
    //     if (err) { return console.log("Config error") }
    //     require('./mqtt-client')(cb)
    // })
})

app = require('./app'),
    http = require('http'),
    server = http.createServer(app)

server.listen(3000, function() {
    console.log("Running http-server on port 3000")
})