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
client.on('connect', function(callback) {
    console.log('Connected to Broker')
});

// ------------------------------
// mqtt: Subscribed Topics
var subscribedTopics = ['ping', 'test', 'get_ping'];
for (var i in subscribedTopics) {
    client.subscribe(subscribedTopics[i]);
}

// var encoded_person = schema.Person.encode({
//     name: 'kanlaya',
//     id: 120
// })
// console.log('encoded_person:', encoded_person)
// encoded_person: <Buffer 0a 07 6b 61 6e 6c 61 79 61 10 78>

// ------------------------------
// mqtt: Publish Topics
client.publish('get_ping');

// function: save topic into database
var saveTopic = function(payload) {
    var data = schema.Topic.decode(payload)
    var findData = {
        room: data.room,
        node: data.node
    }
    var updateData = {
        sensors: data.sensors
    }
    var mycol = db.collection('topics')
    mycol.findOneAndUpdate(findData, { $set: updateData }, { upsert: true }, function(err, cb) {
        if (err) { return console.log('Error:', err) }
        console.log('Updated:', findData)
    })
}

// ------------------------------
// mqtt: On topic
var topicFunction = function(topic, payload) {
    var topics = {
        'ping': function() {
            saveTopic(payload)
        },
        'default': function() {
            // console.log('Sub topic:', topic, 'payload:', payload)
            console.log('Sub topic:', topic)
        }
    }
    return (topics[topic] || topics['default'])()
}
client.on('message', function(topic, payload) {
    // console.log('Subscribed topic:', topic)
    topicFunction(topic, payload)
});

module.exports = client