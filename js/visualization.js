//============== env ===============//

// Retrieve the scenes
var scene3 = d3.select('#scene3')

// set the dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 30},
                    width = 400 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

async function load1() {

    // Create an element where the map will take place 
    //Cited: https://bl.ocks.org/d3noob/635735a3de2909ae06669096fbadc0ed
    const scene1 = d3.select("#scene1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);
  
  //Read the data
  d3.csv("https://raw.githubusercontent.com/shinwj123/shinwj123.github.io/main/data/new_cases.csv").then(function(data) {
  
      // List of groups (here I have one group per column)
      const allGroup = ["France", "Korea", "USA", "Turkey"]
  
      // Reformat the data: we need an array of arrays of {x, y} tuples
      const dataInput = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
          name: grpName,
          values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
          })
        };
      });

  
      // A color scale: one color for each group
      const myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);
  
      // Add X axis --> it is a date format
      const x = d3.scaleLinear()
        .domain([0, 81])
        .range([ 0, width ]);
        scene1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
      // Add Y axis
      const y = d3.scaleLinear()
        .domain( [0,1500000])
        .range([ height, 0 ]);
        scene1.append("g")
        .call(d3.axisLeft(y));
  
      // Add the lines
      const line = d3.line()
        .x(d => x(+d.time))
        .y(d => y(+d.value))
        scene1.selectAll("myLines")
        .data(dataInput)
        .join("path")
          .attr("class", d => d.name)
          .attr("d", d => line(d.values))
          .attr("stroke", d => myColor(d.name))
          .style("stroke-width", 4)
          .style("fill", "none")

      // create a tooltip
      const Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
      Tooltip
          .style("opacity", 1)
      }

      const mousemove = function(event,d) {
      Tooltip
          .html("Exact value: " + d.value)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
      }

      const mouseleave = function(event,d) {
      Tooltip
          .style("opacity", 0)
      }
  
      // Add the points
      scene1
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataInput)
        .join('g')
          .style("fill", d => myColor(d.name))
          .attr("class", d => d.name)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(d => d.values)
        .join("circle")
          .attr("cx", d => x(d.time))
          .attr("cy", d => y(d.value))
          .attr("r", 5)
          .attr("stroke", "white")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
  
      // Add a label at the end of each line
      scene1
        .selectAll("myLabels")
        .data(dataInput)
        .join('g')
          .append("text")
            .attr("class", d => d.name)
            .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
            .attr("transform", d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 15)
  
      // Add a legend (interactive)
      scene1
        .selectAll("myLegend")
        .data(dataInput)
        .join('g')
          .append("text")
            .attr('x', (d,i) => 30 + i*60)
            .attr('y', 30)
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 15)
          .on("click", function(event,d){
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d.name).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
  
          })
  })
}

async function load2() {
    const scene2 = d3.select('#scene2')
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);
  

    

}

