var app = angular.module('INDEX', []);
// var socket = io.connect();
var imported = document.createElement('script');

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope, $location, $http) {

    var rooms = [],
        nodes = [],
        sensors = [],

        roomList = {},
        nodeList = {},
        sensorList = {}

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

    http('GET', 'http://localhost:3000/find/all/', function(err, callback) {
        if (err) { console.log(err) }
        var data = callback
        rooms = data.rooms
        nodes = data.nodes
        sensors = data.sensors
        console.log(data.sensors)
    })





    var selectNodes = {}
        // find all rooms' number



    var nodeInRoom = function(room) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].path === room) {
                // selectNodes.push(nodes[i].name)
                selectNodes[nodes[i].name] = nodes[i].name
            }
        }
        selectNodes["全ノード"] = "+"
        selectNodes["全てのノード・センサ"] = "#"
        $scope.nodes = selectNodes

        console.log(selectNodes)
    }

    // var sensorInRoomNode = function(node, room) {
    //     for (var i in nodes)


    $scope.changedRoom = function(item) {
        selectNodes = []
        console.log(item)
        nodeInRoom(item)
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
    $scope.send = function() {
        var number = $scope.selectedRoomNumber,
            name = $scope.selectedSensorNode,
            type = $scope.selectedSensorType;
        var response = $http.get('http://localhost:3000/topic/' + topicName);
        response.success(function(data, status, headers, config) {
            alert("Ok.");
        });
        response.error(function(data, status, headers, config) {
            alert("Error.");
        });
        console.log('number:' + number, 'name:' + name, 'type:' + type);
    }
});