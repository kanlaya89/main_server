var router = require("express").Router(),
    config = require('../config')
var mqtt = require('../mqtt.js').mqttClient

// router.use("/topic", require("./topic.router.js"))
// router.use("/broker", require("./broker.router.js"))

router.use('/find', require('./find.router.js'))

router.get('/remove/topic', function(req, res) {
    this.db.collection('topics').remove({}, function(err, cb) {
        if (err) { return console.log('Error:', err) }
        res.send('remove topics and publish "get_ping" ')
    	mqtt.publish('get_ping', 'iuvuiiin')
        console.log('Removed all topics')
    })
})

router.get('/', function(req, res) {
    res.sendFile(config.rootPath + '/public/html/index.html')

})

module.exports = router;
