// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    // Filter the metadata for the object with the desired sample number
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    var metadata = data.metadata;
    var resultArray = metadata.filter(obj => obj.id == sample);
    var result = resultArray[0];
    var panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    // Filter the samples for the object with the desired sample number
    // Get the otu_ids, otu_labels, and sample_values
    // Build a Bubble Chart
    // Render the Bubble Chart
    var samples = data.samples;
    var resultArray = samples.filter(obj => obj.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      title: { title: "Bacteria Cultures Per Sample" },
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    var barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    // Use d3 to select the dropdown with id of `#selDataset`

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    var names = data.names;
    var dropdown = d3.select("#selDataset");

    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    var firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
