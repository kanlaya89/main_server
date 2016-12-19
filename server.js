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

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// -----------------------------------
//  Read from config.js
var BrokerIP = require("./config").BrokerIP
var BrokerPort = require("./config").BrokerPort;
var ListenPort = require("./config").ListenPort;

var HtmlPath = ("/public/html/");
var portobuf_schema = protobuf(fs.readFileSync('schema.proto'));
var mogoHost = require("./mongoModel").host;

"use strict";
// -----------------------------------
//  TESTING
// parameter middleware that will run before the next routes


// -----------------------------------
// setting: Broker
var settings = {
  port: BrokerPort,
  persistence: mosca.persistence.Memory
};

// -----------------------------------
//  run: Broker
var Broker =  new mosca.Server(settings, function(){
  console.log("Mosca is running");
});

// ------------------------------
// connect: MongoDB, Broker, Socket
// mongodb
mongoose.connect('mongodb://localhost/thesis');
db.on('error', console.error.bind(console, 'MongoDB connecting error'));
db.once('open', function() {
	console.log('MongoDB is connected');
});
// broker
client = mqtt.connect('mqtt://' + BrokerIP + ':' + BrokerPort);
// client = mqtt.connect('mqtt://' + BrokerIP);
client.on('connect', function(ck) {
	console.log('Connected to Broker')
});

// ------------------------------
// mqtt: Subscribed Topics
client.subscribe('node/#');

// ------------------------------
// mqtt: Initial Publish

// ------------------------------
// mqtt: On topic
client.on('message', function(topic, payload) {
  var data;
  if(topic.indexOf('sensor/all') >- 1) {
    data = portobuf_schema.AllSensors.decode(payload);
    io.emit('room'+data.node, data);
    console.log(topic, data);
  };
  if(topic.indexOf('ill') >- 1) {
    data = portobuf_schema.SensorInt.decode(payload);
    io.emit('sensor'+data.node, data);
    console.log(topic, data);
  };
});

// ------------------------------
// socket: on
io.on('connection', function(socket){
  socket.on('room', function(number){
    client.publish('server/node/'+number+'/sensor/all');
    console.log("clicked: "+ number);
  });
  socket.on('sensor', function(type){
    client.publish('server/node/all/sensor/'+type);
    console.log("clicked: "+ type);
  });
});

// ------------------------------
// html: API
app.get('/', function (req, res) {
   res.sendFile(__dirname + HtmlPath + "index.html" );
});

// app.get('/room/:number', function (req, res) {
//   var number = req.param('number');
//   res.redirect("../room.html?number=" + number);
//   console.log('room number', number);
// });

app.get('/room.html', function(req, res){
  res.sendFile(__dirname + HtmlPath + "room.html");
});
app.get('/sensor.html', function(req, res){
  res.sendFile(__dirname + HtmlPath + "sensor.html");
});

// ------------------------------
// listening: on port 3000
http.listen(ListenPort, function () {
  console.log('Listening on port: ' + ListenPort);
});


