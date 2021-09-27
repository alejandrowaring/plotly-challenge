var samplesFile = "data/samples.json"
var dropDown = d3.select("#selDataset")
var metadataBox = d3.select("#sample-metadata")

function createBar(id) {
    console.log(`Creating bar graph`)
    d3.json(samplesFile).then(data => {
        var barFilter = data.samples.filter(sample => sample.id === id)[0];
        var barValues = barFilter.sample_values.slice(0,10).reverse();
        var barLabels = barFilter.otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();
        var barHover = barFilter.otu_labels.slice(0,10).reverse();

        var trace = {
            x: barValues,
            y: barLabels,
            text: barHover,
            type: 'bar',
            orientation: 'h'
        }

        var data = [trace];
        var layout = {}
        Plotly.newPlot('bar',data,layout)
    })
}

function createBubble(id) {
    console.log(`Creating Bubble chart`);
    d3.json(samplesFile).then(data =>{
        var bubbleFilter = data.samples.filter(sample => sample.id === id)[0];
        var bubbleIDs = bubbleFilter.otu_ids
        var bubbleY = bubbleFilter.sample_values
        var bubbleSize = bubbleFilter.sample_values
        var bubbleText = bubbleFilter.otu_labels
        var trace = {
            x: bubbleIDs,
            y: bubbleY,
            text: bubbleText,
            mode: 'markers',
            marker: {
                size: bubbleSize,
                color: bubbleIDs
            }
        }
        var data = [trace]
        Plotly.newPlot('bubble',data)
    })
}

function pullMetadata(id) {
    console.log(`Pulling metadata on ${id}`)
    d3.json(samplesFile).then(data => {
            var subjectMetadata = data.metadata
                .filter(ids => ids.id.toString() === id)[0];
            metadataBox.html("");
            Object.entries(subjectMetadata).forEach(([key,value]) => metadataBox.append("p").text(`${key}:${value}`))
        });
};

function createGauge(id) {
    console.log(`Creating Gauge Chart`);
    d3.json(samplesFile).then(data => {
        var frequency = data.metadata.filter(ids => ids.id.toString() === id)[0].wfreq;
        var trace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: frequency,
            title: { text: "Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: 'darkgrey' },
                bar: { color: 'black', thickness: 0.3 },
                bgcolor: 'white',
                borderwidth: 0,
                bordercolor: 'gray',
                steps: [
                { range: [0, 1], color: "#FF0000"},
                { range: [1, 2], color: "#FF3300" },
                { range: [2, 3], color: '#ff6600' },
                { range: [3, 4], color: '#ff9900'},
                { range: [4, 5], color: '#FFCC00' },
                { range: [5, 6], color: '#FFFF00' },
                { range: [6, 7], color: '#ccff00' },
                { range: [7, 8], color: '#99ff00' },
                { range: [8, 9], color: '#66ff00' }
            ]
        }
    }
        var data = [trace]

        Plotly.newPlot('gauge',data)
    })
}










function init() {
    d3.json(samplesFile)
        .then(items => items.names
                .forEach(name => 
                    dropDown.append('option')
                    .text(name)
                    .property('value'),
                    console.log(`initializing plots for ${items.names[0]}`),
                    pullMetadata(items.names[0]),
                    createBar(items.names[0]),
                    createBubble(items.names[0]),
                    createGauge(items.names[0])
                    ))
}

init();

function optionChanged(id) {
    pullMetadata(id),
    createBar(id),
    createBubble(id),
    createGauge(id)
}
