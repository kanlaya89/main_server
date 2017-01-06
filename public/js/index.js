var app = angular.module('INDEX', []);
// var socket = io.connect();
var imported = document.createElement('script');

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope, $location, $http) {
    var rooms = [],
        nodes = [],
        sensors = []

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
        $scope.changedRoom = function(room) {
            setNodes(room)
        }

        //set sensor object in room & node
        $scope.changedNode = function(room, node) {
            setSensors(room, node)
        }

    })

    var setRooms = function(data) {
        $scope.rooms = {}
        for (var i in data) {
            $scope.rooms[data[i]] = data[i]
        }
        $scope.rooms['全部屋'] = '+'
        $scope.rooms['全ての部屋・ノード・センサ'] = '#'
    }

    var setNodes = function(room) {
        $scope.nodes = {}
        for (var i in nodes) {
            if (nodes[i].path === room) {
                $scope.nodes[nodes[i].name] = nodes[i].name
            }
        }
        $scope.nodes["全ノード"] = "+"
        $scope.nodes["全てのノード・センサ"] = "#"
    }

    var setSensors = function(room, node) {
        $scope.sensors = {}
        var sensorList = []

        for (var i in sensors) {

            if (sensors[i].path === room + '/' + node) {
                sensorList = sensors[i].type
                for (var j in sensorList) {
                    $scope.sensors[sensorList[j]] = sensorList[j]
                }
                console.log('scope:', $scope.sensors)
                break

            }
        }

        $scope.sensors['全センサ'] = '#'
    }

    var topicName = "";
    $scope.selectedRoomNumber = "";
    $scope.selectedSensorNode = "";
    $scope.selectedSensorType = "";

    $scope.sensors = {
        "温度": "temp",
        "照度": "ill",
        "心拍波形": "heart_w",
        "呼吸波形": "breath_w",
        "体動波形": "motion_w",
        "心拍数": "heart",
        "全てのセンサ": "+"
    }
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