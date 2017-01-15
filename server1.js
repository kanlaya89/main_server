var dbConnect = require('./database').dbConnect(function(err, db) {
    if (err) { return console.log('Error:', err) }

    // remove all topics before saving the new
    this.db.collection('topics').remove({}, function(err, cb) {
        if (err) { return console.log('Error:', err) }
        console.log('remove all topics')
    })
})

var mqtt = require('./mqtt.js'),
    app = require('./app'),
    http = require('http'),
    server = http.createServer(app)

server.listen(3000, function() {
    console.log("Running http-server on port 3000")
})