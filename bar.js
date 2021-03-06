var div = d3.select('#barRace')
var svgbar = div.append('svg')
.attr('height',800)
.attr('width',800)
// this function is for displaying bar graphs
//inside this there is condition for city view and gas view
function showBarGraphCity(data,nxt,day){
    
    
    var marginL = 100
    var marginR = 100
    var marginU = 100
    var marginD = 100
    if(selected_view=='Gas View')
    marginL = 50
    var width = svgbar.attr('width') - marginL - marginR
    var height = svgbar.attr('height') - marginU - marginD
    var xscalebar = d3.scaleBand().range([0,width]).padding(0.4)
    var yscalebar = d3.scaleLinear().range([height,0])
    var xlabel,ylabel;
    gbar = svgbar.append('g').attr('transform','translate('+marginL+','+marginU+')')
    gbar.append('text').attr('x',500).attr('y',-10).text(function(){if(selected_time=="Daywise View") return parseDateSlash(dates_all[day]); else{return timeFormat(day)}}).attr('font-size',32)
    if(selected_view=='City View'){// this is for graying out the cities that are not selected for race in city view
        var grayed = places.filter((p) => !selected_cities.includes(p))

        grayed.forEach(element => {
        // console.log(element,day)
        d3.selectAll('#'+element.split(' ').join(''))
        .attr('fill','rgba(25,25,25,0.4)')
        
    });
    }
    var yscales = []
    if(selected_view =="Gas View")//x and y axis for gas view
    {
        var city_name = places[city_selected]
        d3.selectAll('#'+city_name.split(' ').join(''))//changing the color of selected city
        .attr('fill',getRandomColor())
        for(var i=0;i<attributes.length;i++)//separate yaxis for each gas
        {
            var yscale = d3.scaleLinear().range([height,0])
            yscales.push(yscale.domain([0,makgases[city_selected][i]]))
        }
        yscalebar = yscalebar.domain([0,mak[city_selected]])
        xscalebar = xscalebar.domain(attributes.map(function(d){return d}))
        xlabel = 'gases'
        ylabel = 'concentration in '+places[city_selected];
        
    }
    else
    {   
        xscalebar = xscalebar.domain(selected_cities.map(function(d){return d}))
        // yscalebar = yscalebar.domain([0,d3.max(data, function(d,i){return Math.max(d,nxt[i])})])
        // console.log(makgases[gas_selected])
        var qwe=0
        for(var i=0;i<selected_cities.length;i++){
            // console.log(makgases[places.indexOf(selected_cities[i])])
            if(qwe<makgases[places.indexOf(selected_cities[i])][gas_selected])
            qwe=makgases[places.indexOf(selected_cities[i])][gas_selected]
        }
        // console.log(qwe)
        yscalebar = yscalebar.domain([0,qwe])
        xlabel = 'cities'
        ylabel = 'concentration'
    }
    if(selected_view=='City View')//for city view we are displaying name vercically,so this condition
        var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16).selectAll('text').attr("y", 0).attr("x", 9).attr("dy", ".35em").attr('transform','rotate(90)').style("text-anchor", "start");
    else
        var xaxisbar = gbar.append('g').call(d3.axisBottom().scale(xscalebar)).attr('transform','translate(0,'+ height + ')').style('font-size',16).selectAll('text').text(function(d,i){return d.slice(0,2)}).append('tspan').text(function(d,i){return d.slice(2)}).style('font-size', '.9rem').attr('dx', '.01em').attr('dy', '.3em').append('tspan').text(function(d,i){return ' ('+conc[i]+')'}).style('font-size', 18)
    xaxisbar.append('text')
    .attr('x',width-250)
    .attr('y',60)
    .attr('text-anchor','end')
    .attr('stroke','black')
    .style('font-family','Comfortaa')
    .attr('fill','black')
    .style('font-size',32)
    .text(xlabel)
    if(selected_view=="Gas View"){// in case to gas view, adding extra text at bottom to show gas cncentration unit
        xaxisbar.append('text')
    .attr('x',width-150)
    .attr('y',90)
    .attr('text-anchor','end')
    .attr('stroke','black')
    .style('font-family','Comfortaa')
    .attr('fill','black')
    .style('font-size',20)
    .text("(CO2,SO2:ppb  NO,NO2,NOX: ppm)")
    }
    if(selected_view=='City View'){//for gas view there is only one y axis
    var yaxisbar = gbar.append('g').call(d3.axisLeft().scale(yscalebar)).style('font-size',16)
    yaxisbar.append('text')
    .attr('transform','rotate(-90)')
    .attr('x',-150)
    .attr('y',-50)
    .attr('text-anchor','end')
    .attr('stroke','black')
    .style('font-family','Comfortaa')
    .attr('fill','black')
    .style('font-size',32)
    .style('z-index',10)
    .text(function(){if(selected_view=="Gas View") return `concentration in ${places[city_selected]}`; else return `concentration of ${attributes_units[gas_selected]}`})
    }
    else{// for gas view, number of axis depend on the number of gases
        yscales.forEach((ele,i) => {
            var al=gbar.append('g').call(d3.axisLeft().scale(ele)).style('font-size',12).attr('transform','translate('+xscalebar(attributes[i])+', 0 )')
            gbar.append('g').call(d3.axisRight().scale(ele).tickSize(0)).style('font-size',0).attr('transform','translate('+(xscalebar(attributes[i])+xscalebar.bandwidth())+', 0 )')
            if(i==0){
                al.append('text')
                .attr('transform','rotate(-90)')
                .attr('x',-150)
                .attr('y',-50)
                .attr('text-anchor','end')
                .attr('stroke','black')
                .attr('fill','black')
                .style('font-family','Comfortaa')
                .style('font-size',32)
                .style('z-index',10)
                .text(`concentration in ${places[city_selected]}`)
            }
        })

    }
    bars = gbar.selectAll('.bar').data(data)
    var duplicate = data
    duplicate.sort()
    // console.log(data[4])
    bars = bars
    .enter()
    .append('rect')
    .attr('x',function(d,i){if(selected_view =="Gas View"){return xscalebar(attributes[i])} else{return xscalebar(selected_cities[i])} })
    .attr('y',function(d,i){if(selected_view=='City View'){return yscalebar(d)} else{return yscales[i](d)} })
    .attr('width', function(d){return xscalebar.bandwidth()})
    .attr('height', function(d,i){if(selected_view=='City View'){return height-yscalebar(d)}else{return height-yscales[i](d)}})
    .style('fill',function(d,ind){
        if(selected_view =="Gas View"){//coloring bars according to color of gas in gas view
            return colorBubbles[attributes[ind]]}
        else{//coloring bars according to the color of city and also changing the city color
            // console.log(zones[ind])
            d3.selectAll('#'+selected_cities[ind].split(' ').join(''))
            .attr('fill',zones[duplicate.indexOf(d)])
            return colorMap[selected_cities[ind]]}})
    .transition()
    .duration(time)
    .ease(d3.easeLinear)
    .attr('y',function(d,i){if(selected_view=='City View'){return yscalebar(nxt[i])} else{return yscales[i](nxt[i])}})
    .attr('height',function(d,i){
        if(selected_view=='City View'){return height-yscalebar(nxt[i])}else{return height-yscales[i](nxt[i])}})
    
}
