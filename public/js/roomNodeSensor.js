// "use strict";
var client = new Paho.MQTT.Client("10.10.18.20", 8080, 'id:' + parseInt(Math.random() * 100, 10));

var sensorValue

// ------------------------------
// AngularJS
app.controller('roomNodeSensor', function($scope, $routeParams, $rootScope, $location) {

    var room = $routeParams.room,
        node = $routeParams.node,
        sensor = $routeParams.sensor

    $scope.roomNumber = room;
    $scope.nodeName = node;
    $scope.sensorType = sensorTypeObject[sensor].name


    // ------------------------------
    // MQTT

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({ onSuccess: onConnect });

    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("Connected mqtt");

        // mqtt: Subscribed Topics
        if (sensor == 'heartW' || sensor == 'breathW' || sensor == 'motionW') {
            client.subscribe(room + '/' + node + '/micro_w');
        } else {
            client.subscribe(room + '/' + node + '/' + sensor);
        }
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        // if (sensor === 'micro_w') {

        // } else {
        var decodeData = sensorTypeObject[sensor].decode(message.payloadBytes)
        console.log('decodeData:', decodeData)
        sensorValue = parseInt(decodeData[sensor])
        console.log('sensorValue:', sensorValue)
        if (sensor === 'heart') {
            $('#sensorValue').text(sensorValue + '  確度：' + decodeData.accuracy);
            console.log('heart:', sensorValue, 'accuracy:', decodeData.accuracy)
        } else {
            $('#sensorValue').text(sensorValue);
        }
        // }
    }
    //--------------------
    // casvas chart

    window.onload = function() {
        var dps = []; // dataPoints
        var time = new Date
        var chart = new CanvasJS.Chart("canvasChart", {
            title: {
                text: $scope.sensorType
            },
            data: [{
                type: "line",
                xValueType: "dateTime",
                dataPoints: dps
            }]
        });

        // starting at 9.30 am
        var updateInterval = sensorTypeObject[sensor].period
        console.log('updateInterval:', updateInterval)
        var dataLength = 100 * 1000 / updateInterval; // number of dataPoints visible at any point

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