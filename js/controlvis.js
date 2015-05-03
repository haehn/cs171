/**
 * Created by Lauren Wood for Harvard CS171 Final Project.
 **/



/**
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 **/

/**
 * ControlVis object - this has all of the control objects for filtering, year selection, etc.
 * @param _parentElement -- the HTML element to which to attach the control form
 * @param _data -- the data array
 * @param _event -- the event handler
 * @constructor
 **/
ControlVis = function(_parentElement, _data, _event){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _event;
    this.displayData = [];
    this.height = 300;
	this.width = 200;

    this.initVis();
}


/**
 * Method that sets up the form and options
 */
ControlVis.prototype.initVis = function(){

    var that = this; 

    this.displayForm = this.parentElement.select(".displaySelection");

    that.displayForm.append("text")
        .attr("class", "legend-desc")
	   .text("Display population by: ");

    this.displayForm.append("input")
	    .attr("type", "radio")
		.attr("name", "encoding")
		.attr("value", "counties")
		.attr("id", "counties")
        .on("click", function() {
		    that.updateView();
		});

	this.displayForm.append("text")
            .attr("class", "legend-desc")
            .text(" County  ");

    document.getElementById('counties').checked = true;

    this.displayForm.append("input")
	    .attr("type", "radio")
		.attr("name", "encoding")
		.attr("value", "cities")
        .on("click", function() {
		    that.updateView();
		});

    this.displayForm.append("text")
        .attr("class", "legend-desc")
        .text(" City");

    this.displayForm.append("div")
        .attr("style", "padding:1px;min-width:50px;display:inline-block");

    this.displayForm.append("input")
	    .attr("type", "checkbox")
		.attr("name", "railroads")
		.attr("value", "railroads")
		.attr("id", "railroads")
        .on("click", function() {
		    that.updateView();
		});

	document.getElementById('railroads').checked = true;

    this.displayForm.append("text")
        .attr("class", "legend-desc")
        .text("  Display Railroads");

    this.displayForm.append("div")
        .attr("style", "padding:1px;min-width:50px;display:inline-block");

    this.displayForm.append("text")
        .attr("class", "legend-desc")
        .text("Select Year:  ");

    this.displayForm.append("input")
	    .attr("type", "range")
        .attr("width", "20px")
		.attr("name", "yearSelector")
		.attr("min", "1800")
		.attr("max", "1900")
		.attr("step", "10")
		.attr("value", "1800")
		.on("change", function() {
		    that.updateView();
		});

    this.displayForm.append("div")
        .attr("style", "padding:1px;min-width:50px;display:inline-block");
 
    this.displayForm.append("button")
        .attr("type", "button")
        .attr("class", "btn btn-sm btn-primary")
        .on("click", function(){
            that.playSequence(1800);
        })
        .text("Play Sequence");

    this.displayForm.append("p")
        .text("  ");

    // call the update method
    this.updateView();
}

/**
 * This is going to update the input functions of the display form and define the event handling.
 **/
ControlVis.prototype.updateView = function() {

    var that = this;
    // We are going to create an array of settings to set up the display.
	var settings = [];

    settings.push($("input[name=encoding]:checked").val());
    settings.push($("input[name=railroads]").prop("checked"));
    settings.push($("input[name=yearSelector]").val());
	$(that.eventHandler).trigger("selectionChanged", settings);
}

/**
 * Provides the "animation" feature which loops through the full sequence
 * from 1800 to 1900.  It takes a year as the starting point but it always
 * starts at 1800 right now.
 * @param year -- the year to start the sequence
 **/
ControlVis.prototype.playSequence = function(year)
{
    var that = this;

    $("input[name=yearSelector]").val(year);
    that.updateView();

    setTimeout(function(){
        year = year + 10;
        if(year <= 1900)
            that.playSequence(year);
        }, 1500);
}

