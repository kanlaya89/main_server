var app = angular.module('INDEX', []);
// var socket = io.connect();
var imported = document.createElement('script');

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope, $location, $http) {
    $scope.selectedRoomNumber = "";
    $scope.selectedSensorNode = "";
    $scope.selectedSensorType = "";
    // in database
    var rooms = [],
        nodes = [],
        sensors = [],

        // base data when selected wildcard
        baseNodes = {},
        baseSensors = {}

    baseNodeList = ['A', 'B']
    baseSensorsList = ['temp', 'ill', 'heart_w', 'breath_w', 'motion_w', 'heart', 'breath', 'motion']

    // set key-value object
    var setObj = function(setObj, arrays) {
        for (var i in arrays) {
            setObj[arrays[i]] = arrays[i]
        }
    }

    setObj(baseNodes, baseNodeList)
    setObj(baseSensors, baseSensorsList)


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
    http('GET', 'http://localhost:3000/find/all/', function(err, callback) {
        if (err) { console.log(err) }
        var data = callback
        rooms = data.rooms
        nodes = data.nodes
        sensors = data.sensors

        console.log(sensors)

        // set rooms
        setRooms(rooms)

        // set nodes in room
        $scope.changedRoom = function(room, node) {
            $scope.selectedSensorType = "";
            $scope.selectedSensorNode = "";
            if (node === "") {
                setNodes(room)
            } else {
                setSensors(room, node)
            }
        }

        //set sensor object in room & node
        $scope.changedNode = function(room, node) {
            $scope.selectedSensorType = "";
            setSensors(room, node)
        }
    })

    var setRooms = function(data) {
        $scope.rooms = {}
        for (var i in data) {
            $scope.rooms[data[i]] = data[i]
        }
        $scope.rooms['特定なし'] = '+'
        $scope.rooms['全ての部屋・ノード・センサ'] = '#'
    }

    var setNodes = function(room) {
        $scope.nodes = {}
        if (room === '+') {
            $scope.nodes = baseNodes
        } else {
            for (var i in nodes) {
                if (nodes[i].path === room) {
                    $scope.nodes[nodes[i].name] = nodes[i].name
                }
            }
        }
        $scope.nodes["特定なし"] = "+"
        $scope.nodes["全てのノード・センサ"] = "#"
    }

    var setSensors = function(room, node) {
        $scope.sensors = {}
        var sensorList = []
        if (node === '+' || room === '+') {
            $scope.sensors = baseSensors
        } else {
            for (var i in sensors) {
                if (sensors[i].path === room + '/' + node) {
                    sensorList = sensors[i].type
                    break
                }
            }
        }
        setObj($scope.sensors, sensorList)
        $scope.sensors['全センサ'] = '#'
    }

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
});