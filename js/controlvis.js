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
 * ControlVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
ControlVis = function(_parentElement, _data, _event){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _event;
    this.displayData = [];
    this.height = 300;
	this.width = 200;


    // TODO: define all constants here


    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
ControlVis.prototype.initVis = function(){

    var that = this; // read about the this


/*
           <form class="displaySelection">
						                 <input type="radio" name="encoding" value="cities">  Population by City</input><br>
										                <input type="radio" name="encoding" value="counties">  Population by County</input><br>
														               <input type="checkbox" name="railroads" value="railroads">Railroad Expansion</input><br>
																	                  Years:<br>
																					                 <input type="range" name="yearSelector" min="1800" max="1900" step="10" id="slider" value="1800"></input> 
																									                <div style="float-left;display:inline-block;width:133px">1800</div><div style="float-right;display:inline-block;width:32px">1900</div> 

																													           </form>
																															    

*/

    this.displayForm = this.parentElement.select(".displaySelection");
	that.displayForm.append("text")
	   .text("Display: ");

    this.displayForm.append("br");

    this.displayForm.append("input")
	    .attr("type", "radio")
		.attr("name", "encoding")
		.attr("value", "counties")
		.attr("id", "counties")
        .on("click", function() {
		    that.updateView();
		})

	this.displayForm.append("text").text("  Population by County");
    document.getElementById('counties').checked = true;

    this.displayForm.append("br");
    this.displayForm.append("input")
	    .attr("type", "radio")
		.attr("name", "encoding")
		.attr("value", "cities")
        .on("click", function() {
		    that.updateView();
		})

    this.displayForm.append("text").text("  Population by City");
    this.displayForm.append("br");

    this.displayForm.append("input")
	    .attr("type", "checkbox")
		.attr("name", "railroads")
		.attr("value", "railroads")
		.attr("id", "railroads")
        .on("click", function() {
		    that.updateView();
		});

	document.getElementById('railroads').checked = true;

    this.displayForm.append("text").text("  Railroad Expansion");
    this.displayForm.append("br");
    this.displayForm.append("text").text("Years:");
    this.displayForm.append("br");

    this.displayForm.append("input")
	    .attr("type", "range")
		.attr("name", "yearSelector")
		.attr("min", "1800")
		.attr("max", "1900")
		.attr("step", "10")
		.attr("value", "1800")
		.on("click", function() {
		    that.updateView();
		})
		.text("Population by City");

    this.displayForm.append("div")
	    .attr("style", "float-left;display:inline-block;width:133px")
		.text("1800");

    this.displayForm.append("div")
	    .attr("style", "float-right;display:inline-block;width:32px")
		.text("1900");






    //TODO: construct or select SVG
    //TODO: create axis and scales

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateView();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
ControlVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ControlVis.prototype.updateVis = function(){

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
ControlVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

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

ControlVis.prototype.updateView = function() {


    var that = this;
    // We are going to create an array of settings to make set up the display.
	var settings = [];

    settings.push($("input[name=encoding]:checked").val());
    settings.push($("input[name=railroads]").prop("checked"));
    settings.push($("input[name=yearSelector]").val());

	//console.log(settings);

	$(that.eventHandler).trigger("selectionChanged", settings);

/*    if(document.getElementbyID('counties').)
	    console.log("counties")
	else
	    console.log("cities");
i*/
//console.log(document.getElementsbyName('encoding'));

}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
ControlVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
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



