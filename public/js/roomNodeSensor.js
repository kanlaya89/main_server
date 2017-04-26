var currentTopic = ""

// ------------------------------
// AngularJS
app.controller('roomNodeSensor', function($scope, $routeParams, $rootScope, $location) {
    var sss = os.ENV("")
    var client = new Paho.MQTT.Client("www2.nm.cs.uec.ac.jp", 9001, 'id:' + parseInt(Math.random() * 100, 10));

    var sensorValue
    var isConnected = false

    var room = $routeParams.room,
        node = $routeParams.node,
        sensor = $routeParams.sensor

    // apply currentTopic as route when first open a page
    currentTopic = room + "/" + node + "/" + sensor
    $scope.roomNumber = room;
    $scope.nodeName = node;
    $scope.sensorType = sensorTypeObject[sensor].name

    // when route has changed, should Update graph
    $scope.$on('$routeChangeStart', function(next, current) {
        // unsubscribe previous topic
        var previous_sensor = $routeParams.sensor
        if (previous_sensor == 'heartW' || previous_sensor == 'motionW' || previous_sensor == 'breathW') {
            var previousTopic = $routeParams.room + "/" + $routeParams.node + "/micro_w"
        } else {
            var previousTopic = $routeParams.room + "/" + $routeParams.node + "/" + previous_sensor;
        }
        client.unsubscribe(previousTopic)
        console.log("unsubscribe ", previousTopic)

        // apply new Topic (route)
        var current_sensor = current.params.sensor
        if (current_sensor == 'heartW' || current_sensor == 'motionW' || current_sensor == 'breathW') {
            currentTopic = current.params.room + "/" + current.params.node + "/micro_w"
        } else {
            currentTopic = current.params.room + "/" + current.params.node + "/" + current_sensor
        }

        console.log("currentTopic: ", currentTopic)
    });

    // ------------------------------
    // MQTT

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    if (isConnected === false) {
        client.connect({ onSuccess: onConnect });
    }

    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("Connected mqtt");
        isConnected = true

        // mqtt: Subscribed Topics
        if (sensor == 'heartW' || sensor == 'breathW' || sensor == 'motionW') {
            console.log("subscribe /micro_w")
            client.subscribe(room + '/' + node + '/micro_w');
        } else {
            console.log("subscribe ", sensor)
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
        console.log("onMessageArrived: ", message.destinationName)
        var decodeData = sensorTypeObject[sensor].decode(message.payloadBytes)
            // console.log('decodeData:', decodeData)
        sensorValue = parseInt(decodeData[sensor])
            // console.log('sensorValue:', sensorValue)
        if (sensor === 'heart') {
            $('#sensorValue').text(sensorValue + '  確度：' + decodeData.accuracy);
            console.log('heart:', sensorValue, 'accuracy:', decodeData.accuracy)
        } else {
            $('#sensorValue').text(sensorValue);
        }
    }
    //--------------------
    // casvas chart
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

    var updateInterval = sensorTypeObject[sensor].period
    console.log('updateInterval:', updateInterval)
    var dataLength = 50 * 1000 / updateInterval; // number of dataPoints visible at any point

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


});