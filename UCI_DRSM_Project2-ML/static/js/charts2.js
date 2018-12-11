
// Build a Pie Chart for top 10 designations by number of jobs
function buildPieChart(jobsByState) {

  jobsByState = jobsByState.slice(0,10);

  var x_data = jobsByState.map(row => row.State);
  var y_data = jobsByState.map(row => row.Jobs_Count);

  colors = ["#3e95cd", "violet","tomato","OliveDrab ","#8e5ea2","orange","#e8c3b9", "#3cba9f","purple","#c45850","grey"]

  new Chart(document.getElementById("pie-chart"), {
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
}

d3.json("/piechart").then((data) => {
  buildPieChart(data);
});

// function buildBarChart(jobsByCompany) {
    
//   jobsByCompany = jobsByCompany.slice(0,20);

//     // Build a Bar Chart for top 10 Companies for data jobs 
//     // need to use slice() to grab the top 10 sample_values,

//     var trace1 = {
//       y: jobsByCompany.map(row => row.Company),
//       x: jobsByCompany.map(row => row.Jobs_Count),
//       type: "bar",
//       orientation: "h",
//       width: .5
//     };
    
//     // Create the data array for the plot
//     var data = [trace1];
    
//     // Define the plot layout
//     var layout = {
//       title: "Companies with maximum Data Analytics Jobs postings",
//       xaxis: { title: "No. of Jobs"},
//       yaxis: { title: "Companies", autorange: "reversed"},
//       margin: {
//         pad: -30,
//         l: -50
//       },
//       marker: {autocolorscale: true}
//     };
    
//     // Plot the chart to a div tag with id "bar-plot"
//     Plotly.newPlot("bar-plot", data, layout);
// }
// d3.json("/company").then((data) => {
//   buildBarChart(data);
// });

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3.select("#bar-plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "State";
var chosenYAxis = 1;

// function used for updating x-scale var upon click on axis label
function xScale(jobsData, chosenXAxis) {
  // create scales
  var xBandScale = d3.scaleBand()
    .domain(jobsData[chosenXAxis][0])
    .range([0, width])
    .padding(0.1);

  return xBandScale;
}

function yScale(jobsData, chosenXAxis, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(jobsData[chosenXAxis][chosenYAxis]),
      d3.max(jobsData[chosenXAxis][chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);  

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderBarsX(barsGroup, newXScale, chosenXAxis) {

  barsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis][0]))
    .attr("transform", "rotate(-90)");

  return barsGroup;
}

function renderBarsY(barsGroup, newYScale, chosenXAxis, chosenYAxis) {

  barsGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenXAxis][chosenYAxis]));

  return barsGroup;
}
// function to update the text in circles (state abbr)
function updateBarTextX(chosenXAxis, newXScale, textGroup) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis][0]));

   return textGroup; 
}

function updateBarTextY(chosenYAxis, newYScale, textGroup) {

  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenXAxis][chosenYAxis])+5);

   return textGroup; 
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {

  if (chosenXAxis === "State") {
    var labelX = "State: ";
  }
  else if (chosenXAxis === "City") {
    var labelX = "City: ";
  }
  else {
    var labelX = "Company: "
  }
  if (chosenYAxis === 2) {
    var labelY = "No. of jobs: ";
  }
  else {
    var labelY = "Avg Salary: "
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<br>${labelX} <br>${labelY}`);
    });

  textGroup.call(toolTip);

  textGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return textGroup;
}

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.json("/d3chart").then((jobsData) => {
  
  console.log(jobsData[chosenXAxis]);
  console.log(jobsData[chosenXAxis][chosenYAxis]);
  // Step 4: Parse the data
  // =================================
  // Format the data

  // jobsData.forEach(function(data) {
  //     data[1] = +data[1];
  //     data[2] = +data[2];
  //  });

  // Step 5: Create Scales
  //= ============================================

  // xLinearScale function above csv import
  var xBandScale = xScale(jobsData, chosenXAxis);


  var yLinearScale = yScale(jobsData, chosenXAxis, chosenYAxis);

  // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var node = chartGroup.selectAll(".node")
    .data(jobsData)
    .enter()
    .append("g")
    .classed("node", true);
  // append initial circles
  var barsGroup = node
    .append("rect")
    .attr("class", "bar")
    .attr("x", jobsData[chosenXAxis][0])
    .attr("y", yLinearScale(jobsData[chosenXAxis][chosenYAxis])) 
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => height - yLinearScale(d[chosenXAxis][chosenYAxis]));
    ;

  var textGroup = node
    .append("text")
    .classed("stateText",true)
    .attr("x", d => xBandScale(d[chosenXAxis][0]))
    .attr("y", d => yLinearScale(d[chosenXAxis][chosenYAxis])+5)
    .text(d => d[chosenXAxis][0]);


  // Create group for  3 x- axis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var stateLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "State") // value to grab for event listener
    .classed("active", true)
    .text("States");

  var cityLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "City") // value to grab for event listener
    .classed("inactive", true)
    .text("Cities");

  var companyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Company") // value to grab for event listener
    .classed("inactive", true)
    .text("Companies");

  // Create group for  3 y- axis labels

  var labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var jobcountLabel = labelsGroupY.append("text")
      .attr("x", -160)
      .attr("y", -40)
      .attr("value", 2) // value to grab for event listener
      .classed("active", true)
      .text("Number of Jobs");

  var salaryLabel = labelsGroupY.append("text")
      .attr("x", -160)
      .attr("y", -60)
      .attr("value", 1) // value to grab for event listener
      .classed("inactive", true)
      .text("Avg Salary $ (K)");

  // updateToolTip function above csv import
 // var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value); 
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(jobsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        barsGroup = renderBarsX(barsGroup, xLinearScale, chosenXAxis);

        //updates text with new info
        textGroup = updateBarTextX(chosenXAxis, xLinearScale, textGroup);

        // updates tooltips with new info
    //    textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // changes classes to change bold text
        if (chosenXAxis === "State") {
          stateLabel
            .classed("active", true)
            .classed("inactive", false);
          cityLabel
            .classed("active", false)
            .classed("inactive", true);
          companyLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else if (chosenXAxis === "City") {
          stateLabel
            .classed("active", false)
            .classed("inactive", true);
          cityLabel
            .classed("active", true)
            .classed("inactive", false);
          companyLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else {
          stateLabel
            .classed("active", false)
            .classed("inactive", true);
          cityLabel
            .classed("active", false)
            .classed("inactive", true);
          companyLabel
            .classed("active", true)
            .classed("inactive", false);  
        }
      }
  });

  labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value);
      if (value !== chosenYAxis) {
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(jobsData, chosenXAxis, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        barsGroup = renderBarsY(barsGroup, yLinearScale, chosenXAxis, chosenYAxis);

        //updates text with new info
        textGroup = updateBarTextY(chosenYAxis, yLinearScale, textGroup);

        //updates tooltips with new info
        textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // changes classes to change bold text
        if (chosenYAxis === 2) {
          jobcountLabel
            .classed("active", true)
            .classed("inactive", false);
          salaryLabel
            .classed("active", false)
            .classed("inactive", true);          
        }
        else {
          jobcountLabel
            .classed("active", false)
            .classed("inactive", true);
          salaryLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
      }
  });
});