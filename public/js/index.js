var app = angular.module('myApp', ['ngRoute']);
// var socket = io.connect();
var imported = document.createElement('script');

"use strict";

// ------------------------------
// AngularJS
app.config(function($routeProvider) {
    $routeProvider
        .when("/broker", {
            templateUrl: "broker.html",
            controller: 'broker'
        })
        .when("/roomNodeSensor/:room/:node/:sensor", {
            templateUrl: "roomNodeSensor.html",
            controller: 'roomNodeSensor'
        })
        .when("/roomNode/:room/:node/", {
            templateUrl: "roomNode.html",
            controller: 'roomNode'
        })
})
app.controller('myCtl1', function($scope, $location, $http) {

    $scope.selectedRoomNumber = "#";
    $scope.selectedSensorNode = "";
    $scope.selectedSensorType = "";

    // in database
    var rooms = [],
        nodes = [],
        sensors = [],
        topics = []

    // HTTP function
    var http = function(method, url, callback) {
        options = {
            method: method,
            url: url
        }
        $http(options)
            .then(function success(res) {
                return callback(null, res.data)
            }),
            function fail(err) {
                return callback(err, null)
            }
    }

    // get all topics' infos data
    http('GET', 'http://localhost:3000/find/topics/', function(err, callback) {
        if (err) { console.log(err) }
        var data = callback
        topics = data.topics
        rooms = data.rooms

        // set rooms
        setRooms(rooms)

        // set nodes in room
        $scope.changedRoom = function(room, node) {
            $scope.selectedSensorType = "";
            $scope.selectedSensorNode = "";
            setNodes(room)
        }

        //set sensor object in room & node
        $scope.changedNode = function(room, node) {
            $scope.selectedSensorType = "";
            setSensors(room, node)
        }
    })

    var setRooms = function(data) {
        $scope.rooms = rooms
        $scope.rooms.push('+', '#')
    }

    var setNodes = function(room) {
        nodes = []
        if (room === '+') {

        } else {
            for (var i in topics) {
                if (topics[i].room === room) {
                    nodes.push(topics[i].node)
                }
            }
        }
        $scope.nodes = nodes
        $scope.nodes.push('+', '#')
    }

    var setSensors = function(room, node) {
        sensors = []
        $scope.sensors = sensors
        if (node === '+' || room === '+') {

        } else {
            for (var i in topics) {
                if (topics[i].room === room && topics[i].node === node) {
                    sensors = topics[i].sensors
                    break
                }
            }
        }
        for (var i in sensors) {
            if (sensors[i] === 'micro_w') {
                $scope.sensors.push('heartW', 'breathW', 'motionW')
            } else {
                $scope.sensors.push(sensors[i])
            }
        }

        $scope.sensors.push('#')
    }

    // create real topic to subscribe
    var topicName = "";
    $scope.topic = function() {
        if ($scope.selectedRoomNumber === '#') {
            disabledSensorNode = true;
            topicName = '#';
        } else {
            if ($scope.selectedSensorNode === '#') {
                topicName = $scope.selectedRoomNumber + '/' + $scope.selectedSensorNode;
            } else {
                topicName = $scope.selectedRoomNumber + '/' + $scope.selectedSensorNode + '/' + $scope.selectedSensorType;
            }
        }
        return topicName;
    }

    // subscribe button to route html api
    $scope.subscribe = function() {
        if ($scope.selectedSensorType === '#') {
            $location.path('/roomNode/' + $scope.selectedRoomNumber + '/' + $scope.selectedSensorNode)
        } else {
            $location.path('/roomNodeSensor/' + $scope.selectedRoomNumber + '/' + $scope.selectedSensorNode + '/' + $scope.selectedSensorType)
        }
    }

    // href broker page
    $scope.toBroker = function() {
        console.log('clicked broker')
        $location.path('/broker')
    };
    // refresh topic data
    $scope.refreshTopic = function() {

    }
});