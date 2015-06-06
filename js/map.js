//******** Global Variables
var map;
var data;
var userInfo ;

var overlay;

var renderPhase = 0;

var layer;
var svgMoves;
var svgPlaces

//////// data vars
var places;
var moves;
var filteredMoves;
var activeModes;
var activeDays;

//map vars
var centerLocation = {
    lat:49.28,
    lon:-123.13
};

//filter vars
var filterFinalDate = moment();
var filterInitialDate = moment(filterFinalDate).subtract(6, 'days');
var filterMonth = ""//4;
var filterPeriod = "Range";
var filterMode = "all";

//
var minDuration = 99999999999999;
var maxDuration = 0;

var encode = "none";

var moveElements;

//**** DATA

function init() {

    //map div size
    var wHeight = $(window).height();
    var barHeight = $("#bar").height();
    $("#map").height(wHeight-44);

    buildMap();

    loadUserProfile();
};


function loadUserProfile() {
    $.ajax({
        method: "POST",
        url: "moves_api/connectMoves.php",
        data: {
            accessToken: userInfo.accessToken,
            action: "profile"
        }
    })
    .done(function(data) {

        if (userInfo.userID == "") userInfo.userID = JSON.parse(data).userId;
        userInfo.profile = JSON.parse(data).profile;
        userInfo.profile.firstDate = moment(userInfo.profile.firstDate, "YYYYMMDD");

        startListners(); //menu bar

        getUserData(0);

    });

}

function getUserData(starter) {

    //console.log(filterInitialDate,filterFinalDate);

    //test user initial date
    if (filterInitialDate.isBefore(userInfo.profile.firstDate)) {
        filterInitialDate = moment(userInfo.profile.firstDate);
        datetimepicker1.data("DateTimePicker").setDate(filterInitialDate);
    }


    //build request parameters
    var requestData = {
        accessToken: userInfo.accessToken,
        action: "storyline",
        rangeRequest: "single",
        startDate: filterInitialDate.format('YYYY-MM-DD'),
        endDate: filterFinalDate.format('YYYY-MM-DD')
    }

    //test if there are more than 7 days -> Moves limitations 
    var filterDateRange = moment.twix(filterInitialDate.startOf("day"), filterFinalDate.startOf("day"));
    var duration = moment.duration(6, 'days');

    if (filterDateRange.count("days") > duration.asDays()) {
        requestData.rangeRequest = "multiple";
        requestData.range = brakeRangeRequest(filterDateRange,duration);
    };

    showLoading(true);


    //Request thrugh PHP
    $.ajax({
        method: "POST",
        url: "moves_api/connectMoves.php",
        data: requestData
    })
    .done(function(story) {

        data = JSON.parse(story);

        // console.log(data);
        
        updateDateFilters();

        if (starter != 0) {
            render();
            render();
        } else {
            doOverlay();
        }

        showLoading(false);
        
        
    }); 

}

function brakeRangeRequest(range,dur) {

    //split date range in chinks of 7 days
    var rangeSplit = range.split(dur);
    var rangeArray = [];

    //for each chunk subtract 1 day - > 7 days from day 1 ends on day 8 because moments treats date in its details - seconds. So midnight to midnight.
    for (var i=0; i<rangeSplit.length; i++) {
        if (i != rangeSplit.length-1) rangeSplit[i].end.subtract(1,"days");

        //get only the date ftring format to send the request
        rangeArray.push({
            start: rangeSplit[i].start.format('YYYY-MM-DD'),
            end: rangeSplit[i].end.format('YYYY-MM-DD')
        });
    }

    return rangeArray;

}

//new function to D3
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};


//****

$(window).resize(function() {
    //map div size
    var wHeight = $(window).height();
    $("#map").height(wHeight-88);
});

function buildMap() {
    var $map = $("#map");
    map = new google.maps.Map($map[0], {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerLocation.lat, centerLocation.lon), // Vancouver
        styles: [{
            "stylers": [{
                "saturation": -75
            }, {
                "lightness": 50
            }]
        }]
    });
}


function doOverlay() {

    overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {

        if (layer) layer.selectAll("svg").remove();

        layer = d3.select(this.getPanes().overlayLayer)
            .append("div")
            .attr("class", "SvgOverlay");

        svgMoves = layer.append("svg");
        svgPlaces = layer.append("svg");


        overlay.draw = function() {

            overlayProjection = this.getProjection();

            render();
        };

    };

    overlay.setMap(map);
}

function updateDateFilters() {

    activeModes = [];
    activeDays = [];

    places = getPlaces(data);
    moves = getMoves(data);
    filteredMoves = moves;

    //center map on the last place visited;
    centerLocation.lat = places[places.length-1].place.location.lat;
    centerLocation.lon = places[places.length-1].place.location.lon;

    map.setCenter(new google.maps.LatLng(centerLocation.lat, centerLocation.lon));

    //update active modes of transportation
    activeModes = d3.nest()
        .key(function(d) { return d.activity; })
        .sortKeys(d3.descending)
        .rollup(function(d) {
            return {
                totalDistance:d3.sum(d,function(g) { return g.distance; }),
                totalDuration:d3.sum(d,function(g) { return g.duration; }),
                count:d.length
            };
        })
        .entries(filteredMoves);

    //update active days
    activeDays = d3.nest()
        .key(function(d) { return d.date; })
        .sortKeys(d3.ascending)
        .rollup(function(d) {

            //list of activities
            var modeType = [];

            //loop through current month's activities
            for (var i=0; i<activeModes.length; i++) {
                var modeName = activeModes[i].key;

                //new acitivity in each day
                var mode = {};
                mode.name = modeName;

                //sum of distances
                mode.distance = d3.sum(d,function(g) { 
                    if (g.activity == modeName) {
                        return g.distance;
                    }
                });

                //sum of durations
                mode.duration = d3.sum(d,function(g) { 
                    if (g.activity == modeName) {
                        return g.duration;
                    }
                });

                //if there is activity in this day, save it.
                if (mode.distance > 0 || mode.duration > 0) modeType.push(mode);
            }

            return modeType;
         })
         .entries(filteredMoves);

    updateBarModeOption();

    //update mode filter
    updateModeFilters();
}

function updateModeFilters() {
    filteredMoves = filterByMode(moves);
    updateInfoVis();
    updateListDays();
}

function render() {

    // Turn the overlay projection into a d3 projection
    var googleMapProjection = function(coordinates) {
        var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
        var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
        return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
    }

    pathToProjection = d3.geo.path().projection(googleMapProjection);

    //movements
    moveElements = svgMoves.selectAll("path")
        .data(filteredMoves);

    if (renderPhase == 0) {
        moveElements.enter().append("svg:path")
        .attr("d", pathToProjection); // update existing paths
    } else {
        moveElements.attr("d", pathToProjection) // update existing paths
        .enter().append("svg:path");
    }

    moveElements.attr("class","moves");

    moveElements.exit().remove();

    moveElements.attr("stroke", "#333333")
        .attr("stroke-width",2);
    
    if (encode == "transportation") moveElements.attr("stroke",function(d) { return getColorByAtivity(d.activity);})
    if (encode == "duration (color)") moveElements.attr("stroke",function(d) { return getColorByDuration(d.duration);})
    if (encode == "duration (thickness)") moveElements.attr("stroke-width",function(d) { return getStrokeWidthByDuration(d.duration);})
    //.enter().append("svg:path");
    

   
    //places
    var placeElements = svgPlaces.selectAll("path")
        .data(places);

    if (renderPhase == 0) {
        placeElements.enter().append("svg:path")
        .attr("d", pathToProjection); // update existing paths
    } else {
        placeElements.attr("d", pathToProjection) // update existing paths
        .enter().append("svg:path");
    }

    placeElements.attr("class","place");

    placeElements.exit().remove();


    //change phase
    if (renderPhase == 0) renderPhase++;
}

function filterByMode(features) {

     var featuresArray = [];

     if (filterMode == "all") {

        return features;

     } else {

        for (var i = 0; i < features.length; i++) {

            var feature = features[i];
            var currentActivity = feature.activity;
            
            if (currentActivity == filterMode) {
                featuresArray.push(features[i]);
            }
            
        }

        return featuresArray;

     }
}

function getColorByAtivity(activity) {

    var color;

    switch(activity) {

        case "walking":
            color = "#bd0026"; //dark red
            break;

        case "running":
            color = "#e6550d"; //orange
            break;

        case "cycling":
            color = "#fd8d3c"; //orange
            break;

        case "underground":
            color = "#a6bddb"; //light blue
            break;

        case "bus":
            color = "#6baed6"; // blue
            break;

        case "funicular":
            color = "#9ecae1"; // pale blue
            break;

        case "car":
            color = "#6a51a3";  // dark purple
            break;

        case "train":
            color = "#bcbddc";  // purple
            break;

        case "airplane":
            color = "#9e9ac8"; //light purple
            break;

        case "ferry":
            color = "#756bb1";  //pale purple
            break;

        case "transport":
            color = "#54278f";  //dark blue
            break;

        default:
            color = "black";
            break;

    }


    // switch(activity) {

    //     case "walking":
    //         color = "#d9534f"; //red
    //         break;

    //     case "running":
    //         color = "#f0ad4e"; //orange
    //         break;

    //     case "cycling":
    //         color = "#f0ad4e"; //orange
    //         break;

    //     case "transport":
    //         color = "#428bca";  //dark blue
    //         break;

    //     case "underground":
    //         color = "#5bc0de"; //light blue
    //         break;

    //     case "bus":
    //         color = "#386cb0"; // blue
    //         break;

    //     case "airplane":
    //         color = "#5cb85c"; //green
    //         break;

    //     default:
    //         color = "black";
    //         break;

    // }

    return color;
}

function getPlaces(data) {

    var placesArray = [];

    for (var i = 0; i < data.length; i++) {
        var day = data[i];

        if(day.segments !== null) {

            for (var j = 0; j < day.segments.length; j++) {
                var segment = day.segments[j];

                if (segment.type == "place") {

                    var place = {};

                    place.date = day.date;
                    place.type = "Feature";

                    place.startTime = segment.startTime;
                    place.endTime = segment.endTime;
                    place.place = segment.place;

                    place.geometry = {};
                    var geometry = place.geometry;
                    geometry.type = "Point";
                    geometry.coordinates = [segment.place.location.lon,segment.place.location.lat];

                    placesArray.push(place);

                }

            }
        }
    }

    return placesArray;
}

function getMoves(data) {

    //reset max and min duration
    minDuration = 99999999999999;
    maxDuration = 0;

    var moveArray = [];

    //day
    for (var i = 0; i < data.length; i++) {
        var day = data[i];
        var movesActivity = 0;

        if(day.segments !== null) {

            

            //segment
            for (var j = 0; j < day.segments.length; j++) {
                var segment = day.segments[j];


                if (segment.type == "move") {

                    var activities = segment.activities;

                    var activity = {};

                    //activities
                    for (var k = 0; k < activities.length; k++) {

                        activity = {};

                        //activity = activities[k];
                        activity.date = day.date;
                        activity.activity = activities[k].activity;
                        activity.group = activities[k].group;
                        activity.manual = activities[k].manual;
                        activity.startTime = activities[k].startTime;
                        activity.endTime = activities[k].endTime;
                        activity.duration = activities[k].duration;
                        activity.distance = activities[k].distance;
                        activity.steps = activities[k].steps;
                        activity.calories = activities[k].calories;
                        activity.type = "Feature";

                        activity.geometry = {};
                        var geometry = activity.geometry;
                        geometry.type = "MultiLineString";
                        geometry.coordinates = [];
                        geometry.coordinates[0] = [];

                        var geoCodeArray = geometry.coordinates[0];

                        var trackPoints = activities[k].trackPoints;
                        for (var l = 0; l < trackPoints.length; l++) {
                            var geoCode = [trackPoints[l].lon,trackPoints[l].lat,trackPoints[l].time];
                            geoCodeArray.push(geoCode);
                        }
                           

                        var movDur = activity.duration;
                        if(minDuration > movDur) minDuration = movDur;
                        if(maxDuration < movDur) maxDuration = movDur;

                        moveArray.push(activity);

                        movesActivity++;
                    }

                }
            }

        }

        //if there is no movement activity in this day
        //addd as with zero activity
        if(movesActivity == 0) {

            var activity = {};

            activity.date = day.date;
            activity.duration = 0;
            activity.distance = 0;
            activity.steps = 0;
            activity.calories = 0;

            moveArray.push(activity);

        }

    }

    return moveArray;
}

function getColorByDuration(duration) {

    var color;

    var durMapped = map_range(duration, minDuration, maxDuration, 1, 10)

    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    switch(Math.round(durMapped)) {

        case 1:
            color = "#008a56";
            break;

        case 2:
            color = "#00ac6c";
            break;

        case 3:
            color = "#68c184";
            break;

        case 4:
            color = "#acd58a";
            break;

        case 5:
            color = "#dce9a4";
            break;

        case 6:
            color = "#ffdfa0";
            break;

        case 7:
            color = "#fbb87d";
            break;

        case 8:
            color = "#ed8863";
            break;

        case 9:
            color = "#d3584a";
            break;

        case 10:
            color = "#af294d";
            break;

        default:
            color = "black";
            break;

    }

    return color;
}

function getStrokeWidthByDuration(duration) {

    var durMapped = map_range(duration, minDuration, maxDuration, 1, 10)

    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    var sWidth = Math.round(durMapped);

    return sWidth;
}

function highlightRoute(filter) {

    moveElements.each(function(d) {

        var route = d3.select(this);

        switch (filter.type) {

            case "date":

                if (filter.value == d.date) {
                    if (encode == "none") route.attr("stroke","#d9534f");
                    route.attr("stroke-opacity",1)
                    route.moveToFront();
                } else {
                    //if (encode == "none") 
                    route.attr("stroke","#333");
                    route.attr("stroke-opacity",.1)
                };
                
                break;

            case "mode":

                if (filter.value == d.activity) {
                    if (encode == "none") route.attr("stroke","#d9534f");
                    route.attr("stroke-opacity",1)
                    route.moveToFront();
                } else {
                    //if (encode == "none")
                    route.attr("stroke","#333");
                    route.attr("stroke-opacity",.1)
                };
                
                break;

            default:
                route.attr("stroke", "#333333")
                route.attr("stroke-opacity",1);
                
                if (encode == "transportation") route.attr("stroke",function(d) { return getColorByAtivity(d.activity);})
                if (encode == "duration (color)") route.attr("stroke",function(d) { return getColorByDuration(d.duration);})
                if (encode == "duration (thickness)") route.attr("stroke-width",function(d) { return getStrokeWidthByDuration(d.duration);})
               
                break;

        }

    });

    
}









