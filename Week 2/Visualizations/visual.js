//var data = data[3].map(function(d) { return d.y } );

//var chart = $("<div></div>").addClass("chart");
//$(".chart-container").append(chart);

////data.forEach(function(d) { chart.append(d) });
//data.forEach(function(d) {
//    chart.append($("<div></div>").css("width", d*10 + "px").text(d));
//});

var outerHeight = 300;
var outerWidth = 300;

var margin = { top: 20, right: 20, bottom: 20, left: 20 };

var chartWidth = outerWidth - margin.left - margin.right;
var chartHeight = outerHeight - margin.top - margin.bottom;

var stack = d3.layout.stack();
var stackedData = stack(data);

var yGroupMax = d3.max(stackedData, function(layer) { 
                    return d3.max(layer, function(d) { return d.y; })
                });

var yStackMax = d3.max(stackedData, function(layer) { 
                    return d3.max(layer, function(d) { return d.y + d.y0; })
                });

var xScale = d3.scale.ordinal()
    .domain(d3.range(data[0].length)).rangeBands([0, chartWidth]);

var yScale = d3.scale.linear()
    .domain([0, yStackMax]).range([chartHeight, 0]);

//INITIALIZE THE CHART

var chart = d3.select(".chart-container")
    .append("svg")  
        .attr("class", "chart")
        .attr("height", outerHeight)
        .attr("width", outerWidth)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Y AXIS GRID LINES

chart.selectAll("line").data(yScale.ticks(10))
    .enter().append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale)
    .attr("y2", yScale);

//Y AXIS LABELS

chart.selectAll(".yscale-label").data(yScale.ticks(10))
    .enter().append("text")
    .attr("class", "yscale-label")
    .attr("x", 0)
    .attr("y", yScale)
    .attr("dx", -margin.left/8)
    .attr("text-anchor", "end")
    .attr("dy", "0.3em")
    .text(String);


//grabs all the layers and forms groups out of them
var layerGroups = chart.selectAll(".layer").data(stackedData)
    .enter().append("g")
    .attr("class", "layer");

//THE BARS (FOR STACKED BAR CHARTS)
var rects = layerGroups.selectAll("rect").data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return yScale(d.y + d.y0) })
    .attr("width", xScale.rangeBand())
    .attr("height", function(d) { return yScale(d.y0) - yScale(d.y0 + d.y) });

//THE BARS & THEIR LABELS (FOR NORMAL[GROUP] BAR CHARTS)

//chart.selectAll("rect").data(data)
//    .enter().append("rect")
//    .attr("x", function(d, i) { return xScale(i); })
//    .attr("y",yScale)
//    .attr("width", xScale.rangeBand())
//    .attr("height", function(d) { return chartHeight - yScale(d); });
//    
//chart.selectAll(".bar-label").data(data)
//    .enter().append("text")
//    .attr("class", "bar-label")
//    .attr("y", function(d) { return yScale(d) + margin.top/4; })
//    .attr("x", function(d, i) { return xScale(i) + xScale.rangeBand()/2; })
//    .attr("dy", "0.7em")
//    .attr("text-anchor", "middle")
//    .text(function(d) { return d; });


function goGrouped() {
    yScale.domain([0, yGroupMax]);
    
    rects.transition()
        .duration(1000)
        .delay(function(d, i) { return i * 20; })
        .attr("x", function(d, i, j) { return xScale(i) + xScale.rangeBand()/stackedData.length*j })
        .attr("width", xScale.rangeBand()/stackedData.length)
        .transition()
        .attr("y", function(d) { return yScale(d.y); })
        .attr("height", function(d) { return chartHeight - yScale(d.y); });
}






