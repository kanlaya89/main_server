var mqtt = require('mqtt'),
    protobuf = require('protocol-buffers'),
    fs = require('fs'),
    mqttPacket = require('mqtt-packet'),
    moment = require('moment')

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

client.on('message', function(topic, payload) {
    // console.log(payload.toString())
    // console.log('Subscribed topic:', topic)
    if (topic.includes('$SYS/broker/load/bytes/')) {
        saveBroker(topic, payload.toString())
    } else {
        topicFunction(topic, payload)
    }
});

// ------------------------------
// mqtt: Subscribed Topics
// var subscribedTopics = ['ping', "$SYS/broker/load/bytes/received/+", '$SYS/broker/load/bytes/sent/+', '#'];
var subscribedTopics = ['ping'];
for (var i in subscribedTopics) {
    client.subscribe(subscribedTopics[i]);
}


// ------------------------------
// mqtt: Publish Topics

// function: save topic into database
var saveTopic = function(payload) {
    // var data = schema.Topic.decode(payload)
    console.log("saveTopic1")
    var data = JSON.parse(payload.toString())
    console.log("data1: ", data)
    console.log('data97:', data.room)

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
var saveBroker = function(topic, data) {
    var mycol = db.collection('broker')
    mycol.insert({
        time: Date.now(),
        topic: topic,
        data: data
    }, function(err, cb) {
        if (err) { return console.log('Error:', err) }
        console.log('insert:', topic)
    })
}

// ------------------------------
// mqtt: On topic
var topicFunction = function(topic, payload) {
    var data = payload.toString()
    var topics = {
        'ping': function() {
            saveTopic(payload)
        },
        'default': function() {
            console.log('Sub topic:', topic, 'payload:', data)
                //console.log('Sub topic:', topic)

        }
    }
    return (topics[topic] || topics['default'])()
}

// client.publish("test")
client.publish('get_ping')


var mqttClient = {

    publish: function(topic, message) {
        client.publish(topic, message)
    },
    subscribe: function(topic, message) {
        client.subscribe(topic, message)
    }

}
module.exports.mqttClient = mqttClient
    //module.exports = client