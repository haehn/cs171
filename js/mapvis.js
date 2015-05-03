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
 * MapVis object creates the main map display on the page
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the array of county and city specific data, i.e. populations
 * @param _mappings -- used for identification of states.  maps postcodes, ID numbers, names and year of incorporation
 * @param _country  -- country outline maps for each decade
 * @param _state    -- the outline of the states
 * @param _county   -- the outline of counties
 * @param _rail     -- maps of rail lines by year
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
MapVis = function(_parentElement, _data, _mappings, _country, _state, _county, _rail, _eventHandler){
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
    this.cityColor = d3.scale.linear().domain([0,5000,10000,25000,50000,75000,100000,250000,500000,1000000,2000000,3500000]).range([0,1,2,3,4,5,6,7,8,9,10,10]);
    this.cityScale = d3.scale.linear().domain([0,1000000,3500000]).range([2,20,20]);

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
MapVis.prototype.initVis = function(){

    var that = this; // read about the this


    // append an svg element to build our map on
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(-100, 0)");

    // start building our legend defining outline colors
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

    // setup our color legend
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

    // each of our map types has its own layer for ease of object management
	// we create them here and reference them later
    this.svg.append("g")
        .attr("class", "counties");

    this.svg.append("g")
        .attr("class", "states");
    
	this.svg.append("g")
        .attr("class", "country");

    this.svg.append("g")
        .attr("class", "rails");

    this.svg.append("g")
        .attr("class", "cities");


    // Update the color scale (inspired by Mike Bostock's color scale, bl.ocks.org/mbostock/5925375
    // In order to do this, we need to loop through all populations and find the highest.
    var population = 0;

    // this is usually a suboptimal way to do this, but perf testing showed that it didn't have
	// enough of an impact to rewrite at this time
    for(var state in that.data)
    {
        for(var county in that.data[state]["counties"])
        {
            for(var year in that.data[state]["counties"][county])
                if(parseInt(that.data[state]["counties"][county][year][0]["Population"]) > population)
                    population = parseInt(that.data[state]["counties"][county][year][0]["Population"]);
        }
    }

    that.densityColor
        .domain([0, 2, 6, 12, 25, 50, 100, 200, 500, 1000, 2000, 5000])
        .range(d3.range(9).map(function(i) { return "color" + i;}));

    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}



/**
 * Method to wrangle the data. This is really based on our control options: year,
 * encoding, cities vs counties, etc.
 **/
MapVis.prototype.wrangleData= function(){
        
    var that = this;
    var displayStates = true;
	that.displayData = [];
    
	// Country, States, Counties, Cities, Railroads
    that.displayData.country = that.countryMaps[that.year];
    that.displayData.states = that.stateMaps;
    that.displayData.counties = that.countyMaps;
    that.displayData.railroads = [];
    that.displayData.cities = [];

    // Turn off state lines if we don't want them
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

    // Display county colors based on population density
    if(that.encoding == "counties")
	{   
        var filteredData = [];
        for(var i = 0; i < that.data.counties.length;i++)
        {
            if(that.data.counties[i]["Year"] == that.year)
                filteredData.push(that.data.counties[i]);
        }

	    for(var i = 0; i < that.displayData.counties.features.length;i++)  
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
            }
            else
                population = -1;
                
			that.displayData.counties.features[i].properties.population = population;
        }
        that.displayData.cities = [];
	}
	else // cities
	{
        var filteredData = [];
        for(var i = 0; i < that.data.cities.length;i++)
        {
            if(that.data.cities[i]["Year"] == that.year)
                filteredData.push(that.data.cities[i]);
        }
        that.displayData.cities = filteredData;
        that.displayData.counties = [];
	}

    // we are displaying the railroad tracks
    if(that.tracks)
	{
	    for(y in that.railMaps)
		{
		    if(y <= that.year)
			    that.displayData.railroads.push(that.railMaps[y]);
		}
	}
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
MapVis.prototype.updateVis = function(){

    var that = this;
    var projection = d3.geo.albersUsa()
                       .scale([1000]);
    var path = d3.geo.path()
                 .projection(projection);

    var svg = that.parentElement.select("svg").select("g");

    // LEGEND

    svg.select(".legend-title")
        .attr("class", "legend-desc legend-title")
        .text(function(d,i){
            if(that.encoding == "counties")
                return "Population Density";
            else if(that.encoding == "cities")
                return "Population";
        });
    
	// we have to define the legend based on whether we're looking at city or county populations
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
                  return "0-5,000";
              else if(i == 1)
                  return "5,000-10,000"; 
              else if(i == 2)
                  return "10,000-25,000"; 
              else if(i == 3)
                  return "25,000-50,000"; 
              else if(i == 4)
                  return "50,000-75,000"; 
              else if(i == 5)
                  return "75,000-100,000"; 
              else if(i == 6)
                  return "100,000-250,000"; 
              else if(i == 7)
                  return "250,000-500,000"; 
              else if(i == 8)
                  return "500,000-1,000,000"; 
              else if(i == 9)
                  return "1,000,000-2,000,000"; 
             else if(i == 10)
                  return "> 2,000,000"; 
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
                  if(d.properties.inc == false || (that.year == 1890 && d.properties.STATE == "56")) //handling a mismatch of dates with Wyoming in 1890
                  {   
                      return "invis";
                  }
                  if(d.properties.population <= 0)						
				  {
                      return "color0";
				  }
                  else
                  {
                      return that.densityColor(d.properties.population/d.properties.CENSUSAREA);
                  }
              });
	}
    else if(that.encoding == "cities")  // we are looking at encoding by city so want to turn off county lines
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

    //  call wrangle function
    this.wrangleData();

    this.updateVis();

}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */


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
    var that = this;
    for(var i = 0;i < that.stateMappings.length;i++)
	{
	    if(that.stateMappings[i].State == state)
		{
		    return that.stateMappings[i].Year;
		}
	}
}
