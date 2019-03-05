var chart1 = document.getElementById("co2-chart");
var chart2 = document.getElementById("temp-chart");
var chart3 = document.getElementById("db-chart");
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
                'blue',
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
                    color: "blue",
                    fontStyle: 'helvetica',
                    sidePadding: 2
                    }
                },
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
                'blue',
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
                    color: "blue",
                    fontStyle: 'helvetica',
                    sidePadding: 2
                    }
                },
                maintainAspectRatio: true,
                legend: {
                    display: false
                }
    },
    plugins: plugin
});