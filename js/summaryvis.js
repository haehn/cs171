/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * SummaryVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
SummaryVis = function(_parentElement, _data, _states,  _event){
    this.parentElement = _parentElement;
    this.data = _data;
    this.states = _states;
    this.displayData = [];
    this.eventHandler = _event;
    this.year = [];
    this.year.start = 0;
    this.year.end = 0;
    this.year.current = 0;
    this.displaylocations = [];
    
    // TODO: define all constants here
    this.width = 900;
    this.height = 200;
    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
SummaryVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: 2px solid black")
        this.svg.append("g").attr("class", "populations");
        this.svg.append("g").attr("class", "tracks");
        this.svg.append("g").attr("class", "area");
        //.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.displaylocations.tracks = (this.height/4)*1;
    this.displaylocations.area = (this.height/4)*2
    this.displaylocations.population = (this.height/4)*3;
    this.displaylocations.states = (this.height/4)*4;

    //Find the range of years

    for(d in that.data)
    {
        if(that.year.start == 0)
            that.year.start = d;
        else if(that.year.start > d)
            that.year.start = d;

        if(that.year.end == 0)
            that.year.end = d;
        else if(that.year.end < d)
            that.year.end = d;
    }

    that.year.current = 1900; //that.year.start;

    // creates axis and scales
    // Land Area
    this.landX = d3.scale.linear()
      .range([0, this.width])  // ouput
      .domain([0, that.data[that.year.end][0]["Area"]]);
    // Population
    this.populationX = d3.scale.linear()
      .range([0, this.width])  // ouput
      .domain([0, that.data[that.year.end][0]["Population"]]);

    // Number of states
    this.statesX = d3.scale.linear()
      .range([0, this.width])  // ouput
      .domain([0, that.data[that.year.end][0]["States"]]);

    // Miles of railroad tracks
    this.tracksX = d3.scale.linear()
      .range([0, this.width])  // ouput
      .domain([0, that.data[that.year.end][0]["Tracks"]]);





    // filter, aggregate, modify data
    this.wrangleData(that.year.current);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
SummaryVis.prototype.wrangleData= function(year){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(year);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
SummaryVis.prototype.updateVis = function(){

    var that = this;
    console.log(this.displayData);
    // Create train line
/*
    var tracks       = this.svg.selectAll("line")
                          .data(that.displayData["Tracks"])
                          .enter()
                          .append("line")
                          .attr("y1", that.displaylocations.tracks)
                          .attr("y2", that.displaylocations.tracks)
                          .attr("x1", function(d){return that.tracksX(d.start)})
                          .attr("x2", function(d){return that.tracksX(d.end)})
                          //.attr("stroke", "black")
                          .attr("stroke-width", 2)
                          .attr("class", function(d, i){;return "color" + i;});

*/
    var tracks       = this.svg.select(".tracks").selectAll("rect")
                          .data(that.displayData["Tracks"])
                          .enter()
                          .append("rect")
                          .attr("y", that.displaylocations.tracks)
                          .attr("x", function(d){return that.tracksX(d.start)})
                          .attr("width", function(d){return that.tracksX(d.end) - that.tracksX(d.start)})
                          //.attr("stroke", "black")
                          .attr("height", 6)
                          .attr("style", "outline: solid black 1px")
                          .attr("class", function(d, i){;return "color" + i;});

    var area       = this.svg.select(".area").selectAll("rect")
                          .data(that.displayData["Areas"])
                          .enter()
                          .append("rect")
                          .attr("y", that.displaylocations.area)
                          .attr("x", function(d){return that.landX(d.start)})
                          .attr("width", function(d){return that.landX(d.end-d.start)})
                          //.attr("stroke", "black")
                          .attr("height", 10)
                          .attr("style", "outline: solid black 1px")
                          .attr("class", function(d, i){;return "color" + i;});
    
    
    for(e in that.data["Population"])
    {
        for(var i = 1; i < that.displayData["Population"][e]
        this.svg.select(".populations").append("circle");
    }


    var populations = this.svg.select(".populations").selectAll("circle")
                          .data(that.displayData["Population"])
                          .enter()
                          .append("circle")
                          .attr("y", that.displaylocations.population)
                          .attr("x", function(d){console.log(d);return that.landX(d.start)})
                          .attr("width", function(d){return that.landX(d.end-d.start)})
                          //.attr("stroke", "black")
                          .attr("height", 10)
                          .attr("style", "outline: solid black 1px")
                          .attr("class", function(d, i){;return "color" + i;});




}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
SummaryVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    this.updateVis();

    


}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
SummaryVis.prototype.filterAndAggregate = function(year){
console.log(this.data);
    var that = this;
    var localdata = [];

    localdata["States"] = that.states.filter(function(d)
    {  
        if(d.Year < year)
            return true;
    });
    var tracks = [];
    var populations = [];
    var areas = [];
    for(d in that.data)
    {
        if(d <= year)
        {
            var trk = [];
            var pop = [];
            var ar = [];
            ar["Year"] = parseInt(d);
            pop["Year"] = parseInt(d);
            trk["Year"] = parseInt(d);
            if(that.data[d][0]["Tracks"] == "0")
            {
               trk["start"] = 0;
               trk["end"] = 0;
            }
            else
            {
                trk["start"] = that.data[d-10][0]["Tracks"];
                trk["end"] = that.data[d][0]["Tracks"];
            }
            
            if(d == 1800)
            {
                ar["start"] = 0;
                ar["end"] = that.data[d][0]["Area"];

                pop["start"] = 0;
                pop["end"] = that.data[d][0]["Population"];
            }
            else
            {
                ar["start"] = that.data[d-10][0]["Area"];
                ar["end"] = that.data[d][0]["Area"];

                pop["start"] = that.data[d-10][0]["Population"];
                pop["end"] = that.data[d][0]["Population"];
            }
            populations.push(pop);
            tracks.push(trk);
            areas.push(ar);
        }
    }
    localdata["Areas"] = areas;
    localdata["Population"] = populations;
    localdata["Tracks"] = tracks;
/*
    var areas = [];

    for(var i = 1800; i <= year;i=i+10)
    {
        areas[i] = 0;
    }

    for(var i = 0; i < localdata["States"].length;i++)
    { 
        if(localdata["States"][i]["Year"] <= year)
        {
            for(var j = 1800;j <= year;j=j+10)
            {
                if(localdata["States"][i]["Year"] < j)
                    areas[j] = areas[j] + localdata["States"][i]["Area"];
            }
        }
    }

    localdata["Areas"] = areas;*/
    return localdata;

}



