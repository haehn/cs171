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
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
ChartVis = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.order = "popDesc";

    this.year = "1800";
    this.display = "counties";
	this.railroads = true;

    // defines constants
    this.margin = {top: 80, right: 20, bottom: 55, left: 10},
    this.width = 200;//getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 900;//400 - this.margin.top - this.margin.bottom;

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
        //.attr("style", "border: 2px solid black")
        .append("g");
        //.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

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


    // creates axis and scales
    this.x = d3.scale.linear()
      .range([this.margin.left, this.width-this.margin.right]);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([this.margin.top, this.height], .1);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .ticks(6)
      .tickSize(1)
      .orient("bottom");
/*
    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");*/

    this.svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", 40)
        .attr("y", 30);

    this.svg.append("g")
        .attr("class", "bars");

    // Add axes visual elements
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height-this.margin.bottom) + ")");




//    console.log("init");
    // filter, aggregate, modify data
   // console.log(this.data);
    this.wrangleData(this.year, this.display);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
ChartVis.prototype.wrangleData= function(year, display){
  //  console.log("wrangle");
    // displayData should hold the data whiche is visualized
    var that = this;
    that.displayData = that.filterAndAggregate(year, display);
    //console.log(that.displayData); 
    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ChartVis.prototype.updateVis = function(){
    //console.log("update");
//console.log(this.displayData);
    var that = this;
    var svg = that.parentElement.select("svg").select("g");
    
    // updates scales
    that.x.domain(d3.extent(that.displayData, function(d) { return parseInt(d.Population); }));
    that.y.domain(that.displayData.map(function(d) { return d.Name; }));
    that.color.domain(that.displayData.map(function(d) { return d.Name }));

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");
    //console.log(that.displayData);

    this.svg.select(".chartTitle")
        .text("Largest " + that.display);

    var bars = svg.select(".bars").selectAll("rect")
        .data(that.displayData);

    bars.enter()
       .append("rect")
       .append("title");
    var median_location = Math.round(that.displayData.length/2);
    var bars_count = 0; 
    var bars_pop = 0;
    var bar_max = 0;
    var bar_min = 0;
    var median = 0;
    bars.sort(function(a,b)
        { //console.log(a); 
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
        {//   console.log(d.Name, i);
            return (i *10 +50);
        })
        .attr("height", 8)
        .attr("width", function(d,i)
        { 
            if(i == median_location)
                median = d.Population;
            if(d.Population > bar_max)
                bar_max = d.Population;
          //console.log(d.Population);
          bars_count++;
          bars_pop = bars_pop +  d.Population;
            return that.x(d.Population);
        })
       .attr("class", function(d,i)
       { //console.log(d,i);
           return "bargroup"+ (((i%2))*4);
       });

      // console.log(bar_max, median, (bars_pop/bars_count));

    var titles = bars.select("title")
        .text(function(d){/*console.log(d);*/return d.Name + ", " + d.State + ", " + d.Population;});


    var names = svg.select(".bars").selectAll("text")
        .data(that.displayData);

    names.enter()
       .append("text");
      
       
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
      .text(function(d) { 
          return d.Name + ", " + d.StateCode; })
      .attr("class", "type-label")
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return that.doesLabelFit(d) ? "end" : "start"; })
      .attr("fill", function(d, i) { 
          //console.log(i);
          if(i%2 == 0)
              return "black";
          return that.doesLabelFit(d) ? "white" : "black"; 
      });

     names.exit().remove();

/*
var bars = svg.select(".bars").selectAll("rect")
        .data(that.displayData);

    bars.enter()
       .append("rect")
      
       
    bars.sort(function(a,b)
        {   
             return d3.descending(parseInt(a.Population), parseInt(b.Population));
        })
        .attr("x", 0)
        .attr("y", function(d,i)
        {
            return (i *10 +10);
        })
        .attr("height", 8)
        .attr("width", function(d)
        {
            return that.x(d.Population);
        })
       .attr("class", function(d,i)
       { //console.log(d,i);
           return "bargroup"+ (((i%2))*4);
       }); 

*/

/*
    bar_enter.append("rect");
    bar_enter.append("text");
    bar_enter.append("title");
*/
    bars.exit().remove();
/*
    bar_group.selectAll("rect")
         //.attr("class", function(d, i){ console.log(d,i);return "color" + (((i%2))*4)})
         .attr("x", 0)
         .attr("y", 0)
         .attr("height",8)// this.y.rangeBand())
        // .attr("fill", function(d,i) {
          //   return that.color(d.Name);
          //})
         .transition()
         .attr("width", function(d, i) {
      //      return 10;
      console.log(d.City, d.Population);
              return 10;//that.x(d.Population);
         })
         
         bar_group.selectAll("title")
         .text(function(d, i)
         {//console.log("title");
             return d.City + ", Population: " + d.Population;
         });
*/


/*
 *  Below is the original bar work.  I'm rewriting this.
 */
    // updates graph
/*
    // Data join
    var bar = this.svg.selectAll(".bar")
      .data(this.displayData);

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");
    bar_enter.append("text");

    // Add click interactivity
    //bar_enter.on("click", function(d) {
    //   $(that.eventHandler).trigger("selectionChanged", d.Name);
    //})

    // Add attributes (position) to all bars
    bar
      .attr("class", "bar")
      .transition()
//      .attr("transform", function(d, i) { return "translate(0," + (i*10 + 10) + ")"; })

    this.svg.selectAll(".bar")
        .sort(function(a,b)
        {   
             return d3.descending(parseInt(a.Population), parseInt(b.Population));
        })
        .attr("transform", function(d,i)
        {
            return "translate(0, " + (i *10 +10) + ")";
        });

    // Remove the extra bars
    bar.exit()
      .remove();

    this.svg.selectAll(".bar").select("rect")
       .attr("class", function(d, i){ return "color" + (((i%2))*4)})
       .append("title")
      .text(function(d)
      {
          return "Population: " + d.Population;
      });;;

    // Update all inner rects and texts (both update and enter sets)

    bar.selectAll("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height",10)// this.y.rangeBand())
      .attr("fill", function(d,i) {
        return that.color(d.Name);
      })
      .transition()
      .attr("width", function(d, i) {
      //      return 10;
          return that.x(d.Population);
      })
      

    bar.selectAll("text")
      .transition()
      .attr("x", function(d) { return that.x(d.Population) + (that.doesLabelFit(d) ? -3 : 5); })
      .attr("y", function(d,i) { return that.y.rangeBand() / 2 + 3; })
      .text(function(d) { 
          return d.Name + ", " + d.StateCode; })
      .attr("class", "type-label")
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return that.doesLabelFit(d) ? "end" : "start"; })
      .attr("fill", function(d, i) { 
          console.log(i);
          if(i%2 == 0)
              return "black";
          return that.doesLabelFit(d) ? "white" : "black"; 
      });
*/
}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
/*ChartVis.prototype.onSelectionChange = function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    this.updateVis();
}*/

ChartVis.prototype.onSelectionChange= function (encoding, tracks, year){
        var that = this;
        this.year = year;
	this.display = encoding;
	this.railroads = tracks;
        that.wrangleData(year, encoding);
	this.updateVis();

/*
    console.log(encoding);
	    console.log(tracks);       
		    console.log(year);
*/
			    // TODO: call wrangle function

				    // do nothing -- no update when brushing


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
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
ChartVis.prototype.filterAndAggregate = function(year, display){
    //console.log("filter");
    var that = this;
    var arrayLen = that.data[display].length;
   // console.log(arrayLen);
    //console.log(year, display);
   //console.log(that.data);
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

    //console.log(sortedData);

    var finalData = [];
    var filteredLen = filteredData.length;
    var chartLen = filteredLen < 79 ? filteredLen : 79;
  //  console.log(chartLen);
    for(var i = 0; i < chartLen;i++)
    {
        finalData.push(sortedData[i]);
    }

//console.log(finalData);
/*
    for(state in that.data)
    {
        //console.log(state);
        if(display in that.data[state])
        {
            for(area in that.data[state][display])
            {
                //console.log(area);
                if(year in that.data[state][display][area])
                {
                    filteredData.push(that.data[state][display][area][year][0]);
                }
            }
        }
    }*/

    return finalData;
/*
    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;


    var counts = Object();

    // Convert data into summary count format
    this.data
      .filter(filter)
      .forEach(function(d) {
        d.calls.forEach(function(c) {
          c.type in counts ? counts[c.type]++ : counts[c.type] = 1;
        });
      });

    // Convert counts to an array and keep only the top 10
    counts = Object.keys(counts)
      .map(function (key) {return {"type": key, "count": counts[key]}; })
      .sort(function(a, b) { return a.count < b.count || (a.count === b.count) - 1; })
      .slice(0, 20);

    return counts;*/
}

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
 

