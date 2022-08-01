//============== env ===============//
// Common dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 300},
                    width = 1000 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

//============== scene1 ===============//
async function load1() {

    // Retrieve scene1
    // Work Cited: https://bl.ocks.org/d3noob/635735a3de2909ae06669096fbadc0ed
    const scene1 = d3.select("#scene1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);
  
  //Read the data of daily new covid cases
  d3.csv("https://raw.githubusercontent.com/shinwj123/shinwj123.github.io/main/data/new_cases.csv").then(function(data) {
  
    // List of top 4 traveling countries
    const allGroup = ["France", "Korea", "USA", "Turkey"]

    // Creating arrays of {x, y} tuples
    const dataInput = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
            })
        };
    });


    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 81])
        .range([ 0, width ]);

    scene1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add label for X axis
    scene1.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Days in 2022");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain( [0,1500000])
        .range([ height, 0 ]);

    scene1.append("g")
        .call(d3.axisLeft(y));

    // Add label for Y axis
    scene1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 200 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Covid Cases");

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

    // create a tooltip for mouse hover
    const Tooltip = d3.select("#scene1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // functions for tooltip when the mouse hover / move / leave a cell
    const mouseover = function(event,d) {
    Tooltip
        .style("opacity", 1)
    }

    const mousemove = function(event,d) {
    Tooltip
        .html("n-th date of 2022: " + d.time + "  |  "+ "Covid Cases: " + d.value)
        .style("left", `${event.layerX+10}px`)
        .style("top", `${event.layerY}px`)
    }

    const mouseleave = function(event,d) {
    Tooltip
        .style("opacity", 0)
    }

    // Add the points
    scene1
    .selectAll("myDots")
    .data(dataInput)
    .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", d => d.name)
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

    // Label of the path
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

    // Legend that could be toggled
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
        // Change the opacity: from 0 to 1 or from 1 to 0 --> toggling function
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
  }) //then(function(data) {
} //async function load1() {


async function load2() {

    // Retrieve scene2
    const scene2 = d3.select('#scene2')
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);

  d3.csv("https://raw.githubusercontent.com/shinwj123/shinwj123.github.io/main/data/vax_rate.csv").then(function(data) {
    // group the data: one array for each value of the X axis.
    // group the data: one array for each value of the X axis.
    const sumstat = d3.group(data, d => d.time);

    // Stack the data: each group will be represented on top of each other
    const mygroups = ["France", "Korea", "USA"] // list of group names
    const mygroup = [1,2,3] // list of group names
    const stackedData = d3.stack()
      .keys(mygroup)
      .value(function(d, key){
        return d[1][key].n
      })
      (sumstat)
  
    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, 83])
      .range([ 0, width ]);

    scene2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(12));

    
    // Add label for X axis
    scene2.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Days in 2022");
  
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 2.2])
      .range([ height, 0 ]);

    scene2.append("g")
      .call(d3.axisLeft(y).ticks(10));

    // Add label for Y axis
    scene2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 200 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vaccination Rate (%)");

    // color palette
    const color = d3.scaleOrdinal()
      .domain(mygroups)
      .range(['#5c73e6','#b078f5','#f07e78'])
    
    // create a tooltip for mouse hover
    const Tooltip = d3.select("#scene2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // functions for tooltip when the mouse hover / move / leave a cell
    const mouseover = function(event,d) {
        Tooltip
            .style("opacity", 1)
        }
  
    const mousemove = function(event,d) {
        Tooltip
            .html("Country: " + mygroups[d.key-1])
            .style("left", `${event.layerX+10}px`)
            .style("top", `${event.layerY}px`)
    }
  
    const mouseleave = function(event,d) {
        Tooltip
            .style("opacity", 0)
    }

    // Show the areas
    scene2
      .selectAll("mylayers")
      .data(stackedData)
      .join("path")
        .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
        .attr("d", d3.area()
          .x(function(d, i) { return x(d.data[0]); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); }))
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

    // color block next to the legend
    scene2.selectAll("mycircles")
        .data(mygroups)
        .enter()
        .append("circle")
        .attr("cx", 480)
        .attr("cy", function(d,i){ return 100 + i*25 }) 
        .attr("r", 7)
        .style("fill", function(d){ return color(d) });

    // Add one dot in the legend for each name.
    scene2.selectAll("mylegends")
        .data(mygroups)
        .enter()
        .append("text")
        .attr("x", 500)
        .attr("y", function(d,i){ return 100 + i*25 })
        .style("fill", function(d){ return color(d) })
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
  }) //then(function(data) {
} //async function load2() {

//============== scene3 ===============//
async function load3() {

// Retrieve scene3
// Work Cited: https://bl.ocks.org/d3noob/f46a355d35077a7dc12f9a97aeb6bc5d
const scene3 = d3.select("#scene3")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/shinwj123/shinwj123.github.io/main/data/avgHosp_vs_avgDeath.csv").then( function(data) {

    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, 260])
    .range([ 0, width ]);

    scene3.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add label for X axis
    scene3.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Average COVID-19 Death Numbers in 2022");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([3600, 70000])
        .range([ height, 0]);

    scene3.append("g")
        .call(d3.axisLeft(y));

    // Add label for Y axis
    scene3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 200 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Average COVID-19 Hospitalization Numbers in 2022");

    // Add the factor for the size of the plotted values
    const z = d3.scaleLinear()
        .domain([200000, 337000000])
        .range([ 4, 40]);

    // Add color in scatter plot based on the continent values
    const myColor = d3.scaleOrdinal()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(d3.schemeSet2);

    // Tooltip creation for mouse movement 
    const tooltip = d3.select("#scene3")
    .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // functions for tooltip when the mouse hover / move / leave a cell
    const mouseover = function(event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Country: " + d.country + "  |  " 
          + "Population: " + d.pop + "  |  " 
          + "Death rate when hospitalized: " + d.avgDeath/d.avgHosp)
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }

    const mousemove = function(event, d) {
        tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }

    const mouseleave = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Draw the Scattor plot
    scene3.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.avgDeath))
            .attr("cy", d => y(d.avgHosp))
            .attr("r", d => z(d.pop))
            .style("fill", d => myColor(d.continent))
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

    }) //then(function(data) {
} //async function load3() {
