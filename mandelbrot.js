

// Tree configuration
var branches = [];
var seed = {i: 0, x: 420, y: 550, a: 0, l: 100, d:0}; // a = angle, l = length, d = depth
var da = 0.3; // Angle delta
var dl = 0.85; // Length delta (factor)
var ar = document.getElementById("randomRange").value; // Randomness
var maxDepth = 9;


// Tree creation functions
function branch(b) {
	var end = endPt(b), daR, newB;

	branches.push(b);

	if (b.d === maxDepth)
		return;

	// Left branch
	daR = ar * Math.random() - ar * 0.5;
	newB = {
		i: branches.length,
		x: end.x,
		y: end.y,
		a: b.a - da + daR,
		l: b.l * dl,
		d: b.d + 1,
		parent: b.i
	};
	branch(newB);

	// Right branch
	daR = ar * Math.random() - ar * 0.5;
	newB = {
		i: branches.length,
		x: end.x, 
		y: end.y, 
		a: b.a + da + daR, 
		l: b.l * dl, 
		d: b.d + 1,
		parent: b.i
	};
	branch(newB);
}
function randomColor() { return Math.floor(Math.random()*16777215).toString(16); }

function fullRandom() {
    
    
  
    
    console.log(randomColor);
    document.getElementById("favcolor").value = "#" + randomColor(Math.random(maxDepth))
    document.getElementById("favcolor2").value = "#" + randomColor(Math.random(maxDepth))
    document.getElementById("randomRange").value = (Math.floor(Math.random() * maxDepth) + 1) / 10;
    regenerate();                                           
}

function regenerate(initialise) {
    
    ar = document.getElementById("randomRange").value;
	branches = [];
	branch(seed);
	initialise ? create() : update();
}


function endPt(b) {
	// Return endpoint of branch
	var x = b.x + b.l * Math.sin( b.a );
	var y = b.y - b.l * Math.cos( b.a );
	return {x: x, y: y};
}




// D3 functions

var color = d3.scaleSequential()
    .domain([0, maxDepth])
    .range([document.getElementById("favcolor").value
            ,"green"]);

function x1(d) {return d.x;}
function y1(d) {return d.y;}
function x2(d) {return endPt(d).x;}
function y2(d) {return endPt(d).y;}


function create() {
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', function(d) {
        var t = parseInt(maxDepth*.5 +1 - d.d*.5);
        return  t + 'px';
    })
  	.style('stroke', function(d) {
        return color(d.d);
    })
		.attr('id', function(d) {return 'id-'+d.i;});
}

function update() {
    
    color = d3.scaleSequential()
    .domain([0, maxDepth])
    .range([document.getElementById("favcolor").value
            ,document.getElementById("favcolor2").value]);
    
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.transition()
        .duration(1000)
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
        .style('stroke', function(d) {
        return color(d.d);
    })
        
}

regenerate(true);