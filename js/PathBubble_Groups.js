/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/17/2014
 * @name        PathBubble_groups
 *              Attempt to put the bubbles from left to right
 */
PATHBUBBLES.Groups = function () {
    PATHBUBBLES.Object2D.call(this);
    this.shape = new PATHBUBBLES.Shape.Path("#0000ff", "#ffffff", 10);
    this.type = "Group";
    this.arranged = [];
    this.tempPoints = [];
};
PATHBUBBLES.Groups.prototype = Object.create(PATHBUBBLES.Object2D.prototype);
PATHBUBBLES.Groups.prototype = {

    constructor: PATHBUBBLES.Groups,
    removeObject: function (object) {
//        console.log(object.id);
        var index = this.children.indexOf(object);
        if(index !== -1)
            this.children.splice(index, 1);
        if(this.children.length==1)
        {
//            var objectC = this.children[0];
            this.children[0].parent = scene;
            this.children[0].GROUP = false;
            scene.removeBasicObject(this);
            return;
        }
        for(var i=0; i<this.children.length-1; ++i)
        {
            this.children[i+1].x = this.children[i].x + this.children[i].w;
            this.children[i+1].y = this.children[i].y ;
        }
    },
    addToGroup: function (object) {
        if(this.children.indexOf(object)!== -1)
            return;
        if (object.parent instanceof PATHBUBBLES.Groups) {
            var temp = object.parent;
            var childrenObjs = [];
            for (var i = 0; i < object.parent.children.length; ++i) {
                var a = object.parent.children[i];
                childrenObjs.push(a);
            }

            for (var i = 0; i < childrenObjs.length; ++i) {
                this.objectAddToGroup(childrenObjs[i]);
            }
            scene.removeBasicObject(temp);   //removeObject     //fix a bug
        }
        else {
            this.objectAddToGroup(object);
        }

    },
    objectAddToGroup: function (object) {
        if(object)
        {
            object.GROUP = true;
            object.parent = this;
            object.offsetX = this.offsetX;
            object.offsetY = this.offsetY;
            if(!this.children.length)
            {
                if(this.children.indexOf(object)== -1)
                    this.children.push(object);
            }
            else
            {
                var overlappedObjects = [];
                for(var i=0; i< this.children.length; ++i)
                {
                    if(this.children[i] !== object)
                    {
                        if(this.detectOverlap(this.children[i],object))
                        {
                            this.children[i].InsertIndex = i;
                            overlappedObjects.push(this.children[i]);
                        }
                    }
                }
                var minDistance=Infinity;
                var minObject = null;
                for(var i=0; i<overlappedObjects.length; ++i)
                {
                    var dis = this.calculateDistance(object, overlappedObjects[i]);
                     if( dis<= minDistance)
                     {
                          minDistance = dis;
                         minObject = overlappedObjects[i];
                     }
                }
                if(minObject)
                {
                    if(minObject.InsertIndex !== undefined)
                    {
                        this.children.splice(minObject.InsertIndex+1, 0, object);

                        for(var i=0; i<this.children.length-1; ++i)
                        {
                            this.children[i+1].x = this.children[i].x + this.children[i].w;
                            this.children[i+1].y = this.children[i].y ;
                        }
                    }
                }
            }
        }
    },
    resetPosition: function(){
        for(var i=0; i<this.children.length-1; ++i)
        {
            this.children[i+1].x = this.children[i].x + this.children[i].w;
            this.children[i+1].y = this.children[i].y ;
        }
    },
    calculateDistance: function(object1, object2)
    {
         var centerObj1={
             x: object1.x + object1.w/2,
             y: object1.y + object1.h/2
         };
         var centerObj2 = {
            x: object2.x + object2.w/2,
            y: object2.y + object2.h/2
         };
         return Math.sqrt((centerObj1.x - centerObj2.x)*(centerObj1.x - centerObj2.x) + (centerObj1.y - centerObj2.y)*(centerObj1.y - centerObj2.y));
    },
    detectOverlap: function (object1, object2) {
        return (object1.x < object2.x + object2.w &&
            object1.x + object1.w > object2.x &&
            object1.y < object2.y + object2.h &&
            object1.h + object1.y > object2.y) ||
            (object2.x < object1.x + object1.w &&
                object2.x + object2.w > object1.x &&
                object2.y < object1.y + object1.h &&
                object2.h + object2.y > object1.y);
    },
    setOffset: function () {
        this.shape.offsetX = this.offsetX;
        this.shape.offsetY = this.offsetY;
    },
    draw: function (ctx, scale) {

//        if (this.shape.points.length) {
//            this.setOffset();
//            //ctx.save();
////            this.shape.draw(ctx, scale);
////
////            for (var i = 0; i < this.children.length; ++i) {
////                this.children[i].draw(ctx, scale);
////            }
//            //ctx.restore();
//        }
    }
};
