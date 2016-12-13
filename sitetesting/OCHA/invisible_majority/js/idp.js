// ---------------- defines some global vars

// get width and height of chart container / minimum height of 300px
var width = d3.select(id).node().getBoundingClientRect().width;
var height = width/3;
if (height <= 300) {
	height = 300;
}

// get the width and height of the map container
var mwidth = d3.select(map).node().getBoundingClientRect().width;
var mheight = mwidth/1.5;

//set the chart svg margins and reset the width and height
var margin = {top: 100, right: 240, bottom: 50, left: 140};
if (width <= 700) {
	margin = {top: 100, right: 40, bottom: 50, left: 140};
}
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

//defines a function to be used to append the title to the tooltip.  you can set how you want it to display here.
var maketip = function (d) {			               
	var tip = '<p class="tip3">' + changeName(d.name) + '<p class="tip1">' + NumbType(d.value) + '</p> <p class="tip3">'+  formatDate(d.date)+'</p>';
	return tip;
};

//defines a function to be used to append the title to the tooltip.  you can set how you want it to display here.
var makeMaptip = function (d) {	
	function getText(d) {
		datacats = getDataCats();
		var text = "";
		if (datacats.conflict == true) {
			text += "<p class='tip-country-label'>Conflict-Based IDPs: <span class='tip-country-total'>" + NumbType(d.properties.tot_idp_conflict) + '</span></p>';	
		}
		if (datacats.disaster == true) {
			text += "<p class='tip-country-label'>Disaster-Based IDPs: <span class='tip-country-total'>" + NumbType(d.properties.tot_new_idp_disaster) + '</span></p>';	
		}
		if (datacats.hosted == true) {
			text += "<p class='tip-country-label'>Total Refugees Hosted: <span class='tip-country-total'>" + NumbType(d.properties.tot_refugees_hosted) + '</span></p>';	
		}
		if (datacats.originated == true) {
			text += "<p class='tip-country-label'>Total Refugees Originating: <span class='tip-country-total'>" + NumbType(d.properties.tot_refugees_originated) + '</span></p>';	
		}
		return text;
	}		               
	var tip = '<p class="tip-country">' + d.properties.country + ' ('+d.properties.year+')</p>' + getText(d);
	return tip;
	
};
      		   
//define your year format here, first for the x scale, then if the date is displayed in tooltips
var parseDate = d3.time.format("%m/%d/%Y").parse;
var formatDate = d3.time.format("%Y");

//create the chart svg
var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//make a rectangle for the plot
svg.append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "plot");
 
//create map svg and append to the page
var mapsvg = d3.select(map).append("svg")
	.attr("width", mwidth)
    .attr("height", mheight);

//add the drop shadow to the pie groups
var defs = mapsvg.append("defs");
var filter = defs.append("filter")
    .attr("id", "drop-shadow");

filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 3)
    .attr("result", "blur");
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 0)
    .attr("dy", 0)
    .attr("result", "offsetBlur");
filter.append("feFlood")
    .attr("in", "offsetBlur")
    .attr("flood-color", "#000000")
    .attr("flood-opacity", "0.2")
    .attr("result", "offsetColor");
filter.append("feComposite")
    .attr("in", "offsetColor")
    .attr("in2", "offsetBlur")
    .attr("operator", "in")
    .attr("result", "offsetBlur");

var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur");
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
        
//organize map information into groups and append to map svg
var polygroup = mapsvg.append("g").attr("id","world-polys");
var linegroup = mapsvg.append("g").attr("id","world-lines");

// create a group for the map data and append to map svg
var datagroup = mapsvg.append("g").attr("id","maindata");
	
//set map projection, scale and position
var projection = d3.geo.mercator()
	.scale(205)
	.translate([mwidth / 2, mheight / 1.55]);
	
// set global altkey var
var altKey;
 
    	 
// ---------------- helper functions
   
// push data into an array based on attribute (usually country but possibly year)
function getAllData(d, p) {
	var alldata = [];
	$.each(d, function(k, v) {
		alldata.push(v.properties[p]);
	});
	return alldata;
}

// get array of distinct values of an attribute
function distinct(d) {
	var distinct = [];
	$.each(d, function(k, v) {
		if ($.inArray(v, distinct) == -1) distinct.push(v);
	});
  return distinct;
}

// sort array alphabetically
function sortAlpha(d) {
	d.sort(function(a,b) {
		var nameA=a.toLowerCase(), nameB=b.toLowerCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
}

// sort array numerically
function sortNumbers(d) {
	d.sort(function(a,b) {
		var nameA=a.year, nameB=b.year;
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	return d;
}

// create option of a select menu (id) based on data values
function createSelect(d, id, iscountry) {
	if (typeof(iscountry)==='undefined') iscountry = false;
	if (iscountry == true) {
		$(id).append( $('<option></option>').val("Global Figures").html("Global Figures"));
		d = $.grep(d, function(v) {
		  return v != "Global Figures";
		});
	}
	$.each(d, function(k,v) {
		$(id).append( $('<option></option>').val(v).html(v));
	});
	
}

// get list of countries to put into the select menu
function getCountryList(d) {
	var countries = getAllData(d, "country");
	countries = distinct(countries);
	sortAlpha(countries);
	return countries;
}

// get list of years to put into the select menu
function getYears(d) {
	var years = getAllData(d, "year");
	years = distinct(years);
	sortNumbers(years).reverse();
	return years;
}

// change the name of the columns to actual phrases (var located in the HTML)
function changeName(name) {
	for (key in columns) {
		if (name == key) {
			return columns[key];
		} 
	}
}

// set the type of number here, n is a number with a comma, .2% will get you a percent, .2f will get you 2 decimal points, r is rounded
function NumbType(d) {
	if (d <= 9999) {
		var formatted = d3.format(",.3r");
	}
	if (d <= 1000) {
		formatted = d3.format(",.2r");
	}
	if (d <= 100) {
		formatted = d3.format(",1r");
	}
	if (d <= 10) {
		formatted = d3.format(",.r");
	}
	else {
		var formatted = d3.format(",.3r");
	}
	return formatted(d);
}

//get category checkbox states
function getDataCats() {
	if($("#tot_idp_conflict_checkbox").is(':checked')) {
	    var conflict = true;
	}
	else {
	    var conflict = false;
	}
	if($("#tot_new_idp_disaster_checkbox").is(':checked')) {
	    var disaster = true;
	}
	else {
	    var disaster = false;
	}
	if($("#tot_refugees_hosted_checkbox").is(':checked')) {
	    var hosted = true;
	}
	else {
	    var hosted = false;
	}
	if($("#tot_refugees_originated_checkbox").is(':checked')) {
	    var originated = true;
	}
	else {
	    var originated = false;
	}
	return {"conflict":conflict,"disaster":disaster,"hosted":hosted,"originated":originated};
}

// push the data into an array that is readable by D3
function createDataset(d) {
	datacats = getDataCats();
	var row = [];
	$.each(d, function(k,v) {
		if (v.properties.tot_idp_conflict == null) {
			v.properties.tot_idp_conflict = 0;
		}
		if (v.properties.tot_new_idp_disaster == null) {
			v.properties.tot_new_idp_disaster = 0;
		}
		if (v.properties.tot_refugees_hosted == null) {
			v.properties.tot_refugees_hosted = 0;
		}
		if (v.properties.tot_refugees_originated == null) {
			v.properties.tot_refugees_originated = 0;
		}
		
		var obj = {};
		obj["year"] = (v.properties.year).toString();
		obj["country"] = v.properties.country;
		if ( datacats.conflict == true ) { 
	    	obj["tot_idp_conflict"] = v.properties.tot_idp_conflict; 
	  	}
	  	if ( datacats.disaster == true ) { 
	    	obj["tot_new_idp_disaster"] = v.properties.tot_new_idp_disaster; 
	  	}
	  	if ( datacats.hosted == true ) { 
	    	obj["tot_refugees_hosted"] = v.properties.tot_refugees_hosted; 
	  	}
	  	if ( datacats.originated == true ) { 
	    	obj["tot_refugees_originated"] = v.properties.tot_refugees_originated; 
	  	} 
		
		row.push(obj);
	});
	row.sort();
	return row;
}

function createMapDataset(d) {
	datacats = getDataCats();
	var noNulls = function(d) {
		$.each(d, function(k,v) {
			if (v.properties.tot_idp_conflict == null) {
				v.properties.tot_idp_conflict = 0;
			}
			if (v.properties.tot_new_idp_disaster == null) {
				v.properties.tot_new_idp_disaster = 0;
			}
			if (v.properties.tot_refugees_hosted == null) {
				v.properties.tot_refugees_hosted = 0;
			}
			if (v.properties.tot_refugees_originated == null) {
				v.properties.tot_refugees_originated = 0;
			}
		});
		return d;
	};
	
	var row = [];
	$.each(noNulls(d), function(k,v) {
		var sum = [];
		if ( datacats.conflict == true ) { 
	    	sum.push(v.properties.tot_idp_conflict); 
		}
		if ( datacats.disaster == true ) { 
	    	sum.push(v.properties.tot_new_idp_disaster);
	  	}
	  	
	  	if ( datacats.hosted == true ) { 
	    	sum.push(v.properties.tot_refugees_hosted);
	  	}
	  	
	  	if ( datacats.originated == true ) { 
	    	sum.push(v.properties.tot_refugees_originated); 
	  	}
	  	 
		total = sum.reduce(function(a, b) { return a + b; }, 0);
		
		var obj = {};
		var props = {};
		obj["type"] = v.type;
		obj["geometry"] = v.geometry;
		props["year"] = (v.properties.year).toString();
		props["country"] = v.properties.country;
		props["x"] = v.properties.x;
		props["region"] = v.properties.region;
		props["sub_region"] = v.properties.sub_region;
		props["status"] = v.properties.status;
		props["official_name"] = v.properties.official_name;
		props["iso3"] = v.properties.iso3;
		props["y"] = v.properties.y;
		props["total"] = total;
		if ( datacats.conflict == true ) { 
	    	props["tot_idp_conflict"] = v.properties.tot_idp_conflict; 
	  	}
	  	if ( datacats.disaster == true ) { 
	    	props["tot_new_idp_disaster"] = v.properties.tot_new_idp_disaster; 
	  	}
	  	if ( datacats.hosted == true ) { 
	    	props["tot_refugees_hosted"] = v.properties.tot_refugees_hosted; 
	  	}
	  	if ( datacats.originated == true ) { 
	    	props["tot_refugees_originated"] = v.properties.tot_refugees_originated; 
	  	}
	  	obj["properties"] = props;
	  	
	  	row.push(obj);
	});
	row.sort();
	return row;
	
}

// add sum of data values and return value
var appendData = function (d) {
	var total = 0;
	for (var i = 0; i < d.values.length; i++) {
	    	total += d.values[i]["value"] << 0;
		}
	return total;
};

// the main svg draw function
function createLineChart(country, year) {
	// create data nests based on country
    var nested = d3.nest()
		.key(function(d) { return d.country; })
		.map(formatted);
    
    // only retrieve data from the selected country
    var data = sortNumbers(nested[country]);
    
    // add dark fill to map for country that is selected
    d3.selectAll('.world-poly-selected').style("fill", function() {
    	if (d3.select(this).attr("name") == country) {
    		return "#646464";
    	}
    });
        
    //set var for the scale based on data (can add color range here, but using CSS instead because the colors would not apply correctly when drawing order changed. Fix was to use to CSS and apply class names to data paths - not sure how to properly fix this)
	var scale = d3.scale.ordinal();
        
    // set keys for each type of data (column name) exclude all others
	scale.domain(d3.keys(data[0]).filter(function(key) {return (key !== "year" && key !== "country");}));

	var linedata = scale.domain().map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
			return {name:name, date: parseDate("01/01/"+d.year), value: parseFloat(d[name],10), country: d.country};
			})
		};
  	});

	//make an empty variable to stash the last values to sort the legend
	var lastvalues=[];

	//setup the x and y scales
	var x = d3.time.scale()
		.domain([
	    d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
	    d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
		])
		.range([0, width]);

	var y = d3.scale.linear()
	    .domain([
	    d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
	    d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
	    ])
	    .range([height, 0]);

	//draw the line		
	var line = d3.svg.line()
    	.x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.value); });

	//define the zoom
	var zoom = d3.behavior.zoom()
    	.x(x)
	    .y(y)
	    .scaleExtent([1,1])
    	.on("zoom", zoomed);

	//call the zoom on the SVG
    svg.call(zoom);
	
	// set the number of tick marks on the X axis
	var ticknum = 7;
	if (width <= 700) {
		ticknum = 4;
	}
	
	//create and append the x axis
	var xAxis = d3.svg.axis()
    	.scale(x)
	    .orient("top")
    	.tickPadding(15)
    	.tickSize((height+30)-0)
	    .ticks(ticknum);
    
    svg.append("svg:g")
	    .attr("class", "x axis");

	//create and append the y axis                  
	var yAxis = d3.svg.axis()
    	.scale(y)
	    .orient("left")
    	.tickSize(0-(width+40))
	    .tickPadding(10);
	    
    svg.append("svg:g")
    	.attr("class", "y axis")
    	.attr("transform","translate(-40,0)");

	//bind the data
	var thegraph = svg.selectAll(".thegraph")
    	.data(linedata);
    
    //change layer order (in order to get this to work I had to remove the data lines before each transition or else the data would bind to the wrong layer upon transition if the order was changed)
    d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
      
	//append a g tag for each line and set of tooltip circles and give it a unique ID based on the column name of the data     
	var thegraphEnter = thegraph.enter()
		.append("g")
	    .attr("class", "thegraph")
	    .attr('data', appendData)
      	.attr('id',function(d){ return d.name+"-line"; })
	  	.style("stroke-width","2px")
	  	.on("mouseover", function (d) {                                  
      		d3.select(this)
      		.moveToFront()	//moves the line to the front on mouseover so that you can see the lines that located behind other lines               
        	.style("stroke-width",'4px');	//on mouseover of each line, give it a nice thick stroke
        	
        	var selectthegraphs = $('.thegraph').not(this);	//select all the rest of the lines, except the one you are hovering on
        	d3.selectAll(selectthegraphs)
        		.style("opacity",0.2);	//drop the opacity on all the others
        		
        	var getname = document.getElementById(d.name+"-legend");	//get name of legend item ID
        	var selectlegend = $('.legend').not(getname);	//grab all the legend items that match the line you are on, except the one you are hovering on

        	d3.selectAll(selectlegend)
        		.style("opacity",.2);	// drop opacity on other legend names
			
        	d3.select(getname)
        		.attr("class", "legend-select");  //change the class on the legend name that corresponds to hovered line to be bolder        	
    	})
    	.on("mouseout",	function(d) {	//undo everything on the mouseout
      		d3.select(this)
        		.style("stroke-width",'2px');
        	
        	var selectthegraphs = $('.thegraph').not(this);
        	d3.selectAll(selectthegraphs)
        		.style("opacity",1);
        	
        	var getname = document.getElementById(d.name+"-legend");
        	var getname2= $('.legend[fakeclass="fakelegend"]');
        	var selectlegend = $('.legend').not(getname2).not(getname);

        	d3.selectAll(selectlegend)
        		.style("opacity",1);
        	
        	d3.select(getname)
        		.attr("class", "legend");        	
    	});
	
	//actually append the line to the graph
	thegraphEnter.append("path")
    	.attr("class", "line")
      	.attr("d", function(d) { return line(d.values[0]); });
  
	//then append some circles at each data point  
	thegraph.selectAll("circle")
		.data( function(d) {return(d.values);} )
		.enter()
		.append("circle")
		.attr("class", function(d) { return "tipcircle " + (d.country).replace(/\s+/g, '-').toLowerCase(); })
		.attr("cx", function(d,i){return x(d.date);})
		.attr("cy",function(d,i){return y(d.value);})
		.attr("data",function(d,i){return d.value;})
		.attr("r", function(d,i){if (!(d.value >= 1)) { return 0; } else {var r = (Math.sqrt(d.value)/Math.sqrt(7600000))*35; if (r < 5) {return 5;} if (d.country == "Global Figures") {return 5;} else {return r;} }}) // creates proportional circle points on the graph
		.style('opacity', 1)
		.attr ("title", maketip)
		.style("stroke-width",5)
		.on("mouseover", function (d) {	//uses javascript to create the fill on mouseover because for some reason it was not working via CSS after applying the moveToFront function
			if (d.name == "tot_idp_conflict") {
				d3.select(this).style("fill","rgb(232,71,77)");
			}
			if (d.name == "tot_new_idp_disaster") {
				d3.select(this).style("fill","rgb(255,126,131)");
			}
			if (d.name == "tot_refugees_hosted") {
				d3.select(this).style("fill","rgb(2,108,182)");
			}
			if (d.name == "tot_refugees_originated") {
				d3.select(this).style("fill","rgb(0,224,255)");
			}
			
		})
		.on("mouseout", function (d) { // changes the fill back to white on mouseout
			d3.select(this).style("fill","#FFFFFF");
		});
			
	//append the legend
    var legend = svg.selectAll('.legend')
        .data(linedata);
    
    var legendEnter = legend
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('id',function(d){ return d.name + "-legend"; })
        .attr('data', appendData)	// adds data sum to item
        .on('click', function (d) {	//onclick function to toggle off the lines        	
        	if($(this).css("opacity") == 1){	//uses the opacity of the item clicked on to determine whether to turn the line on or off        	

	        	var elemented = document.getElementById(this.id +"-line");   //grab the line that has the same ID as this point along w/ "-line" 
	        	d3.select(elemented)
	        		.transition()
	        		.duration(1000)
	        		.style("opacity",0)
	       			.style("display",'none');
        	
	        	d3.select(this)
	        		.attr('fakeclass', 'fakelegend')
	     			.transition()
	        		.duration(1000)
	      			.style ("opacity", .2);
      		} else {
      		
	      		var elemented = document.getElementById(this.id +"-line");
	        	d3.select(elemented)
		        	.style("display", "block")
		        	.transition()
	    	    	.duration(1000)
	        		.style("opacity",1);
        	
	        	d3.select(this)
	        		.attr('fakeclass','legend')
	      			.transition()
	        		.duration(1000)
	      			.style ("opacity", 1);}
		});

	//create a scale to pass the legend items through
	var legendscale = d3.scale.ordinal()
				.domain(lastvalues)
				.range([0,30,60,90,120,150,180,210]);

	//actually add the circles to the created legend container
    legendEnter.append('circle')
        .attr('cx', width + 60)
        .attr('cy', function(d){return legendscale(d.values[d.values.length-1].value);})
        .attr('r', 7);
        	        	
	//add the legend text
    legendEnter.append('text')
        .attr('x', width + 75)
        .attr('y', function(d){return legendscale(d.values[d.values.length-1].value);})
        .text(function(d){ return changeName(d.name); });
	
	if (country === "Global Figures") {
      	$('#tot_refugees_hosted-legend text').html("Refugees");
     }
     
 	// set variable for updating visualization
    var thegraphUpdate = d3.transition(thegraph);
    
    thegraphUpdate.attr('data', appendData);
    
    // change values of path and then the circles to those of the new series
    thegraphUpdate.select("path")
    	.attr("d", function(d, i) {       
      
      		//must be a better place to put this, but this works for now
      		lastvalues[i]=d.values[d.values.length-1].value;         
        	lastvalues.sort(function (a,b){return b-a;});
      		legendscale.domain(lastvalues);
      	
      		return line(d.values); });
      
    thegraphUpdate.selectAll("circle")
	  	.attr ("title", maketip)
	  	.attr("cy",function(d,i){return y(d.value);})
	  	.attr("cx", function(d,i){return x(d.date);})
	  	.attr("r", function(d,i){if (!(d.value >= 1)) { return 0; } else {var r = (Math.sqrt(d.value)/Math.sqrt(7600000))*35; if (r < 5) {return 5;} if (d.country == "Global Figures") {return 5;} else {return r;} }}); // creates proportional circle points on the graph


	// and now for legend items
	var legendUpdate = d3.transition(legend);
	legendUpdate.attr('data', appendData);
		  
	legendUpdate.select("circle")
		.attr('cy', function(d, i){  
			return legendscale(d.values[d.values.length-1].value);});

	legendUpdate.select("text")
		.attr('y',  function (d) {
			return legendscale(d.values[d.values.length-1].value);
		});


 	// update the axes,   
    d3.transition(svg).select(".y.axis")
    	.call(yAxis);   
          
    d3.transition(svg).select(".x.axis")
    	.attr("transform", "translate(0," + height + ")")
        .call(xAxis);

	//make my tooltips work
	$('circle').tipsy({opacity:.9, gravity:'n', html:true});


	//define the zoom function
	function zoomed() {
    	svg.select(".x.axis").call(xAxis);
    	svg.select(".y.axis").call(yAxis);

		svg.selectAll(".tipcircle")
			.attr("cx", function(d,i){return x(d.date);})
			.attr("cy",function(d,i){return y(d.value);});
			
		svg.selectAll(".line")
    		.attr("class","line")
        	.attr("d", function (d) { return line(d.values);});
        	
        //add selected year class to the corresponding tick text
		d3.selectAll(".tick text").each(function() {
			if (this.innerHTML == year) {
				d3.select(this.parentNode).attr("class","tick selected-year");
			}
		});
	}
	
	//add selected year class to the corresponding tick text
	d3.selectAll(".tick text").each(function() {
		if (this.innerHTML == year) {
			d3.select(this.parentNode).attr("class","tick selected-year");
		}
	});
	

} //end of the createLineChart function


 // function that redraws the line chart when the country is changed / remove first the previous lines and legend so the data does not get appended to the wrong line  
function changeChart(country, year) {
  d3.transition()
      .duration(altKey ? 7500 : 1500)
      .each( function() {
        d3.selectAll('.thegraph').remove();
        d3.selectAll('.legend').remove();
      	createLineChart(country, year);
      	createPictogram(country,year);
      });
}

function changeMap(countrylist, year, country) {
  d3.transition()
      .duration(altKey ? 7500 : 1500)
      .each( function() {
      	d3.selectAll('.piecharts').remove();
      	createPieCharts(countrylist, year);
      	createPictogram(country,year);
      });
}


// creates the base layers for the map
function makeMap() {
	
	// read the map polygon data and append the data to the group	
	d3.json(world_poly, function(error, wp) {
		if (error) return console.error(error);
		
	  	polygroup.selectAll("path")
	  		.data(wp.features)
	  		.enter()
	  		.append("path")
	    	.attr("d", d3.geo.path().projection(projection))
	    	.attr("class","world-poly")
	    	.attr("name", function(wp,i){return wp.properties["Terr_Name"];});
	});
	
	// read the map country outline data and append to the group
	d3.json(world_line, function(error, wl) {
		if (error) return console.error(error);
	  	
	  	var cartograph = function(wl) { return (wl.properties["Cartograph"]).replace(/\s+/g, '-').toLowerCase(); };
	   	linegroup.selectAll("path")
	   		.data(wl.features)
	  		.enter()
	  		.append("path")
	    	.attr("d", d3.geo.path().projection(projection))
	    	.attr("class", function(wl,i){return cartograph(wl) + " world-lines";});
	});
	
	// zoom and pan
	var zoom = d3.behavior.zoom().scaleExtent([1,2]) //limit the zoom level by setting the scaleExtent
    .on("zoom",function() {
        polygroup.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        polygroup.selectAll("path")  
            .attr("d", d3.geo.path().projection(projection));
        linegroup.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        linegroup.selectAll("path")  
            .attr("d", d3.geo.path().projection(projection));
        datagroup.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        datagroup.selectAll("g")  
            .attr("d", d3.geo.path().projection(projection));
       	 
	});
	
	// only enable pan and zoom when the map is in focus
	$( "#map1" ).focus(function() {
		mapsvg.call(zoom)
		.on("mousedown", function() {
	    	d3.select(this).style("cursor","grabbing");
	    })
	    .on("mouseup", function() {
	    	d3.select(this).style("cursor","default");
     	});
	});
	
	$( "#map1" ).blur(function() {
		mapsvg.on('.zoom', null); // disable zoom and pan when the map is not in focus
	});

	
} //end makemap

// creates the data layer and adds to the map
function createPieCharts(countrylist, year) {
	
	// create data nests based on year
    var nested = d3.nest()
		.key(function(d) { return d.properties.year; })
		.map(mapdata);
    
    // only retrieve data from the selected year
    var data = sortNumbers(nested[year]).sort(function(a,b) {return b.properties.total-a.properties.total;});
        
	// define the radius of the map points
	var radius = d3.scale.sqrt()
    .domain([0, 1e6])
    .range([0, 10]);
    
    // add data to the pie slices
  	var pie = d3.layout.pie()
	.value(function(d) { return d.count; })
	.sort(null);
  
    // create shortcut for the path
    var path = d3.geo.path();
	
	// create the pie groups
	var piegroup = datagroup.selectAll('.piecharts')
    .data(data)
    .enter()
    .append("g").attr("class","piecharts")
    .attr ("title", makeMaptip)
    .attr("transform", function(d) {
     	return "translate(" + projection([d.properties.x, d.properties.y])[0] + "," + projection([d.properties.x, d.properties.y])[1] + ")";
     })
    .attr("name", function(d) { return d.properties.country; });
    
    if ('WebkitAppearance' in document.documentElement.style) {
    	piegroup.style("filter", "url(#drop-shadow)");
    }
        
	// append the data to the map
	piegroup.selectAll(".pieslice")
	.data( function(d) {
		datacats = getDataCats();
		var piedata = [];
		if ( datacats.conflict == true ) { 
	    	piedata.push({ label: 'tot_idp_conflict', count: d.properties.tot_idp_conflict, total: d.properties.total });
	  	}
	  	if ( datacats.disaster == true ) { 
	    	piedata.push({ label: 'tot_new_idp_disaster', count: d.properties.tot_new_idp_disaster, total: d.properties.total }); 
	  	}
	  	if ( datacats.hosted == true ) { 
	    	piedata.push({ label: 'tot_refugees_hosted', count: d.properties.tot_refugees_hosted, total: d.properties.total }); 
	  	}
	  	if ( datacats.originated == true ) { 
	    	piedata.push({ label: 'tot_refugees_originated', count: d.properties.tot_refugees_originated, total: d.properties.total }); 
	  	}
		return pie(piedata); 
	})
	.enter().append("path")
	.attr("class", "pieslice")
	.attr("d", d3.svg.arc().innerRadius(0).outerRadius( function(d) { if (!(d.data.total >= 1)) { return 0; } else {var r = (Math.sqrt(d.data.total)/Math.sqrt(7600000))*35	; if (r < 3) {return 3;} else {return r;} } }))
	.attr("class", function(d) {return d.data.label+"-slice";});
	 
  	// add some click and hover states depending on the data
  	d3.selectAll(".piecharts")
  	.on("mouseover", function(d){
  		c = d.properties.country;
  		d3.selectAll(".piecharts").style("opacity",1);
  		d3.selectAll(".piecharts:not([name='"+c+"'])").style("opacity",0.05);
  	})
  	.on("mouseout", function(d){
  		if ( !($('#countries').val() === d.properties.country) ) {
  			d3.selectAll(".piecharts:not([name='"+c+"'])").style("opacity",1);
  		}
  	}).on("click",function(d) {
		country = d3.select(this).attr("name");
		$("#countries").val(country);
		changeChart(country, year); // force data to update when one clicks on a pie chart on the map
	 	mapsvg.on("click",function() { d3.selectAll(".piecharts").style("opacity",1); }); // change the opacity of the pie charts when one clicks anywhere on the map
		d3.event.stopPropagation(); // used to prevent mapsvg click function from automatically running when clicking on a pie chart
	});
  	
  	
		
 	//make my tooltips work
	$('.piecharts').tipsy({opacity:.9, gravity:'sw', html:true});
	 	
  	// adds class names to polygroup items depending on whether or not the country is listed among the data
    polygroup.selectAll("path").attr("class", function() {
    	var name = d3.select(this).attr("name");
    	if (!(countrylist.indexOf(name) == -1)) {
    		return "world-poly-selected";
    	} else {return "world-poly";}
    });
}

function createPictogram(country,year) {
	// remove the pictogram if it exists
	if (d3.select('#pictogram svg')) {
		d3.select('#pictogram svg').remove();
	}
	
	// create data nests based on year (uses raw data becuase we want to include all the data regardless of what is selected in the category selector)
    var nested = d3.nest()
		.key(function(d) { return d.properties.year; })
		.map(rawdata);
    
    // only retrieve data from the selected year
    var data = sortNumbers(nested[year]).sort(function(a,b) {return b.properties.total-a.properties.total;});
    
    // create data nest based on country
   	nested = d3.nest()
		.key(function(d) { return d.properties.country; })
		.map(data);
    
    //only return the selected country
    data = nested[country];
   
   // get the total of IDPs for the country
    var totidps = function() {
    	return parseInt(data[0].properties.tot_idp_conflict) + parseInt(data[0].properties.tot_new_idp_disaster);
    };
    
    // append the text data to the Pictogram
    d3.select('#map-infos h1').html(data[0].properties.country);
    d3.select('.map-infos-year').html(data[0].properties.year);
    d3.select('.idp-total').html( function() {
    	var total = NumbType(totidps());
    	if (totidps() >= 10) {
    		return total+"+";
    	} else {
    		return total;
    	}
    });
        
    // set the value of each infographic piece; set it higher for the global figures
    if (country == "Global Figures") {
    	var targetNum = 2400000;
    } else {
    	var targetNum = 300000;
    }
    
    // set the number of columns of the pictogram
    var columnNum = 6;
    
    // calculate the number pictogram icons required for the total number of IDPs
    var pictograms = totidps()/targetNum;
        
    // calculate the number of rows required to meet the total
    var rowNum = Math.floor(pictograms/columnNum);
    
    // calculate the number of pictograms in the full rows
    var fullrows = rowNum*columnNum;
    
    // get the remainder of pictograms in order to append in the extra row
    var remainder = pictograms-fullrows;
  
    // get the number of non-partial pictograms to append to the last row
    var lastrowpictograms = Math.floor(remainder);
    
    // store the percentage of the remainder that is partial (the right side of the decimal)
    var partialpictogram = remainder % 1;

    // define the shape of the pictogram picture
	var shape = "M4,2.3c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2C4.8,4.3,4,3.4,4,2.3z M8.9,6.3c-0.5-1-1-1.6-2.8-1.6 H5.7C3.9,4.7,3.4,5.3,3,6.3c-0.5,1-2.4,6.2-2.4,6.2c-0.1,0.2,0,0.5,0.2,0.6c0.2,0.1,0.5,0,0.6-0.2L4,7.6l-1.3,8.1H4l0.4,7.2 c0,0.2,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5l0.4-7.2h0.4l0.4,7.2c0,0.2,0.2,0.5,0.5,0.5c0.3,0,0.5-0.2,0.5-0.5l0.4-7.2h1.3 L7.8,7.6l2.7,5.3c0.1,0.2,0.4,0.3,0.6,0.2c0.2-0.1,0.3-0.4,0.2-0.6C11.3,12.6,9.4,7.3,8.9,6.3z M33.1,12.5c0,0-1.7-5.3-2.2-6.2 c-0.5-1-1.2-1.6-3-1.6h-0.4c-1.8,0-2.6,0.6-3,1.6c-0.5,1-2.2,6.2-2.2,6.2c-0.1,0.2,0,0.5,0.2,0.6c0.2,0.1,0.5,0,0.6-0.2l2.4-5.3 l0.1,4.2l-0.4,10.7c0,0.4,0.3,0.8,0.7,0.8c0,0,0,0,0.1,0c0.4,0,0.7-0.3,0.8-0.7l0.9-8.8l0.9,8.8c0,0.4,0.4,0.7,0.8,0.7 c0,0,0,0,0.1,0c0.4,0,0.7-0.4,0.7-0.8l-0.4-10.7h0l0.1-4.2l2.4,5.3c0.1,0.2,0.4,0.3,0.6,0.2C33.1,13.1,33.2,12.8,33.1,12.5z  M27.7,4.3c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2c-1.1,0-2,0.9-2,2C25.7,3.4,26.6,4.3,27.7,4.3z M19.4,11.4c-0.4-0.9-0.9-1.4-2.5-1.4 h-0.1h-0.1c-1.6,0-2.1,0.5-2.5,1.4c-0.4,0.9-1.4,4.2-1.4,4.2c-0.1,0.2,0,0.5,0.2,0.5c0.2,0.1,0.4,0,0.5-0.2l1.6-3.4L14,18.3h1.1 l0.4,4.7c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4l0.3-4.7h0.1h0.1l0.3,4.7c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4 l0.4-4.7h1.1l-1.2-5.7l1.6,3.4c0.1,0.2,0.3,0.3,0.5,0.2c0.2-0.1,0.3-0.3,0.2-0.5C20.7,15.6,19.8,12.3,19.4,11.4z M14.9,9.6 c0.3,0,0.6-0.2,0.7-0.4c0.3,0.3,0.7,0.4,1.1,0.4c0.4,0,0.8-0.2,1.1-0.4c0.1,0.3,0.4,0.4,0.7,0.4c0.5,0,0.8-0.4,0.8-0.8 c0-0.4-0.4-0.8-0.8-0.8c0,0-0.1,0-0.1,0c0-0.1,0.1-0.2,0.1-0.2c0-1-0.8-1.8-1.8-1.8c-1,0-1.8,0.8-1.8,1.8C15,7.9,15,7.9,15,8 c0,0-0.1,0-0.1,0c-0.5,0-0.8,0.4-0.8,0.8C14.1,9.3,14.5,9.6,14.9,9.6z";
	
	// define the id of the container for the svg
	var id = d3.select('#pictogram');
	
	// get the width and height of the container
	var width = id.node().getBoundingClientRect().width;
	var height = id.node().getBoundingClientRect().height;
	
	// append the svg
	var svg = id.append('svg').attr("width", width).attr("height", height);
	
	// append temporarily to get the clip width and height, store variables and then remove (there is probably a better way of doing this).
	svg.append('g').attr("class","pictogroup").append('g:path').attr("d",shape).attr("class","full").attr("clip-path","url(#themask)").style("opacity",0);
	var clipWidth = d3.select('.full').node().getBoundingClientRect().width; // store the clip width
	var clipHeight = d3.select('.full').node().getBoundingClientRect().height; // store the clip height
	d3.selectAll(".pictogroup").remove(); // remove after storing the height and width variables
	
	// reset the parent height to fit the number of rows exactly
	var parentheight = 	Math.round(clipHeight*(rowNum + 1)) + 10;
	id.attr("style", "height:"+parentheight+"px;");
	svg.attr("height", parentheight);
	
	var s; // an empty var for iterating
	
	// append the rows to the svg and save the clip height as data attribute to parent to retrieve later to add to the translate function
	for (s = 0; s <= rowNum; s++) {
	  	svg.append('g').attr("class","pictogroup").attr("d", s*(clipHeight)); 
	}
	
	// add the pictogram icons to the rows
	for (s = 0; s < columnNum; s++) {
		d3.selectAll('.pictogroup').append('path').attr("d",shape).attr("class", "full").attr("clip-path","url(#themask)")
	  	.attr("transform", function() {
	  		width = s*(clipWidth); // the width of the icon multiplied by the number of columns for each
	  		height = d3.select(this.parentNode).attr("d"); // retrieve the y translation from the parent node data attribute
	  		return "translate("+width+","+height+")";
	  	});
	  	
	  	// if there is not a remainder, remove the last row, or if there is a remainder just clear the last row of contents to re-add the correct number
		if (remainder = 0) {
		  	d3.select('.pictogroup:last-of-type').remove();
	  	} else {
		  	d3.select('.pictogroup:last-of-type path').remove();
	  	}
	}
	
	// add the pictograms to the last row (this includes the partial one for now)
	for (s = 0; s <= lastrowpictograms+1; s++) {
		d3.select('.pictogroup:last-of-type').append('path').attr("d",shape).attr("class", "full").attr("clip-path","url(#themask)")
	  	.attr("transform", function() {
	  		width = s*(clipWidth);
	  		height = d3.select(this.parentNode).attr("d");
	  		return "translate("+width+","+height+")";
	  	});	
	}
	
	// reset the clip path for the final partial icon
	d3.select('.pictogroup:last-of-type path:last-of-type').attr("clip-path","url(#themask-partial)");
	
	// add some metadata to the svg for defining the clipping paths	- this case the the clipWidth is 100% of the icon
	svg.append('svg:defs').append('defs:clipPath').attr("id","themask").append('clipPath:rect').attr("x",0).attr("y",0).attr("width", clipWidth).attr("height", clipHeight).style("fill","rgb(2,108,182)");
	
	// add another metedata for the partial icon clipping path which is the clip width multiplied by the partial pictogram percentage
	d3.select('svg defs').append('defs:clipPath').attr("id","themask-partial").append('clipPath:rect').attr("x",0).attr("y",0).attr("width", clipWidth*partialpictogram).attr("height", clipHeight).style("fill","rgb(2,108,182)");
}


// runs when page is done loading			
$(document).ready(function (){
		
	// draws the map
	makeMap();

	// read in the json data and perform functions with the data
	d3.json(json, function(error, data) {
		// sets the data to the ojects
		data = data.features;
		
		//raw data
		rawdata = data;
		
		// create country select menu from data
		var c = getCountryList(data);
		createSelect(c,"#countries", true);
		
		// create year select menu from data
		var y = getYears(data);
		createSelect(y,"#years");
		$('#years').val('2015');
		
		// set the initial country value to the select menu value
		var country = $("#countries").val();
		
		// set the initial year to 2015 data
		var year = $("#years").val();
		
		// format the chart dataset using the createDataset function
		formatted = createDataset(data);
		
		// sets the map data to unformatted data rather than the formatted data used in the line chart in order to access the geodata
		mapdata = createMapDataset(data);
		
		// create the initial line chart
		createLineChart(country, year);
		
		// add the data to the map / params are countrylist and year
	    createPieCharts(c, year);
	    
	    //create pictogram
	    createPictogram(country,year);
		
		// force data to update when country select menu is changed
		d3.select("#countries").on("change", function() {
		// get value from menu selection 
		    country = $("#countries").val();
			changeChart(country, year);
		});
		
		// force data to update when when the categories are toggled
		d3.selectAll(".cat-selector").on("change", function() {
			formatted = createDataset(data);
			mapdata = createMapDataset(data);
			changeChart(country, year);
			changeMap(c, year, country);
		});
		
		// force data to update when one clicks on a country on the map
		$("#world-polys path").on("click", function() {
			country = d3.select(this).attr("name");
			$("#countries").val(country);
			changeChart(country, year);
		});
		
		//force map to update when the years are changed
		d3.selectAll(".tick text").on("click", function() {
			year = d3.select(this).html();
			$("#years").val(year);
			d3.selectAll(".selected-year").attr("class","tick");
			d3.select(this.parentNode).attr("class","tick selected-year");
			changeMap(c, year, country);
		});
		
		// force data to update when year select menu is changed
		d3.select("#years").on("change", function() {
			// get value from menu selection 
		    year = $("#years").val();
			changeMap(c, year, country);
			d3.selectAll(".selected-year").attr("class","tick");
			var theyears = d3.selectAll(".tick text");
			$.each(theyears[0], function(k,v) {
				if (v.innerHTML == year) {
					d3.select(this.parentNode).attr("class","tick selected-year");
				};
			});
		});
		
		// add key functionality
		d3.select(window)
	    .on("keydown", function() { altKey = d3.event.altKey; })
	    .on("keyup", function() { altKey = false; });
	    
	    // add responsive
	    var resizeTimer;
		$(window).on('resize', function(e) {
		  clearTimeout(resizeTimer);
		  resizeTimer = setTimeout(function() {
			location.reload();
		  }, 150);
		});
	    
	});
	
}); // end document ready



