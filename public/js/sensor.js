var app = angular.module('SENSOR', []);
var socket = io.connect();

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope){
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  var type = getURLParameter('type');
  $scope.type = type;
  console.log("clicked type:", type);

  socket.emit('sensor', type);
  socket.on('type'+ type, function(data) {
    var d = new Date();
    var now = d.getTime()/1000;
    var temp = data.temp.toFixed(1);
    var ill = data.ill;

    $('#ill').text(ill);

    var illChartData = [
    {
      label: "Ill",
      values:[{time: now, y: ill}]  
    }];

    var illChart = $('#sensorChart').epoch({ 
      type: 'time.line',
      data: illChartData,
      axes: ['bottom', 'left', 'right'],
      windowSize: 120,
      queueSize: 10,
      range: [0,1000],
      ticks: {left:8, right:8}
    });

    var illData = [{time: now, y:ill}];
    illChart.push(illData);


  });

});


