var router = require("express").Router()

// path: /find/..
router.get('/', function(req, res) {
    res.send('find dababase...')
})

//----------------------------
// Function: 

// function: find all rooms
var findRooms = function(callback) {
    var datas = []
    this.db.collection('rooms').find({}, { number: 1, _id: 0 }).toArray(function(err, items) {
        if (err) { return callback(err, null) }
        for (var i = 0; i < items.length; i++) {
            datas[i] = items[i].number
        }
        return callback(null, datas)
    })
}

// function: find all nodes
var findNodes = function(callback) {
    var arrays = []
    this.db.collection('nodes').find({}, { path: 1, name: 1, _id: 0 }).toArray(function(err, items) {
        if (err) { return callback(err, null) }
        for (var i = 0; i < items.length; i++) {
            arrays[i] = items[i]
        }
        return callback(null, arrays)
    })
}

// function: find all sensors
var findSensors = function(callback) {
    var arrays = []
    this.db.collection('sensors').find({}, { path: 1, type: 1, _id: 0 }).toArray(function(err, items) {
        if (err) { return callback(err, null) }
        for (var i = 0; i < items.length; i++) {
            arrays[i] = items[i]
        }
        return callback(null, arrays)
    })
}

// find all
router.get('/all', function(req, res) {
    var data = {
        rooms: [],
        nodes: [],
        sensors: []
    }
    findRooms(function(err, callback) {
        if (err) { res.send(err) }
        data.rooms = callback
        findNodes(function(err, callback) {
            if (err) { res.send(err) }
            data.nodes = callback
            findSensors(function(err, callback) {
                if (err) { res.send(err) }
                data.sensors = callback
                res.send(data)
            })
        })
    })
})

// find all rooms
router.get('/all/rooms', function(req, res) {
    findRooms(function(err, callback) {
        if (err) { res.send(err) }
        res.send(callback)
    })
})

// find all nodes
router.get('/all/nodes', function(req, res) {
    findNodes(function(err, callback) {
        if (err) { res.send(err) }
        res.send(callback)
    })
})

// find all sensors
router.get('/all/sensors', function(req, res) {
    findSensors(function(err, callback) {
        if (err) { res.send(err) }
        res.send(callback)
    })
})

// find all nodes in a room
router.get('/nodes/:roomNumber', function(req, res) {
    var roomNumber = req.param('roomNumber')
    console.log('find nodes in room:' + roomNumber)
    var col = this.db.collection('nodes')
    col.find({ path: { $eq: roomNumber } }, { nodeName: 1, _id: 0 }).toArray(function(err, items) {
        if (err) { return res.send('ERR: ', err) }
        var arrays = []
        for (var i = 0; i < items.length; i++) {
            arrays[i] = items[i].nodeName
        }
        res.send(arrays)
    })
})

// find all topics in a room && a node 
router.get('/sensors/:roomNumber/:nodeName', function(req, res) {
    var roomNumber = req.param('roomNumber')
    var nodeName = req.param('nodeName')
    console.log('find sensors in room:' + roomNumber + ' node:' + nodeName)
    var col = this.db.collection('sensors')
    col.find({ path: { $eq: roomNumber + '/' + nodeName } }, { type: 1, _id: 0 }).toArray(function(err, items) {
        if (err) { return res.send('ERR: ', err) }
        res.send(items[0].type)
    })
})

module.exports = router