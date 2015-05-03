/**
 * Created by Lauren Wood for Harvard CS171 Final Project.
  **/

/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * SummaryVis object 
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _states -- lists the states by date added to the union
 * @param _event -- event handler
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
    this.titles = [];
    this.existingCircles = 0;  // Number of population circles we have in the summary pane
    
    // define all constants here
    this.width = 950;
    this.height = 300;
    this.margin = {top: 0, right: 20, bottom: 0, left: 80};
    
	this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
SummaryVis.prototype.initVis = function(){

    var that = this; // read about the this

    this.displaylocations.tracks = 35;//(this.height/4)*0.25;
    this.displaylocations.area = 70;//(this.height/4)*.75;
    this.displaylocations.population = 105;//(this.height/4)*1.5;
    this.displaylocations.states = 230;//(this.height/4)*3.5;
    this.displaylocations.legend = 255;//this.height - 5;

    this.titles.tracks1 = "Miles of";
    this.titles.tracks2 = "Railroad";
    this.titles.tracks3 = "Tracks: ";
    this.titles.area = "Land Area: ";
    this.titles.population = "Population: ";
    this.titles.states = "States: ";
    this.titles.legend = "Legend: ";

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.svg.append("text")
        .attr("x", 100)
        .attr("y", 15)
        .attr("class", "summaryTitle")
        .text("Numbers by the Decade");
    
    this.svg.append("g").attr("class", "populationsSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.population+5)
        .text(this.titles.population);

    this.svg.append("g").attr("class", "tracksSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.tracks - 8)
        .text(this.titles.tracks1);
        
    this.svg.select(".tracksSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.tracks+7)
        .text(this.titles.tracks2);
        
	this.svg.select(".tracksSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.tracks + 20)
        .text(this.titles.tracks3);

    this.svg.append("g").attr("class", "areaSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.area+8)
        .text(this.titles.area);
      
    this.svg.append("g").attr("class", "statesSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.states-40)
        .text(this.titles.states);
       
    this.svg.append("g").attr("class", "legendSummary")
        .append("text")
        .attr("class", "summaryDesc")
        .attr("x", 0)
        .attr("y", that.displaylocations.legend - 2)
        .text(this.titles.legend);

    for(var i = 0; i < 11;i++)
    {
        var j = 1800 + (i*10);
            
	    this.svg.select(".legendSummary")
            .append("rect")
            .attr("class", "color" + i)
            .attr("x", function(){
                return that.margin.left + i*70;
            })
            .attr("y", that.displaylocations.legend-15)
            .attr("height", 15)
            .attr("width", 15);
      
        this.svg.select(".legendSummary")
            .append("text")
            .attr("class", "legend")
            .attr("x", function(){
                return that.margin.left + 20 + i*70;
            })
            .attr("y", that.displaylocations.legend - 2)
            .text(j);
    }

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

    that.year.current = that.year.start;

    // creates axis and scales
    // Land Area
    this.landX = d3.scale.linear()
        .range([this.margin.left, this.width - this.margin.right])  // ouput
        .domain([0, that.data[that.year.end][0]["Area"]]);
    // Population
    this.populationX = d3.scale.linear()
        .range([this.margin.left, this.width - this.margin.right])  // ouput
        .domain([0, Math.round(that.data[that.year.end][0]["Population"]/1000000)]);

    // Number of states
    this.statesX = d3.scale.ordinal()
        .range([this.margin.left, this.width - this.margin.right])  // ouput
        .domain([0, that.data[that.year.end][0]["States"]]);

    // Miles of railroad tracks
    this.tracksX = d3.scale.linear()
        .range([this.margin.left, this.width - this.margin.right])  // ouput
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
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
SummaryVis.prototype.updateVis = function(){

    var that = this;
    // Create train line

    var tracks = this.svg.select(".tracksSummary").selectAll("rect")
                     .data(that.displayData["Tracks"]);

    var trackTies = this.svg.select(".tracksSummary").selectAll("g")
                        .data(that.displayData["Tracks"]);

    tracks.enter()
        .append("rect")
        .append("title");
                          
    tracks.attr("y", that.displaylocations.tracks)
        .attr("x", function(d){return that.tracksX(d.start)})
        .attr("width", function(d){return that.tracksX(d.end) - that.tracksX(d.start)})
        .attr("height", 2)
        .attr("class", function(d, i){;return "color" + i;});

    tracks.exit().remove();

    trackTies.enter()
        .append("g")
        .attr("class", function(d){return "ties" + d.Year})

    var trackInterval = 20;
    var trackLocation = 0;
    var arrayLen = that.displayData["Tracks"].length;

    for(var i = 0; i < arrayLen;i++)
    {
        var trackStart = that.tracksX(that.displayData["Tracks"][i].start);
        var trackEnd = that.tracksX(that.displayData["Tracks"][i].end);
        if(i == 0)
            trackLocation = trackStart + trackInterval;

        while(trackLocation < trackEnd)
        {
            that.svg.select(".ties" + that.displayData["Tracks"][i].Year)
                .append("rect")
                .attr("x", trackLocation)
                .attr("y", that.displaylocations.tracks-6)
                .attr("width", 1)
                .attr("height", 14)
                .attr("class", function() { return "color" + i});
            trackLocation = trackLocation + trackInterval;
        }
    }
    trackTies.exit().remove();

    var tracktitles = tracks.select("title")
        .text(function(d){return d.Year + ", " + d.end + " Miles"});

    var area = this.svg.select(".areaSummary").selectAll("rect")
        .data(that.displayData["Areas"]);

    area.enter()
        .append("rect")
        .append("title");
                          
    area.attr("y", that.displaylocations.area)
        .attr("x", function(d){return that.landX(d.start)})
        .attr("width", function(d){return that.landX(d.end) - that.landX(d.start)})
        .attr("height", 10)
        .attr("style", "outline: solid black 1px")
        .attr("class", function(d, i){;return "color" + i;});

    area.exit().remove();

    var areatitles = area.select("title")
        .text(function(d) {return d.Year + ", " + d.end + " Square Miles";});
    
    
    // The number of circles we should have on the page
    var totalCircles = Math.round(that.displayData["Population"][(that.displayData["Population"].length) -1].end/1000000); 

    // We need to add circles if we don't have the right number
    if(that.existingCircles < totalCircles)
    {
        var arrLen = that.displayData.Population.length;
        for(var i = 0; i < arrLen;i++)
        {
            var decadeEndCircles = Math.round(that.displayData["Population"][i].end/1000000);
            var decadeTotalCircles = Math.round((that.displayData["Population"][i].end - that.displayData["Population"][i].start)/1000000);
            if(decadeEndCircles > that.existingCircles)
            {
                for(var j = 1; j <= decadeTotalCircles;j++)
                {
                    that.svg.select(".populationsSummary")
	                    .append("circle")
		                .attr("r", 5)
		                .attr("cx", that.populationX(that.existingCircles))
		                .attr("cy", that.displaylocations.population)
		                .attr("class", function() {;return "color" + i})
                        .attr("id", function(){return "summaryCircle" + that.existingCircles})
                        .append("title")
						.text(that.displayData["Population"][i]["Year"] + ": " + that.displayData["Population"][i]["end"]);
                   that.existingCircles++;

                }
	        }		
        }
    }
    // We need to remove circles
    else if(that.existingCircles > totalCircles)
    {
        for(var i = totalCircles;that.existingCircles > totalCircles;i++)
        {
            that.svg.selectAll("#summaryCircle" + i).remove();
            that.existingCircles--;
        }
    }


	var states = that.svg.select(".statesSummary").selectAll("text.state-name")
	    .data(that.displayData["States"]);

	states.enter()
	    .append("text")
        .attr("class", "state-name");

	states.sort(function(a,b){
        if(a.Year == b.Year)
			return d3.ascending(a.State, b.State);
        else
            return(d3.ascending(a.Year, b.Year));})
	    .attr("x", function(d,i){return (i *19)+65;})
		.attr("y", that.displaylocations.states)
		.text(function(d){/*console.log(d);*/return d.State + ", " + d.Year;})
		.style("text-anchor", "start")
		.attr("transform", function(d,i){ return "rotate(-65," +((i*19)+65)  + "," + that.displaylocations.states + ")";});;

       states.exit().remove();
}


/**
 * Gets called by event handler and should create new aggregated data
 * @param selection
 */
SummaryVis.prototype.onSelectionChange= function (encoding, tracks, year){
    this.year.current = year;
	this.wrangleData(year);
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
 * The aggregate function that updates what will be seen in the summary pane 
 * @param year - the year we're displaying 
 * @returns {Array|*}
 */
SummaryVis.prototype.filterAndAggregate = function(year){
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

    return localdata;
}
