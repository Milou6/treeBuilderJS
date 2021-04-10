fabric.Arrow = fabric.util.createClass(fabric.Polyline, {
    // Type below must be 'polyline' for SVG export to work properly
    type: 'arrow',

    /**
     * 
     */
    initialize: function (arrowStart, arrowEnd, options) {
        options || (options = {});
        // callSuper() to initialize fabricJS Polyline
        this.callSuper('initialize', options);
        this.arrowStart = arrowStart;
        this.arrowEnd = arrowEnd;
        this.historyID = setHistoryID();
        this.handlers = [];

        this.startCoords = { x: arrowStart.left, y: arrowStart.top };
        this.endCoords = { x: this.startCoords.x - arrowEnd.left, y: this.startCoords.y - arrowEnd.top };
        // let width = 

        this.set({ width: this.endCoords.x, height: this.endCoords.y, originX: 'right', originY: 'bottom' });
        this.set({ left: this.startCoords.x, top: this.startCoords.y, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: false });
        this.setCoords();

        this.points.push(
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: -this.endCoords.x, y: 0 },
            { x: -this.endCoords.x, y: -this.endCoords.y },
            { x: -this.endCoords.x, y: -this.endCoords.y }
        );

        this.set({ pathOffset: { x: -this.width / 2, y: -this.height / 2 } });

        this.initArrowHandlers();
        // this.sendBackwards();



    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        // send node to back, to make sure hoverCircles are clickable
        // canvas.sendToBack(this);
    },

    initArrowHandlers: function () {
        // console.log('init');
        // var handler1 = new fabric.ArrowHandler(this, {
        //     left: this.left - (this.endCoords.x / 2),
        //     top: this.top,
        //     originX: 'center',
        //     originY: 'center',
        //     fill: 'yellow',
        //     width: 25,
        //     height: 10,
        //     lockMovementX: true,
        //     handlerType: 'bottom'
        // });
        // var handler2 = new fabric.ArrowHandler(this, {
        //     left: this.left - this.endCoords.x,
        //     top: this.top - (this.endCoords.y / 2),
        //     originX: 'center',
        //     originY: 'center',
        //     fill: 'yellow',
        //     width: 10,
        //     height: 25,
        //     lockMovementY: true,
        //     handlerType: 'top'
        // });
        // canvas.add(handler1, handler2);

        var circleHandler = new fabric.CircleHandler(this, {
            top: this.top,
            left: this.left - this.endCoords.x,
            originX: 'center',
            originY: 'center',
            fill: 'blue',
            radius: 10

        });
        canvas.add(circleHandler);
        canvas.renderAll();



    }
});


fabric.Arrow.fromObject = function (object, callback) {
    console.log('fromObject() called');
    return fabric.Object._fromObject('Arrow', object, callback);
};

// extending toObject for JSON serialization
fabric.Arrow.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrowStart: this.arrowStart,
            arrowEnd: this.arrowEnd,

            initArrowHandlers: this.initArrowHandlers
        });
    };
})(fabric.Arrow.prototype.toObject);


// standard options type:
// fabric.Polyline.fromObject = function (object, callback) {
//     return fabric.Object._fromObject('Polyline', object, callback);
// }

// fabric.Object.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes"]);
// console.log(fabric.Object.prototype.stateProperties);
// console.log(fabric.TreeNode);








///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

fabric.CircleHandler = fabric.util.createClass(fabric.Circle, {
    type: 'circleHandler',

    /**
     * 
     */
    initialize: function (arrow, options) {
        options || (options = {});
        // callSuper() to initialize fabricJS Circle
        this.callSuper('initialize', options);
        this.arrow = arrow;
        this.historyID = setHistoryID();
        this.relativeX = this.left - this.arrow.arrowStart.left;
        this.relativeY = this.top - this.arrow.arrowStart.top;

        this.set({ hasControls: false, hasBorders: false, opacity: 0.4 });
        // this.bringToFront();
        // this.arrow.sendBackwards();

        this.on('mouseover', function () {
            this.set({ opacity: 1 });
        });
        this.on('mouseout', function () {
            this.set({ opacity: 0.4 });
        });

        this.on('moved', function () {
            this.arrow.set({ width: Math.abs(this.left - this.arrow.arrowStart.left), height: Math.abs(this.top - this.arrow.arrowEnd.top) });
            this.arrow.set({ top: this.top });
            this.arrow.set({ pathOffset: { x: -this.arrow.width / 2, y: -this.arrow.height / 2 } });

            this.arrow.setCoords();

            console.log(this.arrow.arrowStart.left);
            console.log(this.arrow.arrowStart.top);
            this.relativeX = this.left - this.arrow.arrowStart.left;
            this.relativeY = this.top - this.arrow.arrowStart.top;

            // this.arrow.points[2].x = this.relativeX;
            // this.arrow.points[2].y = this.relativeY;


            this.arrow.points.length = 0;
            this.arrow.points.push(
                { x: 0, y: -this.relativeY },
                { x: 0, y: 0 },
                { x: this.relativeX, y: 0 },
                { x: this.relativeX, y: this.arrow.arrowEnd.top - this.arrow.top },
                { x: this.relativeX + (this.arrow.arrowEnd.left - this.left), y: this.arrow.arrowEnd.top - this.arrow.top }
                // { x: this.left - this.arrow.arrowEnd.left, y: this.arrow.arrowEnd.top - this.arrow.top }
                // { x: -this.arrow.endCoords.x, y: -this.arrow.endCoords.y }
            );



            this.arrow.set({ dirty: true });
            this.arrow.setCoords();

            canvas.renderAll();
            canvas.sendToBack(this.arrow);
        });





    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        this.bringToFront();
    },

    // isMovePermitted: function (moveDestination) {
    //     if (this.handlerType == 'top') {
    //         let limit = this.arrow.left - this.arrow.endCoords.x;
    //         // console.log(limit);
    //         // console.log(moveDestination.x);

    //         if (limit < moveDestination.x) {
    //             return true;
    //         }
    //         else { return false; }

    //     }
    // }
});


fabric.CircleHandler.fromObject = function (object, callback) {
    // console.log('fromObject() called');
    return fabric.Object._fromObject('CircleHandler', object, callback);
};

// extending toObject for JSON serialization
fabric.CircleHandler.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            // arrowStart: this.arrowStart,
            // arrowEnd: this.arrowEnd
        });
    };
})(fabric.CircleHandler.prototype.toObject);


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////


fabric.ArrowHandler = fabric.util.createClass(fabric.Rect, {
    type: 'arrowHandler',

    /**
     * 
     */
    initialize: function (arrow, options) {
        options || (options = {});
        // callSuper() to initialize fabricJS Polyline
        this.callSuper('initialize', options);
        this.arrow = arrow;
        this.historyID = setHistoryID();

        this.set({ hasControls: false, hasBorders: false, opacity: 0.4 });
        // this.bringToFront();
        // this.arrow.sendBackwards();

        this.on('mouseover', function () {
            this.set({ opacity: 1 });
        });
        this.on('mouseout', function () {
            this.set({ opacity: 0.4 });
        });





    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        this.bringToFront();
    },

    isMovePermitted: function (moveDestination) {
        if (this.handlerType == 'top') {
            let limit = this.arrow.left - this.arrow.endCoords.x;
            // console.log(limit);
            // console.log(moveDestination.x);

            if (limit < moveDestination.x) {
                return true;
            }
            else { return false; }

        }
    }
});


fabric.ArrowHandler.fromObject = function (object, callback) {
    // console.log('fromObject() called');
    return fabric.Object._fromObject('ArrowHandler', object, callback);
};

// extending toObject for JSON serialization
fabric.ArrowHandler.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrowStart: this.arrowStart,
            arrowEnd: this.arrowEnd
        });
    };
})(fabric.ArrowHandler.prototype.toObject);

