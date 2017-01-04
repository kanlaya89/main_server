var app = angular.module('RoomNodeSensor', []);
var socket = io.connect();

console.log(moment().format('h:mm:ss'));

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope) {
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }
    var number = getURLParameter('number');
    var name = getURLParameter('name');
    var type = getURLParameter('type');

    $scope.roomNumber = number;
    $scope.nodeName = name;

    switch (type) {
        case 'temp':
            $scope.sensorType = '温度';
            break;
        case 'ill':
            $scope.sensorType = '照度';
            break;
        case 'heart_w':
            $scope.sensorType = '心拍波形';
            break;
        case 'motion_w':
            $scope.sensorType = '呼吸波形';
            break;
    }
    // ------------------------------
    // protobuf
    // protobuf.load("../../schema.proto", function(err, root) {
    //     if (err) throw err;

    //     // Obtain a message type
    //     this.SensorMessage = root.lookup("Sensor");

    //     // Encode a message
    //     var buffer = SensorMessage.encode({
    //         room: '802',
    //         node: 'A',
    //         temp: 79
    //     }).finish();
    //     console.log('edcode:');
    //     console.log(buffer);

    //     var message = SensorMessage.decode(buffer);
    //     console.log('decode:');
    //     console.log(message);

    // });

    // ------------------------------
    // MQTT

    // Create a client instance
    client = new Paho.MQTT.Client("10.10.1.44", 8080, "kj");

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({ onSuccess: onConnect });

    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("Connected mqtt");

        // ------------------------------
        // mqtt: Subscribed Topics
        client.subscribe(number + '/' + name + '/' + type);
        console.log("topic: " + number + '/' + name + '/' + type)
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log('message')
            // var payload = JSON.parse(message.payloadString)
        payload = message.payloadString
        console.log("onMessageArrived:")
        console.log(parseInt(payload))

        sensorValue = parseInt(payload)
        $('#sensorValue').text(sensorValue);

        var d = new Date();
        var now = d.getTime() / 1000;
        var chartData = [{
            label: "Sensor",
            values: [{ time: now, y: sensorValue }]
        }];

        var chart = $('#chart').epoch({
            type: 'time.line',
            data: chartData,
            axes: ['bottom', 'left', 'right'],
            windowSize: 120
                // range: [10,40]
        });

        var data = [{ time: now, y: sensorValue }];
        chart.push(data);
    }
    //--------------------
    // casvas chart
    window.onload = function() {
        var now = moment().format('h:mm:ss');

        var dps = []; // dataPoints

        var chart = new CanvasJS.Chart("canvasChart", {
            title: {
                text: "Live Random Data"
            },
            data: [{
                type: "line",
                dataPoints: dps
            }]
        });

        var xVal = now;
        var yVal = sensorValue;
        var time = new Date;
        time.setHours(moment().format('h'));
        time.setMinutes(moment().format('mm'));
        time.setSeconds(moment().format('ss'));
        time.setMilliseconds(00);
        // starting at 9.30 am
        var updateInterval = 100;
        var dataLength = 500; // number of dataPoints visible at any point

        var updateChart = function(count) {
            // add interval duration to time				
            count = count || 1;
            // count is number of times loop runs to generate random dataPoints
            for (var j = 0; j < count; j++) {
                // add interval duration to time				
                time.setTime(time.getTime() + updateInterval);
                dps.push({
                    x: time.getTime(),
                    y: sensorValue
                });

            };
            if (dps.length > dataLength) {
                dps.shift();
            }

            chart.render();

        };

        // generates first set of dataPoints
        updateChart(dataLength);

        // update chart after specified time. 
        setInterval(function() { updateChart() }, updateInterval);

    }





});