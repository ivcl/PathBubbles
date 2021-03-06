/**
 * @author      Yongnan
 * @version     1.0
 * @time        10/18/2014
 * @name        PathBubble_D3Table
 */

PATHBUBBLES.D3Table = function (parent, w, h) {
    this.parent = parent;
    this.w = w;
    this.h = h;
    this.data = null;
    this.dbId = null;
    this.keepQuery = true;
    this._symbols2Pathways = this.parent.crosstalking;
};

PATHBUBBLES.D3Table.prototype = {
    constructor: PATHBUBBLES.D3Table,
    init: function (dbId, querySymbol) {
        this.dbId = dbId;
        var _this = this;
        var margin = {top: 20, right: 5, bottom: 20, left: 3},
            width = this.w - margin.left - margin.right,
            height = this.h - margin.top - margin.bottom;
        d3.select("#svg" + this.parent.id)
            .attr("width", this.w)
            .attr("height", this.h);

        var container = d3.select("#svg" + this.parent.id)
            .attr("width", Math.min(this.w, width + margin.left + margin.right))
            .attr("height", Math.min(this.h, height + margin.top + margin.bottom))
            .style("border", "2px solid #000")
            .style("overflow", "scroll");

        var svg = container.append('svg')
            .attr("width", Math.min(this.w, width + margin.left + margin.right))
            .attr("height", Math.min(this.h, height + margin.top + margin.bottom))
            .style("vertical-align", "middle")
            .style("box-shadow", "inset 0 0 3px 0px #CECECE")
            .style("background", "rgba(255,255,255, 0.2)")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var headerGrp = svg.append("g").attr("class", "headerGrp");
        var rowsGrp = svg.append("g").attr("class", "rowsGrp");

        var previousSort = null;
        var format = d3.time.format("%a %b %d %Y");

        refreshTable(null);

        function refreshTable(sortOn) {
            var fieldHeight = 30;
            var fieldWidth = 90;
            if (_this.data == null) {
                if (querySymbol !== null && querySymbol !== undefined) {
                    $.ajax({
                        url: "./php/querybyPathwayIdSymbol.php",
                        type: "GET",
                        data: {
                            pathwaydbId: dbId,
                            symbol: querySymbol
                        },
                        dataType: "json",
                        success: function (jsonData) {
                            operation(jsonData);
                        },
                        error: function () {
                        }
                    });
                }
                else {
                    $.ajax({
                        url: "./php/querybyPathwayId.php",
                        type: "GET",
                        data: {
                            pathwaydbId: dbId
                        },
                        dataType: "json",
                        success: function (jsonData) {
                            operation(jsonData);
                        },
                        error: function () {
                        }
                    });
                }
            }
            else {
                operation(_this.data);
            }
            function trimLabel(label) {
                if (label.length > 10) {
                    return String(label).substr(0,15) + "...";
                }
                else {
                    return label;
                }
            }
            function operation(jsonData) {
                _this.w = Math.max((fieldWidth + 1) * d3.keys(jsonData[0]).length + 2 * (margin.left + margin.right)+40, width + margin.left + margin.right);
                _this.parent.w = _this.w ;
                $("#svg" + _this.parent.id).children("svg").css({
                    width: Math.max((fieldWidth + 1) * d3.keys(jsonData[0]).length + 2 * (margin.left + margin.right), width + margin.left + margin.right),
                    height: Math.max((fieldHeight + 1) * jsonData.length + 2 * (margin.top + margin.bottom), height + margin.top + margin.bottom)
                });
                // create the table header
                var header = headerGrp.selectAll("g")
                    .data(d3.keys(jsonData[0]))
                    .enter().append("g")
                    .attr("class", "header")
                    .attr("transform", function (d, i) {
                        return "translate(" + i * fieldWidth + ",0)";
                    })
                    .style("cursor", "s-resize")
                    .on("click", function (d) {
                        return refreshTable(d);
                    });

                header.append("rect")
                    .attr("width", fieldWidth - 1)
                    .attr("height", fieldHeight)
                    .style("fill", "#333").style("stroke", "#000000");

                header.append("text")
                    .attr("x", fieldWidth / 2)
                    .attr("y", fieldHeight / 2)
                    .attr("dy", ".35em")
                    .style("fill", "#fff")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .style("text-anchor", "middle")
                    .text(String);
                var rows = rowsGrp.selectAll("g.row").data(jsonData);

                // create rows
                var rowsEnter = rows.enter().append("svg:g")
                    .attr("class", "row")
                    .attr("id", function (d, i) {
                        return "row" + i;
                    })
                    .attr("transform", function (d, i) {
                        return "translate(0," + (i + 1) * (fieldHeight + 1) + ")";
                    });

                // select cells
                var cells = rows.selectAll("g.cell").data(function (d) {
                    if(_this.keepQuery)
                    {
                        var symbol = d.symbol;
                        var obj = [];
                        d3.entries(d).forEach(function(data){
                            data.symbol = symbol;
                            obj.push(data);
                        });
                        return obj;
                    }
                    else
                        return d3.entries(d);
                });

                // create cells
                cells.enter().append("svg:g")
                    .attr("class", "cell")
                    .attr("id", function (d, i) {
                        return "column" + i;
                    })
                    .attr("transform", function (d, i) {
                        return "translate(" + i * fieldWidth + ",0)";
                    });

                cells.append("rect")
                    .attr("width", fieldWidth - 1)
                    .attr("height", fieldHeight)
                    .style("fill", "#ffffff")
                    .style("stroke", "#000000");

                cells.append("text")
                    .attr("x", fieldWidth / 2)
                    .attr("y", fieldHeight / 2)
                    .attr("dy", ".35em")
                    .style("fill", "#000")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .style("text-anchor", "middle")
                    .attr("class", function (d) {
                        if (d.key == "symbol")
                            return "hyper";
                        else  if(d.key == "crossTalk")
                            return "hyper";
                        else
                            return "normalCell";
                    })
                    .text(
                    function (d) {
                        return trimLabel(d.value);
                    });
//                    .text(String);
                cells
                    .on("click",function(d,i){
                        if(d.key!=="symbol")
                            return;
                        if( $("#information").children('iframe').length==0)
                        {
                            var iframe = $('<iframe frameborder="0" marginwidth="0" marginheight="0" width="560px" height="500" ></iframe>');
                            iframe.attr({src: "http://www.ncbi.nlm.nih.gov/gquery/?term="+d.value});
                            $("#information").append(iframe).dialog({
                                autoOpen: false,
                                modal: false,
                                resizable: false,
                                width: "auto",
                                height: "auto",
                                position: [(d3.event.pageX+10),d3.event.pageY-10],
                                close: function () {
                                    iframe.attr("src", "http://www.ncbi.nlm.nih.gov/gquery");
                                }
                            });
                        }
                        else
                        {
                            $('#information').dialog('option', 'position', [(d3.event.pageX+10),d3.event.pageY-10]);
                            $("#information").children("iframe").attr({src: "http://www.ncbi.nlm.nih.gov/gquery/?term="+d.value});
                        }

                        $("#information").dialog("open");
                        $("#information").on("contextmenu", function(e){
                            return false;
                        });
                    })
                    .on("contextmenu", function (d, i) {
                        if (_this.keepQuery && d.key == "symbol")
                        {
                            if (d.value == String(d.value))
                            {
                                var bubble = new PATHBUBBLES.Table(_this.parent.x + _this.parent.offsetX + _this.parent.w - 40, _this.parent.y + _this.parent.offsetY, 530, 500, null, null, {dbId: _this.dbId, symbol: d.value});
                                bubble.name = _this.parent.name + "-" + d.value;
                                bubble.addHtml();
                                bubble.table.keepQuery = false;
                                bubble.menuOperation();

                                if (viewpoint) {
                                    bubble.offsetX = viewpoint.x;
                                    bubble.offsetY = viewpoint.y;
                                }
                                scene.addObject(bubble);
                                if (!_this.parent.GROUP) {
                                    var group = new PATHBUBBLES.Groups();
                                    group.objectAddToGroup(_this.parent);
                                    group.objectAddToGroup(bubble);
                                    scene.addObject(group);
                                }
                                else {
                                    if (_this.parent.parent instanceof  PATHBUBBLES.Groups) {
                                        _this.parent.parent.objectAddToGroup(_this.parent);
                                        _this.parent.parent.objectAddToGroup(bubble);
                                        scene.addObject(_this.parent.parent);
                                    }
                                }
                                d3.event.preventDefault();
                            }
                            d3.event.preventDefault();
                        }
                        else if (_this.keepQuery && d.key == "crossTalk") {
                            if(d.value == 0)
                            {
                                alert("It does not have cross-talking pathways!");

                            }
                            else
                            {
                                var index = _this._symbols2Pathways.symbols.indexOf(d.symbol);
                                if(index!==-1)
                                {
                                    var pathways = _this._symbols2Pathways.pathwayNames[index];
                                    var biPartiteData = [];
                                    for(var i=0; i<pathways.length; ++i)
                                    {
                                        var da = [];
                                        da.push(d.symbol);
                                        da.push(pathways[i]);
                                        biPartiteData.push(da);
                                    }
                                    if(biPartiteData.length>0)
                                    {
                                        var bubble = new PATHBUBBLES.BiPartite(_this.parent.x + _this.parent.offsetX + _this.parent.w - 40, _this.parent.y + _this.parent.offsetY, 600,510,biPartiteData);
                                        bubble.addHtml(["Symbol", "Pathway"]);

                                        if(_this.parent.name.indexOf(")"))
                                        {
                                            bubble.name ="(Symbol crosstalking)"+_this.parent.name.split(")")[1];
                                        }
                                        bubble.menuOperation();
                                        if(viewpoint)
                                        {
                                            bubble.offsetX = viewpoint.x;
                                            bubble.offsetY = viewpoint.y;
                                        }
                                        scene.addObject(bubble);

                                        if (!_this.parent.GROUP) {
                                            var group = new PATHBUBBLES.Groups();
                                            group.objectAddToGroup(_this.parent);
                                            group.objectAddToGroup(bubble);
                                            scene.addObject(group);
                                        }
                                        else {
                                            if (_this.parent.parent instanceof  PATHBUBBLES.Groups) {
                                                _this.parent.parent.objectAddToGroup(_this.parent);
                                                _this.parent.parent.objectAddToGroup(bubble);
                                                scene.addObject(_this.parent.parent);
                                            }
                                        }

                                    }
                                }
                            }
                            d3.event.preventDefault();
                        }
                        else
                        {
                            d3.event.preventDefault();
                        }
                    });

                //update if not in initialisation
                if (sortOn !== null) {
                    // update rows
                    if (sortOn != previousSort) {
                        rows.sort(function (a, b) {
                            return sort(a[sortOn], b[sortOn]);
                        });
                        previousSort = sortOn;
                    }
                    else {
                        rows.sort(function (a, b) {
                            return sort(b[sortOn], a[sortOn]);
                        });
                        previousSort = null;
                    }
                    rows.transition()
                        .duration(500)
                        .attr("transform", function (d, i) {
                            return "translate(0," + (i + 1) * (fieldHeight + 1) + ")";
                        });

                    //update cells
                    rows.selectAll("g.cell").select("text").text(function (d) {
                        return d.value;
                    });
                }
            }
        }

        function sort(a,b){
            if(typeof a == "string"){
//                var parseA = format.parse(a);
//                if(parseA){
//                    var timeA = parseA.getTime();
//                    var timeB = format.parse(b).getTime();
//                    return timeA > timeB ? 1 : timeA == timeB ? 0 : -1;
//                }
//                else
//                    return a.localeCompare(b);
                if(typeof parseFloat(a) == "number" && typeof parseFloat(b) == "number" )
                {
                    if(!isNaN( parseFloat(a) ) && !isNaN (parseFloat(b) )  )
                        return parseFloat(a) > parseFloat(b) ? 1 : parseFloat(a) == parseFloat(b) ? 0 : -1;
                    else
                        return a.localeCompare(b);
                }
                else
                    return a.localeCompare(b);
            }
            else if(typeof a == "number"){
                return a > b ? 1 : a == b ? 0 : -1;
            }
            else if(typeof a == "boolean"){
                return b ? 1 : a ? -1 : 0;
            }
        }
    }
};