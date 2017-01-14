var router = require("express").Router()

// path: /find/..
router.get('/', function(req, res) {
    res.send('find dababase...')
})

// find all
router.get('/topics', function(req, res) {
    var mycol = this.db.collection('topics')
    var data = {
        topics: [],
        rooms: []
    }
    mycol.find({}, { _id: 0 }).toArray(function(err, items) {
        if (err) { return res.send(err) }
        data.topics = items
        mycol.distinct('room', function(err, list) {
            if (err) { return res.send(err) }
            data.rooms = list.sort()
            res.send(data)
        })
    })
})

module.exports = router