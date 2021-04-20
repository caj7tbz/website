var width = 533,
    height = 400,
    iterations = 150,
    radious = 2,
    factor = 2,
    step = 1,
    x1 = -1.7, 
    y1 = -1, 
    x2 = 1, 
    y2 = 1,
    bounds;

var color = d3.scaleOrdinal()
      .domain(colorGroup)
      .range(d3.schemeSet2);

var canvas = d3.select(".container")
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked)
    .node().getContext("2d");

var center = [width/2,height/2];

