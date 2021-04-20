var svg = d3.select("map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);


// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);


d3.queue() {
    .defer(d3.json, "/usamap.json")
    .defer(d3.csv, "/csvs/legalization.csv")
}