var router = require("express").Router()
var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['time', 'data'];
var moment = require('moment')

// path: /find/..
router.get('/', function(req, res) {
    res.send('broker ...')
})


router.get('/:type/:period/:from-:to', function(req, res) {
    var type = req.params.type
    var period = req.params.period
    var from = req.params.from
    var to = req.params.to
    var pattern = ".*" + type + "." + period + "min"
    var fileName = 'broker_' + type + '_' + period + 'min.csv'
    var convertData = []

    console.log("work here")
    var mycol = this.db.collection('broker')
    mycol.find({ "time": { $gt: Number(from), $lt: Number(to) }, "topic": { $regex: pattern } }, { _id: 0, topic: 0 }).toArray(function(err, items) {
        if (err) { return res.send(err) }

        for (var i in items) {
            convertData.push({
                time: moment(items[i].time).format('hh:mm:ss'),
                data: items[i].data
            })
        }

        var csv = json2csv({ data: convertData, fields: fields });
        fs.writeFile(fileName, csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });

        res.send(convertData)
    })
})

module.exports = router