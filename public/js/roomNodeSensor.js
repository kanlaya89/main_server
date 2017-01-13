// "use strict";
var sensorValue
var client = new Paho.MQTT.Client("192.168.11.148", 8080, 'id:' + parseInt(Math.random() * 100, 10));

// ------------------------------
// AngularJS
app.controller('roomNodeSensor', function($scope, $routeParams, $rootScope, $location) {

    var room = $routeParams.room,
        node = $routeParams.node,
        sensor = $routeParams.sensor

    console.log('room:', room)

    $scope.roomNumber = room;
    $scope.nodeName = node;
    $scope.sensorType = convertSensorName(sensor)


    // ------------------------------
    // protobuf
    protobuf.load("../../schema.proto", function(err, root) {
        if (err) throw err;

        // Obtain a message type
        this.SensorMessage = root.lookup("Sensor")
        this.TempMessage = root.lookup('Temp')

        // Encode a message
        var buffer = SensorMessage.encode({
            room: '802',
            node: 'A',
            temp: 79
        }).finish();
        console.log('edcode:');
        console.log(buffer);

        var message = SensorMessage.decode(buffer);
        console.log('decode:');
        console.log(message);

        var buf2 = TempMessage.encode({ temp: 99 }).finish()
        var mes2 = TempMessage.decode(buf2)
        console.log("TempMessage decode test: ", mes2.temp)

    });

    // ------------------------------
    // MQTT

    // Create a client instance

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
        client.subscribe(room + '/' + node + '/' + sensor);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:")
        console.log(message.payloadBytes)
        var temp_msg = TempMessage.decode(message.payloadBytes).temp
        sensorValue = parseInt(temp_msg.toFixed(1))
        $('#sensorValue').text(sensorValue);
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
        var updateInterval = 500;
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