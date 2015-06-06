var chart;
var infoBars;
var xInfoVisModes;
var yInfoVisModes;

var curentDataVis = "totalDistance";

var xAxis;
var xAxisSVG;

var barHeight = 15;
var barGap = 2;
var rules;

var barsScore;
var barLabel;
var labelImages;


//define size and margins
var margin = {top: 10, right: 0, bottom: 0, left: 20};
var graphWidth = 178 - margin.left - margin.right;
var graphHeight;

$(document).ready(function() {

	var optionButtuns = $("#info-mode-option").find("label");
    optionButtuns.on("click",function(e) {
    	if ($(this).text() == "Distance") {
    		curentDataVis = "totalDistance";
    	} else {
    		curentDataVis = "totalDuration";;
    	}
        updateInfoVis();
        updateListDays();
    });

    resize();

})

function createInfoVis() {
	chart = d3.select($("#info-mode-vis")[0])
	    .append('svg')
	    .attr('class', 'chart')
	    	.attr('width', graphWidth + margin.left + margin.right)
	   	//.append("g")
	    	//.attr("transform", "translate(0," + margin.top + ")");

	// xAxis = d3.svg.axis()
 //    	.orient("bottom");

 //    xAxisSVG = chart.append("g")
 //   		.attr("class", "x axis");

   	
}

function updateInfoVis() {

	// 0
	//transform activiModes to remove null activities
	for (var i = activeModes.length-1; i >= 0; i--) {
		if (activeModes[i].key == "undefined") {
			activeModes.splice(activeModes.indexOf(activeModes[i]),1);
		}
	}


	//1. X Axis
	xInfoVisModes = d3.scale.linear()
    	.domain([0, d3.max(activeModes, function(d) { return d.values[curentDataVis]; })])
    	.range([0, graphWidth]);

   	//2. Y Axis
    yInfoVisModes = d3.scale.ordinal()
    	.domain(activeModes.map(function(d) { return d.key; }))
    	.rangeBands([0, (barHeight + (2 * barGap)) * activeModes.length]);

   	//3. Fist time
    if(!chart) createInfoVis();

    //4. Height
    graphHeight = (activeModes.length * (barHeight + (2 * barGap)));
    chart.attr('height', graphHeight);

    //5. AXIS
 	//xAxis.scale(xInfoVisModes);

	// xAxisSVG.attr("transform", "translate(0," + (graphHeight - 20) + ")")
	//  	.call(xAxis);


	//6. Bars
	infoBars = chart.selectAll(".infoBars")
	    .data(activeModes);

	infoBars.enter().append("rect");

	infoBars.exit().remove();

	infoBars.attr("class", "infoBars infoBars-default")
	    .attr("x", margin.left)
	    .attr("y", function(d) { return yInfoVisModes(d.key); })
	    .attr("width", 0)
	    .attr("height", barHeight)
	    .transition()
 			.duration(600)
 			.attr("width", function(d) { return xInfoVisModes(d.values[curentDataVis]); })
 			.delay(function(d, i) { return 300+(i * 50); });

 	if (encode == "transportation") {
 		infoBars.attr("fill",function(d) { return getColorByAtivity(d.key); });
 	} else {
 		infoBars.attr("fill", "#333");
 	}

 	infoBars.on("mouseover", function(d) {
			var singular = d3.select(this).attr("class","infoBars infoBars-danger");

 			if (encode == "transportation") {
 				singular.attr("fill-opacity",.6);
 			} else {
		 		singular.attr("fill", "#d9534f");
		 	}

			var highlight = {
				type: "mode",
				value: d.key,
			}

			highlightRoute(highlight);
		})
		.on("mouseout", function(d) {
			var singular = d3.select(this).attr("class","infoBars infoBars-danger");

 			if (encode == "transportation") {
 				singular.attr("fill-opacity",1);
 			} else {
		 		singular.attr("fill", "#333");
		 	}

			var highlight = { type: "reset" };
			highlightRoute(highlight);
		})

 	//7. slices

 	// chart.append("g")
	 //    .attr("class", "grid")
	 //    .attr("transform", "translate(0," + graphHeight + ")")
	 //    .call(d3.svg.axis().scale(xInfoVisModes).ticks(4).tickSize(-graphHeight))
	 //  .selectAll(".tick")
	    //.data(xInfoVisModes.ticks(4), function(d) { return d; })


 	//8.  Score
 	//Select labels and update data
 	barsScore = chart.selectAll(".barScore")
 		.data(activeModes);

	//add new data
	barsScore.enter()
	  .append("text")
		.attr("class","barScore");
	 			  
	//remove data not binded
	barsScore.exit().remove();

	barsScore.attr("y", function(d) { return yInfoVisModes(d.key); })
		.attr("x", margin.left)
		.classed("textAnchorLeft", function(d) { return xInfoVisModes(d.values[curentDataVis]) < (graphWidth/2); })
		.attr("dx", function(d) { 
			if (xInfoVisModes(d.values[curentDataVis]) < (graphWidth/2)) {
				return 3;
			} else {
				return -3;
			}; }) 
     	.attr("dy", barHeight-3);

	barsScore.text(function(d) {
		if (curentDataVis == "totalDistance") {
			return metersToKm(d.values[curentDataVis]) + " km";
		} else {
			return transformDurationTimeString(d.values[curentDataVis]);
		}
	});

	barsScore.transition()
 			.duration(600)
 			.attr("x", function(d) { return margin.left + xInfoVisModes(d.values[curentDataVis]); })
 			.delay(function(d, i) { return 300+(i * 50); });



 	//9. Labels
 	//Select labels and update data
 // 	barLabel = chart.selectAll(".barLabel")
 // 		.data(activeModes);

	// //add new data
	// barLabel.enter()
	//   .append("text")
	// 	.attr("class","barLabel");
	 			  
	// //remove data not binded
	// barLabel.exit().remove();

	// barLabel.attr("y", function(d) { return yInfoVisModes(d.key); })
	// 	.attr("x", 0)
	// 	.classed("textAnchorLeft", function(d) { return xInfoVisModes(d.values[curentDataVis]) < (graphWidth/4); })
	// 	//.attr("dx", -5) 
 //     	.attr("dy", barHeight-1);

	// barLabel.text(function(d) { return d.key; });

	// barLabel.transition()
 // 			.duration(600)
 // 			.attr("opacity", 1)
 // 			.delay(function(d, i) { return 300+(i * 50); });


 	labelImages = chart.selectAll(".label-image")
 		.data(activeModes);

 	labelImages.enter()
 		.append("svg:image")
 			.attr("class","label-image");

 	labelImages.exit().remove();

    labelImages.attr("xlink:href", function(d) { return "images/icons/" + d.key + ".png"; })
        .attr("x", 0)
        .attr("y", function(d) { return yInfoVisModes(d.key); })
        .attr("width", barHeight)
        .attr("height", barHeight);


    //update
    resize();
}


function metersToKm(meters) {
	var km = Math.round(meters/100) / 10; // roudning with 1 decimal point
	if (km >= 100) km = Math.round(km);
	if (km >= 1000) km = addCommas(km);
	return km;
}

function addCommas(n){
    var rx=  /(\d+)(\d{3})/;
    return String(n).replace(/^\d+/, function(w){
        while(rx.test(w)){
            w= w.replace(rx, '$1,$2');
        }
        return w;
    });
}

function transformDurationTimeString(duration) {

    var durationString = ""; //String to return

    //temp variables
    var d = duration;
    var dSec = 0;
    var dMin = 0;
    var dHour = 0;
    var dDays = 0; 

    //seconds
    //if more than 60, compute seconds, subtract from total
    //if less than 60, compute seconds
    if (d >= 60) {
      dSec = d%60;        //remainder of duration divided by 60 seconds
      d = (d-dSec)/60;    //quocient of duration divided by 60 seconds
    } else {
      dSec = d;
      d = 0;
    }

    //minutes
    //if more than 60, compute minutes and subtract from total
    //if less than 60, compute minutes
    if (d >= 60) {
      dMin = d%60;        //remainder of duration divided by 60 minutes
      d = (d-dMin)/60;    //quocient of duration divided by 60 minutes
    } else {
      dMin = d;
      d = 0;
    }

    //hours
    //if more than 0, compute hours
    if (d > 0) {
      dHour = d;
    }

    //create string
    if (dHour > 0) {
      durationString += dHour + "h:";  //add hour and unit
    }

    if (dMin > 0) {
      durationString += dMin + "m";   //add minutes and unit
    }
    if (dSec > 0 && dHour == 0) {
      durationString += ":" + dSec + "s";  //add seconds and unit
    }

    return durationString;  //return string
  }

//list days
var container;
var daysContent;
var day;
var item;
var dayPanelHead
var panelBody;


function createListDays() {

	//container
	container = d3.select("#day-list")
		.append("div")
		.attr("id","days-container");

	daysContent = d3.select("#days-container")
		.append("div")
		.attr("id","daysContent");

	
}


function updateListDays() {

	if(!container) createListDays();

	//day
	day = daysContent.selectAll(".day")
	    .data(activeDays);

	day.enter().append("div")
		.attr("class","day panel panel-default")
		.on("mouseenter", function(d) {
			d3.select(this).attr("class","day panel panel-danger")

			var highlight = {
				type: "date",
				value: d.key,
			}

			highlightRoute(highlight);
		})
		.on("mouseleave", function(d) {
			d3.select(this).attr("class","day panel panel-default");
			var highlight = { type: "reset" };
			highlightRoute(highlight);
		})

	day.exit().remove();

	day.html(""); //reset

	//heading
	day.append("div")
		.attr("class","panel-heading")
		.text(function(d) { 
	        var headDate = moment(d.key, "YYYYMMDD");
	        return headDate.format("DD MMM");
	    })

	//body
    panelBody = day.append("div")
		.attr("class","panel-body");

	//no activity
	panelBody.append("span")
		.attr("class","daily-info")
		.text(function(d) {
			if (d.values.length == 0) { return "no activity"; }
		})


	//item
	item = panelBody.selectAll(".item-day")
		.data(function(d) {
	        return d.values;
	    });


	item.enter().append("div")
		.attr("class","item-day")

	item.exit().remove();

	//image
	item.append("img")
 		.attr("src", function(g) { return "images/icons/" + g.name + ".png"; })
        .attr("width", barHeight)
        .attr("height", barHeight);

    //info
	item.append("span")
		.attr("class","daily-info")
		.text(function(g) {
			if (curentDataVis == "totalDistance") {
				return metersToKm(g.distance) + " km";
			} else {
				return transformDurationTimeString(g.duration);
			}
		});

	resize();
    
}

function resize() {

	//resize info panel
	$("#info-panel").height(window.innerHeight - 110);
	if ($("#info-panel").height() < 380) $("#info-panel").height(380); //minimum

	//resize days list container
	$("#days-container ").height($("#info-panel").height() - 65 - $("#info-mode-vis").height());

	//conainer is bigger than the content, reduce panel height
	if ($("#days-container ").height() > $("#daysContent").height()) {
		$("#days-container ").height($("#daysContent").height() + 10);
		$("#info-panel").height($("#days-container ").height() + $("#info-mode-vis").height() + 65);
	}

}

window.onresize = function() {
    resize();
};




