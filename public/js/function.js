// ------------------------------
// mqtt: connect
// var client = new Paho.MQTT.Client("10.10.18.20", 8080, 'id:' + parseInt(Math.random() * 100, 10));

// ------------------------------
// function: 

// convert sensor type to jp name
var convertSensorName = function(name) {
    var sensorName = {
        'temp': '温度',
        'ill': '照度',
        'heart_w': '心拍波形',
        'breath_w': '呼吸波形',
        'motion_w': '体動波形',
        'heart': '心拍数',
        'default': name
    }
    return (sensorName[name] || sensorName['default'])
}

// canvas chart
var createChart = function(chartNameV, titleV, intervalV, dataLengthV, dataV) {
    var dps = [],
        time = new Date(),
        chart = new CanvasJS.Chart(chartNameV, {
            title: {
                text: titleV
            },
            data: [{
                type: 'line',
                xValueType: 'dateTime',
                dataPoints: dps
            }]
        })

    var updateInterval = intervalV,
        dataLength = dataLengthV
    var updateChart = function(count) {
            // add interval duration to time				
            count = count || 1;
            // count is number of times loop runs to generate random dataPoints
            for (var j = 0; j < count; j++) {
                // add interval duration to time				
                time.setTime(time.getTime() + updateInterval);
                dps.push({
                    x: time.getTime(),
                    y: dataV
                });
            };
            if (dps.length > dataLength) {
                dps.shift();
            }
            chart.render();
        }
        // generates first set of dataPoints
    updateChart(dataLength);

    // update chart after specified time. 
    setInterval(function() { updateChart() }, updateInterval);
}

// ------------------------------
//object:

var sensorTypeObject = {
    'temp': {
        name: '温度',
        decode: function(buffer) {
            return TempMsg.decode(buffer)
        },
        period: 500
    },
    'ill': {
        name: '照度',
        decode: function(buffer) {
            return IllMsg.decode(buffer)
        },
        period: 500
    },
    'heart': {
        name: '心拍数',
        decode: function(buffer) {
            return HeartMsg.decode(buffer)
        },
        period: 5000
    },
    'heartW': {
        name: '心拍波形',
        decode: function(buffer) {
            return MicroWaveMsg.decode(buffer)
        },
        period: 10
    },
    'breathW': {
        name: '呼吸波形',
        decode: function(buffer) {
            return MicroWaveMsg.decode(buffer)
        },
        period: 10
    },
    'motionW': {
        name: '体動波形',
        decode: function(buffer) {
            return MicroWaveMsg.decode(buffer)
        },
        period: 10
    },
    'microW': {
        name: '心拍・呼吸・体動波形',
        period: 500
    },
    'commonInt': {
        name: '現在の人数',
        decode: function(buffer) {
            return CommonIntMsg.decode(buffer)
        }
    }
}

// ------------------------------
// protobuf: load
protobuf.load("../../schema.proto", function(err, root) {
    if (err) throw err;
    // Obtain a message type
    this.TempMsg = root.lookup('Temp')
    this.MicroWaveMsg = root.lookup('MicroWave')
    this.HeartMsg = root.lookup('Heart')
    this.IllMsg = root.lookup('Ill')
    this.CommonIntMsg = root.lookup('CommonInt')
});