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
    this.year = 1860;

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
        .append("g")
        //.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.landX = d3.scale.linear()
      .range([0, this.width]);

    this.populationX = d3.scale.linear()
      .range([0, this.width]);

    this.statesX = d3.scale.linear()
      .range([0, this.width]);

    this.tracksX = d3.scale.linear()
      .range([0, this.width]);




    // filter, aggregate, modify data
    this.wrangleData(that.year);

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

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs


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

    var that = this;
    var localdata = [];

    localdata["States"] = that.states.filter(function(d)
    {
        if(d.Year < year)
            return true;
    });
    var tracks = [];


    for(d in that.data)
    {
        if(d <= year)
        {
            //console.log(that.data[d]);
            var tmp = [];
            tmp["Year"] = parseInt(d);
            if(that.data[d][0]["Tracks"] == "0")
            {
               tmp["start"] = 0;
               tmp["end"] = 0;
            }
            else
            {
                tmp["start"] = that.data[d-10][0]["Tracks"];
                tmp["end"] = that.data[d][0]["Tracks"];
            }
            tracks.push(tmp);
        }
    }
    localdata["Tracks"] = tracks;
    console.log(localdata); 

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    /*var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }*/
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;

    // create an array of values for age 0-100
    var res = d3.range(100).map(function () {
        return 0;
    });


    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values



    return res;

}



