var router = require("express").Router(),
    config = require('../config')

// router.use("/topic", require("./topic.router.js"))
// router.use("/broker", require("./broker.router.js"))

router.use('/find', require('./find.router.js'))

router.get('/', function(req, res) {
    res.sendFile(config.rootPath + '/public/html/index.html')

})

module.exports = router;