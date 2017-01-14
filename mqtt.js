var mqtt = require('mqtt'),
    protobuf = require('protocol-buffers'),
    fs = require('fs')

const Broker = require("./config").Broker

    "use strict";

// -----------------------------------
// protobuf: Schema
var schema = protobuf(fs.readFileSync('schema.proto'));

// ------------------------------
// mqtt: connect
client = mqtt.connect('ws://' + Broker.ip + ':' + Broker.port);
client.on('connect', function(ck) {
    console.log('Connected to Broker')
});

// ------------------------------
// mqtt: Subscribed Topics
var subscribedTopics = ["#"];
for (var i in subscribedTopics) {
    client.subscribe(subscribedTopics[i]);
}

// ------------------------------
// mqtt: Publish Topics
client.publish('get_ping');

// ------------------------------
// mqtt: On topic
client.on('message', function(topic, payload) {
    if (topic === 'ping') {
        console.time('ping')
        var data = schema.Topic.decode(payload)
        var findData = {
            room: data.room,
            node: data.node
        }
        var updateData = {
            sensors: data.sensors
        }
        console.log(topic, data)
        var mycol = db.collection('topics')
        mycol.findOneAndUpdate(findData, { $set: updateData }, { upsert: true }, function(err, cb) {
            if (err) { return console.log('Error:', err) }
            console.log('Updated:', findData)
        })
        console.timeEnd('ping')

    } else {
        console.log(topic, payload)
    }

});

module.exports = client