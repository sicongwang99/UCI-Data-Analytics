function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    d3.json (url) .then((data) => {


    
      // Use d3 to select the panel with id of `#sample-metadata`
    var samplemeta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    samplemeta.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
      Object.entries(sample).forEach( ([key, value]) => {
        var panel = samplemeta.append("p");
        panel.text(`${key}: ${value}`);
      });
    });
  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json (url) .then((data) => {
    // @TODO: Build a Bubble Chart using the sample data
    var otu_ids = data.otu_ids;
    var labels = data.otu_labes;
    var sample_values = data.sample_values;

    var Bubbledata = [{
      x: otu_ids,
      y: sample_values,
      text: labels,
      mode:"markers",
      marker: {
        color: otu_ids,
        size: sample_values,
      }
    }];

      var layout ={
        title:"Belly Button Biodiversity",
        xaxis:{title:"otu_ids"},
      };

      plotly.plot("bubble", Bubbledata, layout);

    })
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var piedata = [
     {
      values : sample_values.slice(0,10),
      labels : otu_ids.slice(0,10),
      hovertext : otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
     }
    ];

    Plotly.newPlot('pie', piedata);
 }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
