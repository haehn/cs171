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
 * InfoVis object displays tidbits of information about the decade displayed
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _eventHandler -- handles the event changes
 * @constructor
 */
InfoVis = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.year = 1800;
    this.width = 175;
    this.height = 475;
	this.margin = {top: 0, right: 20, bottom: 0, left: 0};

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
InfoVis.prototype.initVis = function(){

    var that = this; // read about the this

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.svg.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("class", "info-heading");

    this.svg.append("text")
        .attr("x", 0)
        .attr("y", 45)
        .attr("class", "info-pane");

    // filter, aggregate, modify data based on year
    this.wrangleData(this.year);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
InfoVis.prototype.wrangleData= function(year){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(year);
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
InfoVis.prototype.updateVis = function(){

    var that = this;

    d3.select(".info-heading")
      .text("The Year " + that.displayData[0]);

    d3.select(".info-pane")
      .text(that.displayData[1])
	  .call(that.wrap, that.width-that.margin.left-that.margin.right);
}


/**
 * Gets called by event handler and should create new aggregated data
 * based on date.
 * @param encoding -- cities or counties
 * @param tracks -- are we displaying railroad tracks?
 * @param year -- year to display
 */
InfoVis.prototype.onSelectionChange= function (encoding, tracks, year){

    this.year = year;
    this.wrangleData(year);
    this.updateVis();
}



/**
 * The aggregate function that selects the text to display for the year
 * @param year -- the year to display
 * @returns {Array|*}
 */
InfoVis.prototype.filterAndAggregate = function(year){

    var that = this;
    var infoData = [year, that.data[year]["summary"][0]["info"]];

    return infoData;
}

/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */


/**
 *  This function was borrowed from Mike Bostock.  Original code can be found at http://bl.ocks.org/mbostock/7555321
 *  it takes the text string in that needs to be displayed and formats it to fit in the svg object as defined by
 *  width.
 *  @param text  -- the text to format
 *  @param width -- the width of the svg object
 **/
InfoVis.prototype.wrap = function(text,width)
{   
    text.each(function() 
	{
	    var text = d3.select(this),
		    words = text.text().split(/\s+/).reverse(),
		    word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			dy = 1,//parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			
			while (word = words.pop()) 
			{
				line.push(word);
				tspan.text(line.join(" "));
																						      
				if (tspan.node().getComputedTextLength() > width) 
				{
																							          
																									 
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
			        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}																													    
			}
	});
}

