var dbConnect = require('./database').dbConnect(function(err, db) {
    if (err) { return console.log('Error:', err) }

    // remove all topics before saving the new
    var removeTopics = function() {
        this.db.collection('topics').remove({}, function(err, cb) {
            if (err) { return console.log('Error:', err) }
            console.log('Removed all topics')
        })
    }
    removeTopics()
})

var mqtt = require('./mqtt.js').mqttClient
var app = require('./app'),
    http = require('http')


server = http.createServer(app)

server.listen(3000, function() {
    console.log("Running http-server on port 3000 der")
})