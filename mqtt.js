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
// mqtt: On topic
// client.on('message', function(topic, payload) {
//     if (topic === 'ping') {
//         decodeData = schema.Topic.decode(payload)
//     }
//     console.log(topic, decodeData)
// });


var test = {
    room: '1',
    node: 'a',
    sensors: ['temp', 'ill']
}

var encode_buf = schema.Topic.encode(test)
console.log('encode', encode_buf)
var decode_buf = schema.Topic.decode(encode_buf)
console.log('decode', decode_buf)

module.exports = client