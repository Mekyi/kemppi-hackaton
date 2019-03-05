var chart1 = document.getElementById("co2-chart");
var chart3 = document.getElementById("db-chart");
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
var loudnessChart = new Chart(chart3, {
    type: 'doughnut',
    data: {
        labels: ["loudness"],
        datasets: [{
            label: 'loudness',
            data: [50, 50],
            backgroundColor: [
                '#F57300',
                'white'
            ],
            borderColor: [
                'black',
                'black'
            ],
            borderWidth: 1,
            
        }]
        
    },
    options: {
                cutoutPercentage: '50',
                circumference: 1.5 * Math.PI,
                rotation: 0.75 * Math.PI,
                elements: {
                    center: {
                    text: "60dB",
                    color: "black",
                    fontStyle: 'proxima-nova',
                    sidePadding: 2
                    }
                },
                tooltips: {enabled: false},
                hover: {mode: null},
                maintainAspectRatio: true,
                legend: {
                    display: false
                }
    },
    plugins: plugin
});
var co2Chart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: ["CO2"],
        datasets: [{
            label: 'co2',
            data: [50, 50],
            backgroundColor: [
                '#F57300',
                'white'
            ],
            borderColor: [
                'black',
                'black'
            ],
            borderWidth: 1,
            
        }]
        
    },
    options: {
                cutoutPercentage: '50',
                circumference: 1.5 * Math.PI,
                rotation: 0.75 * Math.PI,
                elements: {
                    center: {
                    text: "0,5%",
                    color: "black",
                    fontStyle: 'proxima-nova',
                    sidePadding: 2
                    }
                },
                tooltips: {enabled: false},
                hover: {mode: null},
                maintainAspectRatio: true,
                legend: {
                    display: false
                }
    },
    plugins: plugin
});
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