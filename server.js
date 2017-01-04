var express = require('express');
var router = express.Router();
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var mqtt = require('mqtt');
var protobuf = require('protocol-buffers');
var mongoose = require('mongoose');
var mosca = require('mosca');
var db = mongoose.connection;
var fs = require('fs');
var os = require('os');
const dns = require('dns');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));

// -----------------------------------
//  Read from config.js
var Broker = require("./config").Broker;
var ListenPort = require("./config").ListenPort;

var portobuf_schema = protobuf(fs.readFileSync('schema.proto'));
var mogoHost = require("./mongoModel").host;

"use strict";
// -----------------------------------
//  TESTING



// ------------------------------
// connect: MongoDB, Broker, Socket
// mongodb
mongoose.connect('mongodb://localhost/thesis');
db.on('error', console.error.bind(console, 'MongoDB connecting error'));
db.once('open', function() {
    console.log('MongoDB is connected');
});
// broker
client = mqtt.connect('ws://' + Broker.ip + ":" + Broker.port);

client.on('connect', function(ck) {
    console.log('Connected to Broker')
});

// ------------------------------
// socket: on
io.on('connection', function(socket) {
    console.log("WebSocket on");
});

// ------------------------------
// mqtt: Subscribed Topics
var subscribedTopics = ["#"];
for (var i = 0; i < subscribedTopics.length; i++) {
    client.subscribe(subscribedTopics[i]);
}

// ------------------------------
// mqtt: Initial Publish
var buff = new Buffer("sh")
var buff2 = "kdjfo"
    // setInterval(function() {
    //     client.publish('test', buff)
    // }, 1000)


// ------------------------------
// mqtt: On topic
client.on('message', function(topic, payload) {
    // var data = portobuf_schema.Sensor.decode(payload);
    console.log(topic, payload)
});

// ------------------------------
// html: API
var HtmlPath = ("/public/html/");
app.get('/', function(req, res) {
    res.sendFile(__dirname + HtmlPath + "index.html");
});

// app.get('/topic/:number/:name/:type/', function (req, res) {
//   var number = req.param('number');
//   var name = req.param('name');
//   var type = req.param('type');
//   // if ( (name != null) && (type != null) ) {
//     // res.location("/roomNodeSensor.html?number="+number+"&name="+name+"&type="+type);
//   // }
//   // console.log('number:'+number, 'name:'+name, 'type:'+type);
// });

app.get('/room.html', function(req, res) {
    res.sendFile(__dirname + HtmlPath + "room.html");
});
app.get('/roomNodeSensor.html', function(req, res) {
    res.sendFile(__dirname + HtmlPath + "roomNodeSensor.html");
});
app.get('/protobuf.js', function(req, res) {
    res.sendFile(__dirname + "/public/html/protobuf.js");
});


// app.get('/schema.proto', function(req, res){
//   res.sendFile(__dirname + "/schema.proto");
// });

var request = require('request');
var parser = require('node-feedparser');
var feed = 'http://stackoverflow.com/feeds/question/10943544';


request(feed, function(err, res, body) {
    //console.log(body)
    parser(body, function(err, ret) {
        if (err) { return console.log(err) }
        var title = ret.site.title;
        console.log(title)
    });
});


// ------------------------------
// listening: on port 3000
http.listen(ListenPort, function() {
    console.log('Listening on port: ' + ListenPort);
});