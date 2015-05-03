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
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _eventHandler -- the Eventhandling Object for communication between classes
 * @constructor
 */
ChartVis = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];     // The array to store all elements that are going to be displayed on the screen
    this.order = "popDesc";    // The current sorting of the chart elements
    this.year = "1800";        // The year we are displaying
    this.display = "counties"; // Displaying cities or counties?
	this.railroads = true;     // Are we viewing railroad lines?

    // Defines sizing constants
    this.margin = {top: 80, right: 20, bottom: 55, left: 10};
    this.width = 200;
    this.height = 900;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
ChartVis.prototype.initVis = function(){
    var that = this;
    
	// constructs SVG layout
    this.svg = this.parentElement.select(".chart-svg")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g");

    this.displayForm = this.parentElement.select(".displaySelection");

    this.displayForm.append("button")
        .attr("type", "button")
        .attr("class", "btn btn-sm btn-primary")
        .on("click", function(){
            that.displayChange("pop");
        })
        .text("Population");

    this.displayForm.append("span")
        .text("                          ");;

    this.displayForm.append("button")
        .attr("type", "button")
        .attr("class", "btn btn-sm btn-primary")
        .on("click", function(){
            that.displayChange("state");
        })
        .text("State");
    
	this.displayForm.append("span")
        .text("                          ");;

    this.displayForm.append("button")
        .attr("type", "button")
        .attr("class", "btn btn-sm btn-primary")
        .on("click", function(){
            that.displayChange("county");
        })
        .text("County");


    // creates x-axis and scale
    this.x = d3.scale.linear()
      .range([this.margin.left, this.width-this.margin.right]);
 
    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .ticks(6)
      .tickSize(1)
      .orient("bottom");

    this.svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", 40)
        .attr("y", 30);

    this.svg.append("g")
        .attr("class", "bars");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height-this.margin.bottom) + ")");

    // we need to filter ou the data based on the year and display choice
    this.wrangleData(this.year, this.display);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
ChartVis.prototype.wrangleData= function(year, display)
{
    var that = this;
    that.displayData = that.filterAndAggregate(year, display);
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ChartVis.prototype.updateVis = function()
{
    var that = this;
    var svg = that.parentElement.select("svg").select("g");
    
    // updates x-scale
    that.x.domain(d3.extent(that.displayData, function(d) { return parseInt(d.Population); }));

    // updates x-axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");

    // update the chart title based on whether we're interested in cities or counties
    this.svg.select(".chartTitle")
        .text("Largest " + that.display);

    var bars = svg.select(".bars").selectAll("rect")
        .data(that.displayData);

    bars.enter()
       .append("rect")
       .append("title");

    // sort the bars in the chart based on our display choices
    bars.sort(function(a,b)
        { 
             if(that.order == "popDesc")
                 return d3.descending(parseInt(a.Population), parseInt(b.Population));
             else if(that.order == "popAsc")
                 return d3.ascending(parseInt(a.Population), parseInt(b.Population));
             else if(that.order == "stateAsc")
             {
                 if(a.State == b.State)
                     return d3.ascending(a.County, b.County);
                 return d3.ascending(a.State, b.State);
             }
             else if(that.order == "stateDesc")
             {
                 if(a.State == b.State)
                     return d3.descending(a.County, b.County);
                 return d3.descending(a.State, b.State);
             }
             else if(that.order == "countyAsc")
             {
                 if(a.County == b.County)   
                     return d3.ascending(a.State, b.State);
                 return d3.ascending(a.County, b.County);
             }
             else if(that.order == "countyDesc")
             {
                 if(a.County == b.County)
                     return d3.descending(a.State, b.State);
                 return d3.descending(a.County, b.County);
             }
        })
        .attr("x", 0)
        .attr("y", function(d,i)
        {
            return (i *10 +50);
        })
        .attr("height", 8)
        .attr("width", function(d,i)
        { 
            return that.x(d.Population);
        })
       .attr("class", function(d,i)
       { 
           return "bargroup"+ (((i%2))*4);
       });

       // hovering lets a user see the actual population
       var titles = bars.select("title")
           .text(function(d){return d.Name + ", " + d.State + ", " + d.Population;});


       var names = svg.select(".bars").selectAll("text")
           .data(that.displayData);

       names.enter()
            .append("text");
      
       // the names need to be sorted to match the correct bars
       names.sort(function(a,b)
       {   
            if(that.order == "popDesc")
                 return d3.descending(parseInt(a.Population), parseInt(b.Population));
             else if(that.order == "popAsc")
                 return d3.ascending(parseInt(a.Population), parseInt(b.Population));
             else if(that.order == "stateAsc")
             {
                 if(a.State == b.State)
                     return d3.ascending(a.County, b.County);
                 return d3.ascending(a.State, b.State);
             }
             else if(that.order == "stateDesc")
             {
                 if(a.State == b.State)
                     return d3.descending(a.County, b.County);
                 return d3.descending(a.State, b.State);
             }
             else if(that.order == "countyAsc")
             {   
                 if(a.County == b.County)
                     return d3.ascending(a.State, b.State);

                 return d3.ascending(a.County, b.County);
             }
             else if(that.order == "countyDesc")
             {
                 if(a.County == b.County)
                     return d3.descending(a.State,b.State);
                 return d3.descending(a.County, b.County);
             }
        })
        .attr("x", function(d) { return that.x(d.Population) + (that.doesLabelFit(d) ? -3 : 5); })
        .attr("y", function(d,i) { return (i*10+53) })
        .text(function(d) { return d.Name + ", " + d.StateCode; })
        .attr("class", "type-label")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return that.doesLabelFit(d) ? "end" : "start"; })
        .attr("fill", function(d, i) { 
          if(i%2 == 0)
              return "black";
          return that.doesLabelFit(d) ? "white" : "black"; 
        });

        // remove excess objects if we go back in time
        bars.exit().remove();
        names.exit().remove();
}


/**
 * Gets called by event handler and should create new aggregated data
 * @param encoding -- cities vs counties
 * @param tracks   -- are we viewing railroad tracks?
 * @param year     -- year we are updating to
 */
ChartVis.prototype.onSelectionChange= function (encoding, tracks, year){
    var that = this;
    this.year = year;
	this.display = encoding;
	this.railroads = tracks;
    that.wrangleData(year, encoding);
	this.updateVis();
}


/**
 * Helper function that figures if there is sufficient space
 * to fit a label inside its bar in a bar chart
 */
ChartVis.prototype.doesLabelFit = function(datum) {
    var pixel_per_character = 5.1;  // obviously a (rough) approximation
    return (datum.Name.length + datum.StateCode.length + 2) * pixel_per_character < this.x(datum.Population);
}

/**
 * The aggregate function that creates arrays to store the viewable data based on the year and display choice.
 * @param year -- the new year
 * @param display -- cities or counties?
 * @returns {Array|*}
 */
ChartVis.prototype.filterAndAggregate = function(year, display){
    var that = this;
    var arrayLen = that.data[display].length;
    var filteredData = [];
    
    for(var i = 0; i < arrayLen;i++)
    {
        if(that.data[display][i].Year == year)
            filteredData.push(that.data[display][i]);
    }

    var sortedData = filteredData.sort(function(a,b)
    {   
        return d3.descending(parseInt(a.Population), parseInt(b.Population));
    });

    var finalData = [];
    var filteredLen = filteredData.length;
    var chartLen = filteredLen < 79 ? filteredLen : 79;
    for(var i = 0; i < chartLen;i++)
    {
        finalData.push(sortedData[i]);
    }

    return finalData;
}

/**
 * This is a helper function to call when a sort button is clicked.  We have to determine
 * what the correct order is to chnage to.
 * @param order -- the new ordering
 **/
ChartVis.prototype.displayChange = function(order){
    var that = this;

    if(order == "pop")
    {
        if(that.order == "popAsc")
            that.order = "popDesc";
        else if(that.order == "popDesc")
            that.order = "popAsc";
        else
            that.order = "popDesc";
    }
    else if(order == "state")
    {
        if(that.order == "stateAsc")
            that.order = "stateDesc";
        else if(that.order == "stateDesc")
            that.order = "stateAsc";
        else
            that.order = "stateAsc";
    }
    else if(order == "county")
    {
        if(that.order == "countyAsc")
            that.order = "countyDesc";
        else if(that.order == "countyDesc")
            that.order = "countyAsc";
        else
            that.order = "countyAsc";
    }

    that.updateVis();
}
 

