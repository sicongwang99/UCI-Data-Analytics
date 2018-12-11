// global colors for charts
var colors = ["#3e95cd", "violet","tomato","OliveDrab","#8e5ea2","orange","#e8c3b9", "#3cba9f","purple","#c45850","grey"]

// Build a Pie Chart for top 10 designations by number of jobs
function buildPieChart(jobsByState) {

  jobsByState = jobsByState.slice(0,10);

  var x_data = jobsByState.map(row => row.State);
  var y_data = jobsByState.map(row => row.Jobs_Count);

  var myPieChart = new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels:  x_data,
      datasets: [{
        label: x_data,
        backgroundColor: colors,
        data: y_data
      }]
    },
    options: {
      title: {
        display: true,
        text: 'States with highest number of jobs',
        fontSize: 25
      },
      legend: {
          display: true,
          position: 'right',
          labels: {
            fontSize: 14,
            padding: 10,
            fontFamily: 'Arial'
          }
      }
    }
});

  var canvas_donut = document.getElementById("pie-chart");

  canvas_donut.onclick = function(evt){
  var activePoint = myPieChart.getElementsAtEvent(evt)[0];
  var try_data = activePoint._chart.config.data.datasets[0].label;
  var index = activePoint._index;

  console.log(try_data[index]);

  buildDonutChart(try_data[index]);
}
}


function buildDonutChart(State) {
  //Plugin for center text
  Chart.pluginService.register({
    beforeDraw: function (chart) {
      if (chart.config.options.elements.center) {
        //Get ctx from string
        var ctx = chart.chart.ctx;
        //Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = "30px " + fontStyle;
        ctx.fillStyle = color;
        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
      }
    }
  });

  // Donut Chart
  var donut = d3.select("#donut-chart");
  donut.html("");
  d3.json(`/donutchart/${State}`).then((jobsByCity) => {

    jobsByCity = jobsByCity.slice(0,10);

  var x_data = jobsByCity.map(row => row.City);
  var y_data = jobsByCity.map(row => row.Jobs_Count);

  var myDonutChart = new Chart(document.getElementById("donut-chart"), {
    type: 'doughnut',
    data: {
      labels:  x_data,
      datasets: [{
        label: x_data,
        backgroundColor: colors,
        data: y_data
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Cities with highest number of jobs',
        fontSize: 25
      },
      legend: {
          display: true,
          position: 'right',
          labels: {
            fontSize: 14,
            padding: 10,
            fontFamily: 'Arial'
          }
        },
      events: ['click'],
      elements: {
        center: {
          text: State,
          color: 'black', // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 20
        }
      }
      }

    });
  });
}

function buildBarChart(choice) {
  // Build a Bar Chart for top 10 Companies for data jobs 
  // need to use slice() to grab the top 10 sample_values,

  d3.json(`/company/${choice}`).then((companyData) => {

    companyData = companyData.slice(0,20);

    console.log(companyData);

    if(choice == "Jobs") {
      var title_text = "Companies with maximum Jobs openings for Data Analysts";
      var xaxis_text = "No. of Jobs";
    }
    else {
      var title_text = "Companies with highest pay for Data Analysts";
      var xaxis_text = "Avg Salary ($(K))";

    }
      var trace1 = {
        y: companyData.map(row => row.Company),
        x: companyData.map(row => row.Value),
        type: "bar",
        orientation: "h",
        text: companyData.map(row => row.Value),
        textposition: "outside"
      //   marker: {
      //     color: color_list
      // }
      };  
      // Create the data array for the plot
      var data = [trace1]; 
      // Define the plot layout
      var layout = {
        title: title_text,
        margin: {
          l: 350,
          r: 50,
          t: 80,  
          b: 50,
          pad: 5
        },
        xaxis: { title: xaxis_text,
        titlefont: {
            size: 18
            },
        showgrid: false,
        showticklabels: false,
        },
        yaxis: { title: "Companies", 
            titlefont: {
            size: 18
            },
            autorange: "reversed"},
        autotick: false,
        ticks: 'inside',
        tick0: 1,
        dtick: 1,
        ticklen: 10,
        tickwidth: 1,
        tickcolor: '#000',
        tickangle: 45
      };
      // Plot the chart to a div tag with id "bar-plot"
      Plotly.newPlot("bar-plot", data, layout);
  });
}

function init() {
  // pie and donut charts for job count by State and City 
  d3.json("/piechart").then((data) => {
    buildPieChart(data);
    firstState = data[0].State;
    console.log(firstState);

    buildDonutChart("All");
  });

  // Bar chart for top companies
  choice = [["Jobs", "Companies with most jobs"], ["Salary", "Companies offering highest salaries"]];
  var selector = d3.select("#selDataset");
  choice.forEach((item) => {
    selector
    .append("option")
    .text(item[1])
    .property("value", item[0])
  });

  buildBarChart("Jobs");
}

function optionChanged(newView) {
  // Fetch new data each time a new sample is selected
  buildBarChart(newView);
}
// Initialize the dashboard
init();