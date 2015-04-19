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
MapVis = function(_parentElement, _data,_mappings, _country, _state, _county, _rail, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.stateMappings = _mappings;
    this.countryMaps = _country;
    this.stateMaps = _state;
    this.countyMaps = _county;
    this.railMaps = _rail;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.year = 1800;
    this.encoding = "counties";
    this.tracks = true;
    this.width = 760;
    this.height = 500;
    this.color = d3.scale.quantize(); // We need to define this here because
    this.cityScale = d3.scale.linear().domain([0,3500000]).range([2,20]);
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
//        .attr("style", "border: 2px solid black")
        .append("g")
        .attr("transform", "translate(-100, 0)");

   

   

    this.svg.append("g")
        .attr("class", "counties");
        //.attr("transform", "translate(-100,0)");

    this.svg.append("g")
        .attr("class", "states");
    this.svg.append("g")
        .attr("class", "country");

    this.svg.append("g")
        .attr("class", "rails");

    this.svg.append("g")
        .attr("class", "cities");

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
        .range(d3.range(9).map(function(i) { return "color" + (i + 1);}));

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
    var that = this;
	var displayStates = true;
	that.displayData = [];
    //console.log(this.year);
    //  TODO: Country, States, Counties, Cities, Railroads
    that.displayData.country = that.countryMaps[that.year];
    that.displayData.states = that.stateMaps;
	that.displayData.counties = that.countyMaps;
	that.displayData.railroads = [];
        that.displayData.cities = [];
	//console.log(that.data);
//	console.log(that.displayData.states);

    if(displayStates == true)
	{
        for(var i = 0; i < that.displayData.states.features.length;i++)
	    { 
	        if(that.getYear(that.displayData.states.features[i].properties.NAME) < that.year)
		        that.displayData.states.features[i].properties.inc = true;
		    else
		        that.displayData.states.features[i].properties.inc = false;
	    }
	}
	else
	    that.displayData.states.features = [];
//console.log(that.stateMappings);
    if(that.encoding == "counties")
	{
	    for(var i = 0; i < that.displayData.counties.features.length;i++)  //change later to that.countyMaps.features.length
            {
                var state = that.displayData.counties.features[i].properties["STATE"];
                var county = that.displayData.counties.features[i].properties["NAME"];
                var population = -100;
                var stateName = "";
                var inc = that.getYear(that.getStateNamebyID(state)); 
            //console.log(that.countyMaps.features[i]);
                try{
                    population = that.data[state]["counties"][county][that.year][0]["Population"];
                }
                catch(err){
//                console.log("Error for: "  + year + county + ", " + state);
                    population = -1;
                }
                that.displayData.counties.features[i].properties.population = population;
                if(inc < that.year)
                    that.displayData.counties.features[i].properties.inc = true;
                else
                    that.displayData.counties.features[i].properties.inc = false;
            //console.log(that.countyMaps.features[i].properties);
            }
            that.displayData.cities = [];
	}
	else // cities
	{
                that.displayData.counties = [];
            for(code in that.data)
            {   
                for(city in that.data[code].cities)
                {
                    if(typeof that.data[code].cities[city][that.year] != "undefined")
                    {
                        that.displayData.cities.push(that.data[code].cities[city][that.year][0]);
                    } 
                }
            }
  

	}
//console.log(that.displayData);
 //   console.log(that.railMaps);
	if(that.tracks)
	{
	    for(y in that.railMaps)
		{
		    if(y <= that.year)
			    that.displayData.railroads.push(that.railMaps[y]);
		}
	}

    //this.displayData = this.data;
   // console.log(that.displayData);
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
MapVis.prototype.updateVis = function(){
//    console.log("update");
    // TODO: implement update graphs (D3: update, enter, exit)
    //var year = 1860;
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

    //console.log(that.displayData.counties);
   // if(that.encoding == "counties")
    //{
  /*  var codisplay = [];
    if(that.encoding == "counties")
        codisplay = [1];
	
        var countygroup = svg.select(".counties").selectAll("g")
	    .data(codisplay);

	countygroup.enter()
	    .append("g")
		.attr("class", function(d,i)
		{
			return "county" + i;
		});

	countygroup.exit().remove();
*/
    if(that.encoding == "counties")
	{
	    var coline = svg.select(".counties").selectAll("path")
		    .data(that.displayData.counties.features);

		coline.enter()
		    .append("path");

		coline.attr("d", path)
                    .attr("class", function(d)
                    {
                        if(d.properties.inc == false)
                        {
                            //console.log(d);
                            return "invis";
                        }
                        if(d.properties.population <= 0)
                            return "color0";
                        else
                            return that.color(d.properties.population);
           });


	}
    else if(that.encoding == "cities")
    {
        var coline = svg.select(".counties").selectAll("path");


        coline.attr("class", "invisible");
    }

/*

    var codisplay = []; 
    if(that.encoding == "counties")
        codisplay = [1];
    
        var countygroup = svg.select(".counties").selectAll("g")
            .data(codisplay);

        countygroup.enter()
            .append("g")
                .attr("class", function(d,i)
                {   
                        return "county" + i;
                }); 

        countygroup.exit().remove();

    if(that.encoding == "counties")
        {   
            var coline = svg.select(".counties").select(".county0").selectAll("path")
                    .data(that.displayData.counties.features);

                coline.enter()
                    .append("path");

                coline.attr("d", path)
                    .attr("class", function(d){
                        if(d.properties.population == -1) 
                            return "nocolor";
                        else
                            return that.color(d.properties.population);
           }); 


        }   





*/


/*
    console.log(that.displayData);
        var countyshapes = svg.select(".counties").selectAll("path")
           .data(that.displayData.counties.features);

        countyshapes.enter()
           .append("path");
           
        countyshapes.attr("d", path)
	   .attr("class", function(d){
           if(d.properties.population == -1)
              return "nocolor";
           else
              return that.color(d.properties.population);
           });

        countyshapes.exit().remove();
*/

    // Create the parent objects that will maintain the railroads by year
	var railgroup = svg.select(".rails").selectAll("g")
	    .data(that.displayData.railroads);

	railgroup.enter()
	    .append("g")
		.attr("class", function(d,i)
		{
			return "rail" + i;
		});

	railgroup.exit().remove();

    for(var i = 0; i < that.displayData.railroads.length;i++)
	{
	    var railline = svg.select(".rails").select(".rail" + i).selectAll("path")
		    .data(that.displayData.railroads[i].features);

		railline.enter()
		    .append("path");

		railline.attr("d", path)
		    .attr("class", "railtrack");
	}
    //}
    //else if(that.encoding == "cities")
    //{
        var citycircle = svg.select(".cities").selectAll("circle")
            .data(that.displayData.cities);
            
        citycircle.enter()
            .append("circle");

        citycircle.attr("r", function(d){return that.cityScale(d.Population);})
            .attr("cx",function(d){ return (projection([d.longitude, d.latitude])[0]);})
            .attr("cy", function(d){ return (projection([d.longitude, d.latitude])[1]);})

            citycircle.attr("class", "city-circle");
  
        citycircle.exit().remove();

    //}

    svg.select(".states").selectAll("path")
       .data(that.displayData.states.features)
       .enter()
       .append("path")
       .attr("d", path);

	svg.select(".states").selectAll("path")
	    .attr("class", function(d){
		   if(d.properties.inc)
		       return "incorporated";
		   else
		       return "notincorporated";
	   });

    var country = svg.select(".country").selectAll("path")
       .data(that.displayData.country.features);
    
	country.enter()
       .append("path");

	country.attr("d", path)
	   .attr("class", "countryBorder");

    country.exit().remove();



/*
console.log(that.displayData.railroads);
console.log(svg.select(".rails"));
    svg.select(".rails").selectAll("g")
	    .data(that.displayData.railroads)
		.append("g")
		.attr("class", "lauren");
	*/	/*.attr("class", function(d){
		    console.log(d);
		       //return d.features.properties.name;
		});*/
/*
    for(y in that.displayData.railroads)
	{
        svg.select(".rails").selectAll("path." + y + "rail")
           .data(that.displayData.railroads[y].features)
           .enter()
           .append("path")
           .attr("d", path)
		   .attr("class", y + "rail");
    }*/
      // .attr("stroke", "black")
      // .attr("stroke-width", "2");
       //.attr("class", function(d) {console.log(d)});



}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange= function (encoding, tracks, year){

    var that = this;

    that.year = year;
	that.encoding = encoding;
	that.tracks = tracks;
    //console.log(encoding);
	//console.log(tracks);               
	//console.log(year);

    // TODO: call wrangle function
    this.wrangleData();
    // do nothing -- no update when brushing
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

MapVis.prototype.getStateNamebyID = function(id)
{
    var that = this;
    for(var i = 0;i < that.stateMappings.length;i++)
    {
        if(that.stateMappings[i].ID == id)
            return that.stateMappings[i].State;
    }
}

MapVis.prototype.getYear = function(state)
{
//    console.log(state);
    var that = this;
    for(var i = 0;i < that.stateMappings.length;i++)
	{
//console.log(that.stateMappings[0]);
	    if(that.stateMappings[i].State == state)
		{
		    return that.stateMappings[i].Year;
		}
	}
//    console.log(state);    
}



