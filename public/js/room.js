var app = angular.module('ROOM', []);
var socket = io.connect();

"use strict";

// ------------------------------
// AngularJS
app.controller('myCtl1', function($scope){
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  var number = getURLParameter('number');
  $scope.number = number;

  socket.emit('room', number);
  socket.on('room'+ number, function(data) {
    var d = new Date();
    var now = d.getTime()/1000;
    var temp = data.temp.toFixed(1);
    var ill = data.ill;

    $('#temp').text(temp);
    $('#ill').text(ill);

    var timeChartData = [
    {
      label: "Temp",
      values:[{time: now, y: temp}]  
    }];

    var tempChart = $('#tempChart').epoch({ 
      type: 'time.line',
      data: timeChartData,
      axes: ['bottom', 'left', 'right'],
      windowSize: 120,
      queueSize: 10,
      range: [10,40]
    });

    var tempData = [{time: now, y:temp}];
    tempChart.push(tempData);

    var illChartData = [
    {
      label: "Ill",
      values:[{time: now, y: ill}]  
    }];

    var illChart = $('#illChart').epoch({ 
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


