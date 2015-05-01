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
    this.height = 475;
    this.densityColor = d3.scale.threshold(); // We need to define this here because
    this.cityColor = d3.scale.linear().domain([0,1000000]).range([0,10]);
    this.cityScale = d3.scale.linear().domain([0,1000000]).range([2,20]);
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
        //.attr("style", "border: 2px solid black")
        .append("g")
        .attr("transform", "translate(-100, 0)");
        
    //this.parentElement.select("svg").attr("viewBox", "475 50 300 225");


    this.legend = this.svg.append("g")
                      .attr("class", "legend");

    this.legend.append("line")
        .attr("x1", 600) 
        .attr("y1", 15)
        .attr("x2", 650)
        .attr("y2", 15)
        .attr("class", "country");

    this.legend.append("line")
        .attr("x1", 600)
        .attr("y1", 35)
        .attr("x2", 650)
        .attr("y2", 35)
        .attr("class", "incorporated");

    this.legend.append("line")
        .attr("x1", 600)
        .attr("y1", 55)
        .attr("x2", 650)
        .attr("y2", 55)
        .attr("class", "notincorporated");

    this.legend.append("line")
        .attr("x1", 600)
        .attr("y1", 75)
        .attr("x2", 650)
        .attr("y2", 75)
        .attr("class", "rails");

    this.legend.append("text")
        .attr("x", 665) 
        .attr("y", 20)
        .attr("class", "legend-desc")
        .text("Country Border");

    this.legend.append("text")
        .attr("x", 665)
        .attr("y", 40)
        .attr("class", "legend-desc")
        .text("State Borders");

    this.legend.append("text")
        .attr("x", 665)
        .attr("y", 60)
        .attr("class", "legend-desc")
        .text("Future State Borders");

    this.legend.append("text")
        .attr("x", 665)
        .attr("y", 80)
        .attr("class", "legend-desc")
        .text("Railroads");

    this.legend.append("text")
        .attr("x", 105)
        .attr("y", 340)
        .attr("class", "legend-desc legend-title")
        .text("Population Density");


    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 365)
        .attr("r", 5)
        .attr("class", "color0 legend-circle");
     this.legend.append("text")
        .attr("x", 125)
        .attr("y", 368)
        .attr("class", "legend-desc legend-text")
        .text("0 - 2");
   
    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 385)
        .attr("r", 5)
        .attr("class", "color1 legend-circle");
this.legend.append("text")
        .attr("x", 125)
        .attr("y", 388)
        .attr("class", "legend-desc legend-text")
        .text("2-6");

    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 405)
        .attr("r", 5)
        .attr("class", "color2 legend-circle");
 this.legend.append("text")
        .attr("x", 125)
        .attr("y", 408)
        .attr("class", "legend-desc legend-text")
        .text("6-12");
   
    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 425)
        .attr("r", 5)
        .attr("class", "color3 legend-circle");
this.legend.append("text")
        .attr("x", 125)
        .attr("y", 428)
        .attr("class", "legend-desc legend-text")
        .text("12-25");

    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 445)
        .attr("r", 5)
        .attr("class", "color4 legend-circle");
this.legend.append("text")
        .attr("x", 125)
        .attr("y", 448)
        .attr("class", "legend-desc legend-text")
        .text("26-50");

    this.legend.append("circle")
        .attr("cx", 110)
        .attr("cy", 465)
        .attr("r", 5)
        .attr("class", "color5 legend-circle");
this.legend.append("text")
        .attr("x", 125)
        .attr("y", 468)
        .attr("class", "legend-desc legend-text")
        .text("50-100");

    this.legend.append("circle")
        .attr("cx", 225)
        .attr("cy", 385)
        .attr("r", 5)
        .attr("class", "color6 legend-circle");
    this.legend.append("text")
        .attr("x", 240)
        .attr("y", 388)
        .attr("class", "legend-desc legend-text")
        .text("100-200");

    this.legend.append("circle")
        .attr("cx", 225)
        .attr("cy", 405)
        .attr("r", 5)
        .attr("class", "color7 legend-circle");
    this.legend.append("text")
        .attr("x", 240)
        .attr("y", 408)
        .attr("class", "legend-desc legend-text")
        .text("200-500");
   
    this.legend.append("circle")
        .attr("cx", 225)
        .attr("cy", 425)
        .attr("r", 5)
        .attr("class", "color8 legend-circle");
    this.legend.append("text")
        .attr("x", 240)
        .attr("y", 428)
        .attr("class", "legend-desc legend-text")
        .text("500-1000");

    this.legend.append("circle")
        .attr("cx", 225)
        .attr("cy", 445)
        .attr("r", 5)
        .attr("class", "color9 legend-circle");
    this.legend.append("text")
        .attr("x", 240)
        .attr("y", 448)
        .attr("class", "legend-desc legend-text")
        .text("1000-2000");

    this.legend.append("circle")
        .attr("cx", 225)
        .attr("cy", 465)
        .attr("r", 5)
        .attr("class", "color10 legend-circle");
    this.legend.append("text")
        .attr("x", 240)
        .attr("y", 468)
        .attr("class", "legend-desc legend-text")
        .text("2000-5000");


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

    that.densityColor
        .domain([0, 2, 6, 12, 25, 50, 100, 200, 500, 1000, 2000, 5000])
        .range(d3.range(9).map(function(i) { return "color" + i;}));

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
	//console.log(that.data);
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
    if(that.encoding == "counties")
	{   
            var filteredData = [];
            for(var i = 0; i < that.data.counties.length;i++)
            {//console.log(that.data.counties[i]);
                if(that.data.counties[i]["Year"] == that.year)
                    filteredData.push(that.data.counties[i]);
            }
           // console.log(filteredData);
            //console.log(that.displayData.counties.features);

	    for(var i = 0; i < that.displayData.counties.features.length;i++)  //change later to that.countyMaps.features.length
            {
                var state = that.displayData.counties.features[i].properties["STATE"];
                var county = that.displayData.counties.features[i].properties["NAME"];
                var population = -100;
                var stateName = "";
                var inc = that.getYear(that.getStateNamebyID(state)); 
                if(inc <= that.year)
                    that.displayData.counties.features[i].properties.inc = true;
                else
                    that.displayData.counties.features[i].properties.inc = false;
            

                if(that.displayData.counties.features[i].properties.inc ==  true)
                {  
                    
                    for(var j = 0; j < filteredData.length;j++)
                    {
                        if(filteredData[j].StateID == state && filteredData[j].County == county)
                        {
                           population = filteredData[j]["Population"];
                           break;
                        }
                    }
                    //population = -1;
                }
                else
                    population = -1;
                //console.log(that.countyMaps.features[i]);
                /*try{
                    population = that.data[state]["counties"][county][that.year][0]["Population"];
                }
                catch(err){
//                console.log("Error for: "  + year + county + ", " + state);
                    population = -1;
                }*/
                that.displayData.counties.features[i].properties.population = population;
                //console.log(that.countyMaps.features[i].properties);
            }
            //console.log(that.displayData.counties);
            that.displayData.cities = [];
	}
	else // cities
	{
            //console.log(that.data.cities);
            var filteredData = [];
            for(var i = 0; i < that.data.cities.length;i++)
            {//console.log(that.data.counties[i]);
                if(that.data.cities[i]["Year"] == that.year)
                    filteredData.push(that.data.cities[i]);
            }
            that.displayData.cities = filteredData;
            that.displayData.counties = [];
            /*for(code in that.data)
            {   
                for(city in that.data[code].cities)
                {
                    if(typeof that.data[code].cities[city][that.year] != "undefined")
                    {
                        that.displayData.cities.push(that.data[code].cities[city][that.year][0]);
                    } 
                }
            }*/
  

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

    // TODO: implement update graphs (D3: update, enter, exit)
    var that = this;
    var projection = d3.geo.albersUsa()
                       .scale([1000]);
    var path = d3.geo.path()
                 .projection(projection);

    var svg = that.parentElement.select("svg").select("g");

    

    // TODO:  We need to add the layers, from bottom to top: counties, states, countries

    // LEGEND

    svg.select(".legend-title")
        .attr("class", "legend-desc legend-title")
        .text(function(d,i){
        if(that.encoding == "counties")
            return "Population Density";
        else if(that.encoding == "cities")
            return "Population";
    });

    d3.selectAll(".legend-text")
      .text(function(d,i) {
         if(that.encoding == "counties")
         {
            if(i == 0)
                return "0-2";
            else if(i == 1)
                return "2-6"; 
             else if(i == 2)
                return "6-12"; 
            else if(i == 3)
                return "12-25"; 
            else if(i == 4)
                return "25-50"; 
            else if(i == 5)
                return "50-100"; 
            else if(i == 6)
                return "100-200"; 
            else if(i == 7)
                return "200-500"; 
            else if(i == 8)
                return "500-1000"; 
            else if(i == 9)
                return "1000-2000"; 
           else if(i == 10)
                return "2000-5000"; 
         }
         else if(that.encoding == "cities")
         {
            if(i == 0)
                return "0-100000";
            else if(i == 1)
                return "100000-200000"; 
             else if(i == 2)
                return "200000-300000"; 
            else if(i == 3)
                return "300000-400000"; 
            else if(i == 4)
                return "400000-500000"; 
            else if(i == 5)
                return "500000-600000"; 
            else if(i == 6)
                return "600000-700000"; 
            else if(i == 7)
                return "700000-800000"; 
            else if(i == 8)
                return "800000-900000"; 
            else if(i == 9)
                return "900000-1000000"; 
           else if(i == 10)
                return "> 1000000"; 
        }






       });


    // COUNTIES
    
    if(that.encoding == "counties")
    {
       // Here we need to bind the population data to the county data 
        var coline = svg.select(".counties").selectAll("path")
		    .data(that.displayData.counties.features);

		coline.enter()
		    .append("path");

		coline.attr("d", path)
                    .attr("class", function(d)
                    {
                        if(d.properties.inc == false)
                        {   
                            return "invis";
                        }
                        if(d.properties.population <= 0)
                            return "color0";
                        else
                        {
                            return that.densityColor(d.properties.population/d.properties.CENSUSAREA);
                        }
           });



	}
    else if(that.encoding == "cities")
    {
        var coline = svg.select(".counties").selectAll("path");


        coline.attr("class", "invisible");
    }

    

// RAILROADS

    // Create the parent objects that will maintain the railroads by year
	var railgroup = svg.select("g.rails").selectAll("g")
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
	    var railline = svg.select("g.rails").select(".rail" + i).selectAll("path")
		    .data(that.displayData.railroads[i].features);

		railline.enter()
		    .append("path");

		railline.attr("d", path)
		    .attr("class", "railtrack");
	}


// CITY CIRCLES


        var citycircle = svg.select(".cities").selectAll("circle")
            .data(that.displayData.cities);
            
        citycircle.enter()
            .append("circle")
            .append("title");;

        citycircle.attr("r", function(d){return that.cityScale(d.Population);})
            .attr("cx",function(d){ return (projection([d.longitude, d.latitude])[0]);})
            .attr("cy", function(d){ return (projection([d.longitude, d.latitude])[1]);})

            citycircle.attr("class", function(d,i){return "city-circle color" + Math.round(that.cityColor(d.Population));});
  
        citycircle.select("title")
            .text(function(d,i){return d.City + ", " + d.State + ", Pop: " + d.Population;});

        citycircle.exit().remove();

// STATES

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



  // COUNTRY
   
   var country = svg.select("g.country").selectAll("path")
       .data(that.displayData.country.features);
    
	country.enter()
       .append("path");

	country.attr("d", path)
	   .attr("class", "countryBorder");

    country.exit().remove();



//STOP HERE!

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
//    console.log(id);
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
