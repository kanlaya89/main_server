var express = require('express'),
    router = express.Router(),
    app = express(),
    bodyParser = require('body-parser'), // Parse incoming request bodies in a middleware before handle
    routers = require('./routers')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/html'));

// allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE");
    next();
});

// control router
app.use('/', routers)

module.exports = app