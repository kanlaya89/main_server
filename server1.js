var dbConnect = require('./database').dbConnect(function(err, db) {
    if (err) { return console.log("DB EORROR") }

})

app = require('./app'),
    http = require('http'),
    server = http.createServer(app),
    mqtt = require('./mqtt.js')

server.listen(3000, function() {
    console.log("Running http-server on port 3000")
})