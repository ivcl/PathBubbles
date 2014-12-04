/**
 * @author      Yongnan
 * @version     1.0
 * @time        10/18/2014
 * @name        PathBubble_Table
 */
PATHBUBBLES.Table = function (x, y, w, h, dbId, data, queryObject) {
    PATHBUBBLES.Object2D.call(this);
    this.type = "Table";
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 500;
    this.h = h || 500;
    this.strokeColor = "#00ffff";
    this.fillColor = "#ffffff";
    this.cornerRadius = 20;
    this.lineWidth = 10;
    this.dbId = dbId;
    this.shape = new PATHBUBBLES.Shape.Rectangle(this, this.x, this.y, this.w, this.h, this.strokeColor, this.fillColor, this.lineWidth, this.cornerRadius);
    this.menu = new PATHBUBBLES.Shape.Circle(this.x + this.w - this.cornerRadius / 2, this.y + this.cornerRadius / 2, this.lineWidth, "#ff0000", this.strokeColor, 1) || null;
    this.menuText = new PATHBUBBLES.Text(this, "M");
    this.closeMenu = new PATHBUBBLES.Shape.Circle(this.x + this.w - this.cornerRadius / 2 - this.cornerRadius -5, this.y + this.cornerRadius / 2, this.lineWidth, "#ff0000", this.strokeColor, 1);
    this.closeMenuText = new PATHBUBBLES.Text(this, "X");
    this.ungroupMenu = new PATHBUBBLES.Shape.Circle(this.x + this.w - this.cornerRadius / 2 - 2*(this.cornerRadius +5), this.y + this.cornerRadius / 2, this.lineWidth, "#ff0000", this.strokeColor, 1);
    this.ungroupMenuText = new PATHBUBBLES.Text(this, "U");

    this.button = new PATHBUBBLES.Button(this);   //Button 0 for file selection
    var tmp = '';
//    tmp += '<input type="text" id=file style="position: absolute; left:' + this.x + ' px; top:' + this.y + 'px; ">';
    tmp += '<input type="button" id=export value= "Link TO eGIFT" style="position: absolute; left:' + this.x + ' px; top:' + this.y + 25 + 'px; ">';
//    tmp += '<div id=colorpickerField style="position: absolute; left:' + this.x + ' px; top: ' + this.y + 55 + ' px; "></div>';
//    tmp += '<input type="button" id=ungroup value= "Ungroup" style="position: absolute; left:' + this.x + ' px; top:' + this.y + 80 + 'px; ">';
//    tmp += '<input type="button" id=delete value= "Delete" style="position: absolute; left:' + this.x + ' px; top:' + this.y + 105 + 'px; ">';
    this.button.addButton(tmp);

    this.name = "table";
    this.title = new PATHBUBBLES.Title(this, this.name);
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
    this.center = {x: this.x + this.w / 2, y: this.y + this.h / 2};
    this.GROUP = false;
    this.selected_file = null;
    this.data = data || null;
    this.queryObject = queryObject || null;
    this.crosstalking = null;
};

PATHBUBBLES.Table.prototype = Object.create(PATHBUBBLES.Object2D.prototype);

PATHBUBBLES.Table.prototype = {
    constructor: PATHBUBBLES.Table,
    addHtml: function () {
        this.setOffset();
        var tmp = '';
        tmp += '<div id= svg' + this.id + ' style="position: absolute;"> </div>';
        $("#bubble").append($(tmp));
        this.table = new PATHBUBBLES.D3Table(this, this.w, this.h);
        if (this.data !== undefined && this.data !== null) {
            this.table.data = this.data;
        }
        if (this.queryObject !== undefined && this.queryObject !== null) {
            this.table.init(this.queryObject.dbId, this.queryObject.symbol);
        }
        else {
            this.table.init(this.dbId);
        }
    },
    addObject: function (object) {
        var index = this.children.indexOf(object);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        this.children.push(object);
    },
    removeObject: function (object) {
        if ($('#svg' + object.id).length)
            $('#svg' + object.id).remove();
        if ($('#menuView' + object.id).length)
            $('#menuView' + object.id).remove();
        var index = PATHBUBBLES.objects.indexOf(object);
        if (index !== -1) {
            PATHBUBBLES.objects.splice(index, 1);
        }
        var index = scene.children.indexOf(object);
        if (index !== -1) {
            scene.children.splice(index, 1);
        }
    },
    menuOperation: function () {
        var _this = this;
        var $menuBarbubble = $('#menuView' + this.id);
        if(_this.name.indexOf("Expression")!==-1)
        {
            $menuBarbubble.find("#export").show();
        }
        else
        {
            $menuBarbubble.find("#export").hide();
        }
        $menuBarbubble.find("#export").on('click',function(){
            if(_this.data.length)
            {
                if(_this.data[0].gene_id!==undefined)
                {
                    var entrezIDsString = "";
                    for(var i=0; i<_this.data.length; ++i)
                    {
                        if(i!==0)
                            entrezIDsString +=",";
                        entrezIDsString +=_this.data[i].gene_id;
                    }
                    var userString = "";
                    //test from webGIVI
//                    userString +="userID=";
//                    userString +="pathbubbles";  //$userID
//                    userString +="&password=";
//                    userString +="webgiviForYongnan";  //$password
//                    userString +="&entrezIDs=";
//                    userString +=entrezIDsString;  //$entrezIDs
//                    window.open("http://raven.anr.udel.edu/~sunliang/webgivi/webgiviAPI.php?"+userString);

                    //test from eGIFT
//                    userString +="user=";
//                    userString +="liang";  //$userID
//                    userString +="&pass=";
//                    userString +="AnalysisForLiang";  //$password
//                    userString +="&entrezids=";
//                    userString +=entrezIDsString;  //$entrezIDs
//                    window.open("http://biotm.cis.udel.edu/udelafc/getGeneAnalysisResults.php?"+userString);        //connect to eGIFT

                    $.ajax({
                        type: "POST",
                        url: "./php/connect_eGIFT.php",
                        dataType: "text",
                        data: {
                            entrezIDs: entrezIDsString
                        }, // send the string directly
                        success: function (result) {
                            if (result) {
                                var lines = result.split("\n");
                                var biPartiteData = [];
                                for(var i=0; i<lines.length; ++i)
                                {
                                    if(lines[i]=="")
                                        continue;
                                    var arrays = lines[i].split(",");
                                    var string1 = arrays[0].substr(1, arrays[0].length-2).toUpperCase();
                                    var string2 = arrays[4].substr(1, arrays[4].length-2).split("  ");
                                    for(var j=0; j<string2.length; ++j)
                                    {
                                        var line = [];
                                        line.push(string1);
                                        var string2temp=string2[j].split(" (")[0].toUpperCase();
                                        line.push(string2temp);
                                        biPartiteData.push(line);

                                    }

                                }
                                if(biPartiteData.length>0)
                                {
                                    var bubble = new PATHBUBBLES.BiPartite(_this.x + _this.offsetX + _this.w-40, _this.y + _this.offsetY,600,510,biPartiteData);
                                    bubble.addHtml();
                                    if(_this.name.indexOf(")"))
                                    {
                                        bubble.name ="(Gene Symbol)"+_this.name.split(")")[1];
                                    }

                                    bubble.menuOperation();
                                    if(viewpoint)
                                    {
                                        bubble.offsetX = viewpoint.x;
                                        bubble.offsetY = viewpoint.y;
                                    }
                                    scene.addObject(bubble);

                                    if (!_this.GROUP) {
                                        var group = new PATHBUBBLES.Groups();
                                        group.objectAddToGroup(_this);
                                        group.objectAddToGroup(bubble);
                                        scene.addObject(group);
                                    }
                                    else {
                                        if (_this.parent instanceof  PATHBUBBLES.Groups) {
                                            _this.parent.objectAddToGroup(_this);
                                            _this.parent.objectAddToGroup(bubble);
                                            scene.addObject(_this.parent);
                                        }
                                    }
                                }

                            }
                        }
                    });
                }
                else
                {
                    alert("Link to eGIFT is just for expression Analysis!");
                }
            }
        });
    },
    deleteThisBubble: function(){
        var _this =this;
        if (!_this.GROUP)
            _this.deleteBubble();
        else {
            _this.ungroup();
            _this.deleteBubble();
        }
    },
    ungroup: function () {
        if (!this.GROUP) {
            alert("It is not Grouped, right now!");
        }
        else {

            this.GROUP = false;
            this.y =this.parent.children[this.parent.children.length -1].y - 20;
            this.parent.removeObject(this);
            scene.moveObjectToFront(this);
            this.parent = scene;
        }
    },
    deleteBubble: function () {
        if ($('#svg' + this.id).length)
            $('#svg' + this.id).remove();
        if ($('#menuView' + this.id).length)
            $('#menuView' + this.id).remove();
        scene.removeObject(this);
    },
    updateMenu: function () {
        var $menuBarbubble = $('#menuView' + this.id);
        $menuBarbubble.css({
            left: this.x + this.offsetX + this.w + 10,
            top: this.y + this.offsetY + this.cornerRadius / 2 + 40,
            width: 200,
            height: 80
        });
        $menuBarbubble.find('#export').css({
            left: 10,
            top: 25,
            width: 180
        });

    },
    draw: function (ctx, scale) {
        this.setOffset();

        ctx.save();
        this.shape.draw(ctx, scale);
        var space = 6;

        $('#svg' + this.id).css({
            width: this.w - 15 - space,      //leve 6 space for tree ring
            height: this.h - 20 - space,
            left: this.x + space / 2+5,
            top: this.y + this.h / 2 - this.table.h / 2 + 50 + 10 + space / 2+5
        });
        //
        this.shape.drawStrokeAgain(ctx, scale);
        ctx.restore();
        if (this.title !== undefined) {
            var num = 12;
            while (num > 6) {
                if (this.title.text.getTextWidth(num, ctx) < this.title.w) {
                    break;
                }
                else {
                    num--
                }
            }
            this.title.text.setFontSize(num);
            this.title.name = this.name;
            if (this.title.text.getTextWidth(num, ctx) > this.title.w)
            {
                this.title.WrapText= true;
            }
            this.title.draw(ctx, scale);
        }
        ctx.save();
        if(this.menu && scale == 1)
        {
            this.menu.draw(ctx, scale);
            this.menuText.fillColor = "#f00";
            this.menuText.font = '15pt Calibri';
            this.menuText.draw(ctx, this.menu.x, this.menu.y);
        }
        if (this.closeMenu && scale == 1) {
            this.closeMenu.draw(ctx, scale);
            this.closeMenuText.fillColor = "#f00";
            this.closeMenuText.font = '15pt Calibri';
            this.closeMenuText.draw(ctx, this.closeMenu.x, this.closeMenu.y);
        }
        if(this.ungroupMenu.HighLight_State)
        {
            this.ungroupMenuText.text = "G";
        }
        else
        {
            this.ungroupMenuText.text = "U";
        }
        if(this.ungroupMenu && scale == 1)
        {
            this.ungroupMenu.draw(ctx, scale);
            this.ungroupMenuText.fillColor = "#f00";
            this.ungroupMenuText.font = '15pt Calibri';
            this.ungroupMenuText.draw(ctx, this.ungroupMenu.x, this.ungroupMenu.y);
        }
        ctx.restore();
        if (this.menu.HighLight_State) {
            this.updateMenu();
            this.button.show();
        }
        else {
            this.updateMenu();
            this.button.hide();
        }
        if (this.shape.HighLight_State) {
            ctx.save();
            this.shape.drawStroke(ctx, scale);
            ctx.restore();
        }

    },
    setOffset: function () {
        if (this.parent !== undefined) {
            this.offsetX = this.parent.x;
            this.offsetY = this.parent.y;
        }
        else {
            this.offsetX = 0;
            this.offsetY = 0;
        }
//        this.w = Math.max(this.w, $("#svg" + this.id).children("table").width()+40);
        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
        this.shape.x = this.x;
        this.shape.y = this.y;
        this.menu.x = this.x + this.w - this.cornerRadius / 2;
        this.menu.y = this.y + this.cornerRadius / 2;
        this.ungroupMenu.x = this.x + this.w - this.cornerRadius / 2 - (this.cornerRadius +5)*2;
        this.ungroupMenu.y = this.y + this.cornerRadius / 2;
        this.closeMenu.x = this.x + this.w - this.cornerRadius / 2 - this.cornerRadius -5;
        this.closeMenu.y = this.y + this.cornerRadius / 2;
        this.shape.w = this.w;
        this.shape.h = this.h;
    },
    drawSelection: function (ctx, scale) {
        var i, cur, half;
        var x = this.shape.offsetX + this.shape.x;
        var y = this.shape.offsetY + this.shape.y;

        var w = this.shape.w;
        var h = this.shape.h;
        if (this.GROUP) {
            x -= 6;
            y -= 6;
            w += 12;
            h += 12;
        }
        // draw the boxes
        half = PATHBUBBLES.selectionBoxSize / 2;
        // 0  1  2
        // 3     4
        // 5  6  7
        // top left, middle, right
        PATHBUBBLES.selectionHandles[0].x = x - half;
        PATHBUBBLES.selectionHandles[0].y = y - half;

        PATHBUBBLES.selectionHandles[1].x = x + w / 2 - half;
        PATHBUBBLES.selectionHandles[1].y = y - half;

        PATHBUBBLES.selectionHandles[2].x = x + w - half;
        PATHBUBBLES.selectionHandles[2].y = y - half;

        //middle left
        PATHBUBBLES.selectionHandles[3].x = x - half;
        PATHBUBBLES.selectionHandles[3].y = y + h / 2 - half;

        //middle right
        PATHBUBBLES.selectionHandles[4].x = x + w - half;
        PATHBUBBLES.selectionHandles[4].y = y + h / 2 - half;

        //bottom left, middle, right
        PATHBUBBLES.selectionHandles[6].x = x + w / 2 - half;
        PATHBUBBLES.selectionHandles[6].y = y + h - half;

        PATHBUBBLES.selectionHandles[5].x = x - half;
        PATHBUBBLES.selectionHandles[5].y = y + h - half;

        PATHBUBBLES.selectionHandles[7].x = x + w - half;
        PATHBUBBLES.selectionHandles[7].y = y + h - half;

        for (i = 0; i < 8; i += 1) {
            cur = PATHBUBBLES.selectionHandles[i];
//            ctx.save();	// save the context so we don't mess up others
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(cur.x * scale, cur.y * scale, PATHBUBBLES.selectionBoxSize * scale, PATHBUBBLES.selectionBoxSize * scale);
//            ctx.restore();
        }
    },
    contains: function (mx, my) {
        return this.shape.contains(mx, my);
    },
    insideRect: function (mx, my, x, y, w, h) {
        return  (x <= mx) && (x + w >= mx) && (y <= my) && (y + h >= my);
    },
    containsInMenu: function (mx, my) {

        var x = this.menu.x;
        var y = this.menu.y;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= this.menu.r * this.menu.r;
    },
    containsInCloseMenu: function (mx, my) {
        var x = this.closeMenu.x;
        var y = this.closeMenu.y;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= this.closeMenu.r * this.closeMenu.r;
    },
    containsInUnGroupMenu: function (mx, my) {
        var x = this.ungroupMenu.x;
        var y = this.ungroupMenu.y;
        return  (x - mx ) * (x - mx) + (y - my ) * (y - my) <= this.ungroupMenu.r * this.ungroupMenu.r;
    },
    containsInHalo: function (mx, my) {
        if(this.title.contains(mx,my))
            return true;
        var x = this.shape.offsetX + this.shape.x + 5;
        var y = this.shape.offsetY + this.shape.y + 5;
        var w = this.shape.w - 10;
        var h = this.shape.h - 10;

        var x2 = this.shape.offsetX + this.shape.x - 5;
        var y2 = this.shape.offsetY + this.shape.y - 5;
        var w2 = this.shape.w + 10;
        var h2 = this.shape.h + 10;
        return (!this.insideRect(mx, my, x, y, w, h) && this.insideRect(mx, my, x2, y2, w2, h2));
    },
    containsInsideBubble: function (mx, my) {
        var x = this.shape.offsetX + this.shape.x + 5;
        var y = this.shape.offsetY + this.shape.y + 5;
        var w = this.shape.w - 10;
        var h = this.shape.h - 10;
        return this.insideRect(mx, my, x, y, w, h);
    },
    clone: function () {
        var bubble = new PATHBUBBLES.Bubble();
        bubble.id = this.id;
        bubble.name = this.name;
        bubble.parent = this.parent;
        for (var i = 0; i < this.children.length; ++i) {
            var a = this.children[i];
            if (bubble.children.indexOf(a) == -1)
                bubble.children.push(a);
        }

        bubble.type = this.type;
        bubble.x = this.x;
        bubble.y = this.y;
        bubble.w = this.w;
        bubble.h = this.h;
        bubble.strokeColor = this.strokeColor;
        bubble.fillColor = this.fillColor;
        bubble.cornerRadius = this.cornerRadius;

        bubble.shape = new PATHBUBBLES.Shape.Rectangle(this.x, this.y, this.w, this.h, this.strokeColor, this.fillColor, 10, this.cornerRadius);
        bubble.offsetX = this.offsetX;
        bubble.offsetY = this.offsetY;

        bubble.center = this.center;
        bubble.GROUP = this.GROUP;
        return bubble;
    }
};
