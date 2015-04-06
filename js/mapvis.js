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
 * MapVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
MapVis = function(_parentElement, _data, _country, _state, _county, _rail, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.countryMaps = _country;
    this.stateMaps = _state;
    this.countyMaps = _county;
    this.railMaps = _rail;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.width = 760;
    this.height = 500;
    this.color = d3.scale.quantize(); // We need to define this here because
    // the values stay the same across all views

    // TODO: define all "constants" here



    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
MapVis.prototype.initVis = function(){

    var that = this; // read about the this



    //TODO: implement here all things that don't change
    //TODO: implement here all things that need an initial status
    // Examples are:
    // - construct SVG layout
    // - create axis
    // -  implement brushing !!
    // --- ONLY FOR BONUS ---  implement zooming

    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: 2px solid black")
        .append("g")
        .attr("transform", "translate(-100, 0)");

    this.svg.append("g")
        .attr("class", "counties");
        //.attr("transform", "translate(-100,0)");

    this.svg.append("g")
        .attr("class", "rails");
        //.attr("transform", "translate(-100,0)");



    // TODO: Update the color scale (inspired by Mike Bostock's color scale, bl.ocks.org/mbostock/5925375
    // In order to do this, we need to loop through all populations and find the highest.
    var population = 0;
    //console.log(that.data);

    for(var state in that.data)
    {
        for(var county in that.data[state]["counties"])
        {
            for(var year in that.data[state]["counties"][county])
                if(parseInt(that.data[state]["counties"][county][year][0]["Population"]) > population)
                    population = parseInt(that.data[state]["counties"][county][year][0]["Population"]);
        }
    }

    //console.log(population);

    //that.data.forEach(function(d){
    //    console.log(d);
    //});

    that.color
        .domain([0, 50000])
        .range(d3.range(9).map(function(i) { return "colorPop" + i;}));

    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    //this.addSlider(this.svg)


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
  */
MapVis.prototype.wrangleData= function(){

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
MapVis.prototype.updateVis = function(){

    // TODO: implement update graphs (D3: update, enter, exit)
    var year = 1900;
    var that = this;
    var projection = d3.geo.albersUsa()
                       .scale([1000]);
    var path = d3.geo.path()
                 .projection(projection);

    var svg = that.parentElement.select("svg").select("g");

    // TODO:  We need to add the layers, from bottom to top: counties, states, countries
    //console.log(that.countyMaps);
    //console.log(that.displayData);
    // Here we need to bind the population data to the county data 
    for(var i = 0; i < that.countyMaps.features.length;i++)  //change later to that.countyMaps.features.length
    {
        var state = that.countyMaps.features[i].properties["STATE"];
        var county = that.countyMaps.features[i].properties["NAME"];
        var population = -100;
        //console.log(that.countyMaps.features[i]);
        try{
        
            var population = that.displayData[state]["counties"][county][year][0]["Population"];
        }
        catch(err){
//            console.log("Error for: "  + year + county + ", " + state);
            population = -1;
        }
        that.countyMaps.features[i].properties.population = population;
        //console.log(that.countyMaps.features[i].properties);
    }

    svg.select(".counties").selectAll("path")
       .data(that.countyMaps.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("id", function(d) {
           return d.properties.population;
       })
       .style("stroke", "black")
       .style("stroke-width", "0.5px")
       .attr("class", function(d){
           if(d.properties.population == -1)
              return "nocolor";
           else
              return that.color(d.properties.population);
       });
    console.log(that.railMaps);
    svg.select(".rails").selectAll("path")
       .data(that.railMaps[year].features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("stroke", "black")
       .attr("stroke-width", "2");
       //.attr("class", function(d) {console.log(d)});


}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    // do nothing -- no update when brushing


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */





/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
MapVis.prototype.addSlider = function(svg){
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([0,200]).range([0,200])

    var sliderDragged = function(){
        var value = Math.max(0, Math.min(200,d3.event.y));

        var sliderValue = sliderScale.invert(value);

        // TODO: do something here to deform the y scale
        console.log("Y Axis Slider value: ", sliderValue);


        d3.select(this)
            .attr("y", function () {
                return sliderScale(sliderValue);
            })

        that.updateVis({});
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:200
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:0,
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)


}






