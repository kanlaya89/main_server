var router = require("express").Router()

// path: /find/..
router.get('/', function(req, res) {
    res.send('broker ...')
})

module.exports = router