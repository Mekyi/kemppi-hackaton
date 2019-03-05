var chart4 = document.getElementById("history-chart");

var chartTestData = [{
    "timestamp":"05/03/2019, 08:11:22","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 09:12:22","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 10:13:22","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 11:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 12:15:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 13:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 14:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 15:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 16:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 17:14:23","type":"TEMP","value":22.5},
    {"timestamp":"05/03/2019, 18:14:23","type":"TEMP","value":22.5}];

var plugin = Chart.pluginService.register({
    beforeDraw: function (chart) {
      if (chart.config.options.elements.center) {
        //Get ctx from string
        var ctx = chart.chart.ctx;
  
        //Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
        //Start with a base font of 30px
        ctx.font = "35px " + fontStyle;
  
        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);
  
        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight);
  
        //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom)/ 1.75);
        ctx.font = fontSizeToUse+"px " + fontStyle;
        ctx.fillStyle = color;
  
        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
      }
    }
  });

function updateAirQuality(value) {
    var qualityString;
    var goodColor = '#3f993a';
    var mediumColor = '#ffd400';
    var badColor = '#F57300';

    if (value < 33) {
        qualityString = 'GOOD'
        $('#air-quality-bar').attr('class', 'progress-bar bg-success');
    } else if (value >= 33) {
        qualityString = 'MEDIUM'
        $('#air-quality-bar').attr('class', 'progress-bar bg-warning');
    } else if (value > 66) {
        qualityString = 'BAD'
        $('#air-quality-bar').attr('class', 'progress-bar bg-danger');
    }

    $('#air-quality-bar').attr('style', 'width:' + value +'%');
    $('.air-quality-value').text(qualityString);
}

function updateTemperature(value) {
    $('#temperature-bar').attr('style', 'width:' + value +'%');
    $('.temperature-value').text(value + ' °C');
}

function updateAudioLevel(value) {
    if (value === true) {
        $('.audio-value').text('TOO LOUD');
        $('.audio-value').css('color', '#F57300');
    } else {
        $('.audio-value').text('GOOD');
        $('.audio-value').css('color', '#3f993a');
    }
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  createHistory(chartTestData, "air quality");
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function createHistory(chartdata, chartlabel){
    var labels = chartdata.map(function(e) {
        return e.timestamp;});
    var data = chartdata.map(function(e) {
        return e.value;});
    var historyChart = new Chart(chart4, {
        type: 'line',
        data: {
            labels: labels,
            xAxisID: "time",
            yAxisID: chartlabel,
            datasets: [{
                data: data
    
            }],
            borderDash: [10,5]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                gridLines: {
                    display: true,
    
                }
            },
            elements: {
                point:{
                    radius: 3,
                    pointstyle: "circle"
                },
                line:{
                    tension: 0
                }
            }
        }
    });
}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function getSound() {
    var req = new XMLHttpRequest();
    var url = "http://health-safety.dev.api.kemppi.com:8080/api/sensordata?type=SOUND";

    req.open("GET", url, false);
    req.setRequestHeader("Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZWFtXzUifQ.tvjterUP5Z5Zb2SVcdPUsKkGtC1DPBlKDxmLB0y1iMI");
    req.send();

    var result = JSON.parse(req.responseText);
    return result.data[result.data.length - 1].value;
}

function getAir() {
    var req = new XMLHttpRequest();
    var url = "http://health-safety.dev.api.kemppi.com:8080/api/sensordata?type=AIR";

    req.open("GET", url, false);
    req.setRequestHeader("Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZWFtXzUifQ.tvjterUP5Z5Zb2SVcdPUsKkGtC1DPBlKDxmLB0y1iMI");
    req.send();

    var result = JSON.parse(req.responseText);
    return result.data[result.data.length - 1].value;
}

function getTemp() {
    var req = new XMLHttpRequest();
    var url = "http://health-safety.dev.api.kemppi.com:8080/api/sensordata?type=TEMP";

    req.open("GET", url, false);
    req.setRequestHeader("Authorization","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZWFtXzUifQ.tvjterUP5Z5Zb2SVcdPUsKkGtC1DPBlKDxmLB0y1iMI");
    req.send();

    var result = JSON.parse(req.responseText);
    return result.data[result.data.length - 1].value;
}

function updateCharts() {
    updateTemperature(getTemp());
    updateAirQuality(getAir());
    updateAudioLevel(getSound());
}

updateCharts();

setInterval(() => {
    updateCharts();
}, 30000);