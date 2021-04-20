//set the dimensions and margins of the graph
var margin = {top: 10, right: 60, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");




    

d3.csv("/csvs/data.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%x")(d.date), scoreAAPL : d.scoreAAPL, closeAAPL : d.closeAAPL, scoreAMZN : d.scoreAMZN, closeAMZN : d.closeAMZN, scoreGOOGL : d.scoreGOOGL, closeGOOGL : d.closeGOOGL, scoreMSFT : d.scoreMSFT, closeMSFT : d.closeMSFT, scoreTSLA : d.scoreTSLA, closeTSLA : d.closeTSLA, dateMarket : d3.timeParse("%x")(d.dateMarket) }
  },

  // Now I can use this dataset:
  function(data) {
    
    // List of groups (here I have one group per column)
    var allGroup = ["AMZN", "AAPL", "GOOGL", "MSFT", "TSLA"]

    var colorGroup = ["scoreAMZN", "closeAMZN", "scoreAAPL", "closeAAPL", "scoreGOOGL", "closeGOOGL", "scoreMSFT", "closeMSFT", "scoreTSLA", "closeTSLA"]
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return ["score"+d,"close"+d]; }) // corresponding value returned by the button

    var myColor = d3.scaleOrdinal()
      .domain(colorGroup)
      .range(d3.schemeSet2);
    
    var legend = d3.select("#legend")
        legend.append("circle")
            .attr("class", "score")
            .attr("cx", 250)
            .attr("cy",50)
            .attr("r", 6)
            .style("fill", function(d){ return myColor("scoreAMZN")});
        legend.append("circle")
            .attr("class", "close")
            .attr("cx", 550)
            .attr("cy",50)
            .attr("r", 6)
            .style("fill", function(d){ return myColor("closeAMZN")});
    
        legend.append("text")
            .attr("class", "score")
            .attr("x", 270)
            .attr("y", 50)
            .text("Average Twitter user sentiment for AMZN")
            .style("font-size", "12px")
            .attr("alignment-baseline","middle")
    
        legend.append("text")
            .attr("class", "close")
            .attr("x", 570)
            .attr("y", 50)
            .text("Closing price for AMZN")
            .style("font-size", "12px")
            .attr("alignment-baseline","middle")

    // Add X axis it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
        var y = d3.scaleLinear()
      .domain([0,d3.max(data, function(d) {return Math.max(d.scoreAMZN);})])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("class","yaxis")
      .call(d3.axisLeft(y));
  
    var y2 = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) {return Math.max(d.closeAMZN);})])
    .range([height,0]);
    svg.append("g")
    .attr("class", "yaxis2")
    .attr("transform", "translate(" + (width) + ",0)")
    .call(d3.axisRight(y2));
    
    
   
    
  
    // Add the line
    var line1 = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", function(d){ return myColor("scoreAMZN")})
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.scoreAMZN)})
        )
    
    
    var line2 = svg.append("path")
        .datum(data)
        .attr("fill", "none")
          .attr("stroke", function(d){ return myColor("closeAMZN")})
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(function(d) { return x(d.dateMarket)})
            .y(function(d) { return y2(d.closeAMZN)})
        )
    
    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {date: d.date, score:d[arr[0]], close:d[arr[1]], dateMarket: d.dateMarket  }})
      
      console.log(d3.min(dataFilter, function(d) {return Math.min(d.dateMarket);}))
    
        y.domain([0,d3.max(dataFilter, function(d) {return Math.max(d.score);})])
        svg.selectAll("g.yaxis")    
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y))
        
        
        
 y2.domain([0,d3.max(dataFilter, function(d) {return Math.max(d.close);})])
        
    svg.selectAll("g.yaxis2")    
    .transition()
    .duration(1000)
    .call(d3.axisRight(y2))
        
        legend.selectAll("circle.score")
        .transition()
        .duration(1000)
        .style("fill", function(d){ return myColor(arr[0]) })
        
        legend.selectAll("circle.close")
        .transition()
        .duration(1000)
        .style("fill", function(d){ return myColor(arr[1]) })
        
        legend.selectAll("text.score")
        .transition()
        .duration(1000)
        .text("Average Twitter user sentiment for " + arr[0].split('e')[1])
        
        legend.selectAll("text.close")
        .transition()
        .duration(1000)
        .text("Closing price for " + arr[0].split('e')[1])


      // Give these new data to update line
      line1
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.date) })
            .y(function(d) { return y(+d.score) })
          )
          .attr("stroke", function(d){ return myColor(arr[0]) });
        
      line2
        .datum(dataFilter)
        .transition()
          .duration(1000)
          .attr("d", d3.line()
        .x(function(d) { return x(+d.dateMarket) })
        .y(function(d) { return y2(+d.close) })
      )
      .attr("stroke", function(d){ return myColor(arr[1]) });
        
       
        
        
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        arr = d3.select(this).property("value").split(",")
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
    
    



})