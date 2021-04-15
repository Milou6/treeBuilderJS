fabric.Polyline.prototype.arrowInitSequence = function () {
    if (this.arrowEnd.left > this.arrowStart.left) {
        this.direction = 'rightwards';
        // if the wrong pointer selected, correct it
        if (this.arrowStart.textSide == 'left') {
            // get pointerCircle just across from current one
            let index = this.arrowStart.textNode.pointerCircles.indexOf(this.arrowStart) + 1;
            // remove .arrow attr
            this.arrowStart.arrow = null;
            this.arrowStart = this.arrowStart.textNode.pointerCircles[index];
            this.arrowStart.arrow = this;
        }

    }
    else {
        this.direction = 'leftwards';
        // if the wrong pointer selected, correct it
        if (this.arrowStart.textSide == 'right') {
            // get pointerCircle just across from current one
            let index = this.arrowStart.textNode.pointerCircles.indexOf(this.arrowStart) - 1;
            // remove .arrow attr
            this.arrowStart.arrow = null;
            this.arrowStart = this.arrowStart.textNode.pointerCircles[index];
            this.arrowStart.arrow = this;
        }
    }


    this.distanceStartEndX = Math.abs(this.arrowStart.left - this.arrowEnd.left);
    this.distanceStartEndY = Math.abs(this.arrowStart.top - this.arrowEnd.top);
    if (this.direction == 'leftwards') {
        // this.set({ width: this.endCoords.x, height: this.endCoords.y, originX: 'right', originY: 'bottom' });
        this.set({ width: this.distanceStartEndX, height: this.distanceStartEndY, originX: 'right', originY: 'bottom' });


        this.set({ left: this.arrowStart.left, top: this.arrowStart.top, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: false });
        this.setCoords();

        this.points.length = 0;
        this.points.push(
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: -this.distanceStartEndX, y: 0 },
            { x: -this.distanceStartEndX, y: -this.distanceStartEndY },
            { x: -this.distanceStartEndX, y: -this.distanceStartEndY }
        );

        // without offset, path would start on middle of boundingRect
        // (instead of bottom corner as we want)
        this.set({ pathOffset: { x: -this.width / 2, y: -this.height / 2 } });
    }

    // direction == rightwards
    else {
        this.set({ width: this.distanceStartEndX, height: this.distanceStartEndY, originX: 'left', originY: 'bottom' });


        this.set({ left: this.arrowStart.left, top: this.arrowStart.top, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: false });
        this.setCoords();

        this.points.length = 0;
        this.points.push(
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: +this.distanceStartEndX, y: 0 },
            { x: +this.distanceStartEndX, y: -this.distanceStartEndY },
            { x: +this.distanceStartEndX, y: -this.distanceStartEndY }
        );

        this.set({ pathOffset: { x: +this.width / 2, y: -this.height / 2 } });
    }

    // this.sendBackwards();
    // canvas.sendToBack(this); //Maybe this is adding arrow a 2nd time
}

fabric.Polyline.prototype.initArrowHandlers = function () {
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

    var posX = 1;
    if (this.direction == 'leftwards') { posX = -1; }

    var circleHandler = new fabric.CircleHandler(this, {
        top: this.top,
        left: this.left + posX * this.distanceStartEndX,
        originX: 'center',
        originY: 'center',
        fill: 'blue',
        radius: 10

    });
    canvas.add(circleHandler);
    canvas.renderAll();
    this.circleHandler = circleHandler;
}

fabric.Polyline.prototype.initArrowTips = function () {
    let angleTip1 = this.arrowStart.textSide == 'left' ? 90 : 270;
    let angleTip2 = this.arrowEnd.textSide == 'left' ? 90 : 270;

    let nudgeTip1 = this.arrowStart.textSide == 'left' ? +5 : -5;
    let nudgeTip2 = this.arrowEnd.textSide == 'left' ? +5 : -5;

    let tip1 = new fabric.Triangle({
        width: 10,
        height: 10,
        fill: 'black',
        hasControls: false,
        hasBorders: false,
        selectable: false,
        padding: 4,
        left: this.arrowStart.left + nudgeTip1,
        top: this.arrowStart.top,
        originX: 'center',
        originY: 'center',
        angle: angleTip1,
        pointer: this.arrowStart,
        historyID: setHistoryID()
    });
    this.tipStart = tip1;
    let tip2 = new fabric.Triangle({
        width: 10,
        height: 10,
        fill: 'black',
        hasControls: false,
        hasBorders: false,
        selectable: false,
        padding: 4,
        left: this.arrowEnd.left + nudgeTip2,
        top: this.arrowEnd.top,
        originX: 'center',
        originY: 'center',
        angle: angleTip2,
        pointer: this.arrowEnd,
        historyID: setHistoryID()
    });
    this.tipEnd = tip2;

    canvas.add(tip1, tip2);
    canvas.renderAll();
}

fabric.Polyline.prototype.updateArrowPosition = function () {
    this.arrowInitSequence();
    this.circleHandler.set({ left: this.left + this.points[2].x, top: this.top + this.points[2].y });
    this.circleHandler.bringToFront();
    this.circleHandler.setCoords();

    // update arrowTip positions
    let nudgeTip2 = this.arrowEnd.textSide == 'left' ? +5 : -5;
    this.tipStart.set({
        left: this.arrowStart.left,
        top: this.arrowStart.top,
    });
    this.tipEnd.set({
        left: this.arrowEnd.left + nudgeTip2,
        top: this.arrowEnd.top,
    });
    this.tipStart.setCoords();
    this.tipEnd.setCoords();

    this.sendBackwards();
    canvas.sendToBack(this);
}





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
        this.tipStart = null;
        this.tipEnd = null;
        this.circleHandler = null;
        this.historyID = setHistoryID();
        this.handlers = [];

        this.arrowInitSequence();
        this.initArrowHandlers();
        this.initArrowTips();
        this.sendBackwards();
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        // send node to back, to make sure hoverCircles are clickable
        // canvas.sendToBack(this);
    }
});


fabric.Arrow.fromObject = function (object, callback) {
    console.log('fromObject() called');
    return fabric.Object._fromObject('Polyline', object, callback, 'points');
};




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

        this.on('mouseover', circleHandlerMouseOver);
        this.on('mouseout', circleHandlerMouseOut);
        this.on('moved', circleHandlerMoved);
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


function circleHandlerMouseOver(e) {
    e.target.set({ opacity: 1 });
}
function circleHandlerMouseOut(e) {
    e.target.set({ opacity: 0.4 });
}

function circleHandlerMoved() {
    // before changing anything, check that handlerCircle isn't out of bounds
    this.relativeX = this.left - this.arrow.arrowStart.left;
    this.relativeY = this.top - this.arrow.arrowStart.top; // Should be calc now for check to work

    // console.log(Math.abs(this.relativeY));
    // console.log(Math.abs(this.arrow.points[4].y));
    if (Math.abs(this.relativeX) < Math.abs(this.arrow.points[4].x)) {
        this.set({ left: this.arrow.arrowEnd.left });
        // if position was corrected, gotta recalc relativeX
        this.relativeX = this.left - this.arrow.arrowStart.left;
    }
    if (this.relativeY < 0) {
        this.set({ top: this.arrow.arrowStart.top });
        // if position was corrected, gotta recalc relativeY
        this.relativeY = this.top - this.arrow.arrowStart.top;
    }


    // Switching pointerCircles of arrowEnd from left to right side if needed
    if (this.arrow.direction == 'rightwards') {
        let arrowCrossesOverText = Math.abs(this.relativeX) > Math.abs(this.arrow.arrowStart.left - this.arrow.arrowEnd.left);
        // if extended arrow crosses over text, gotta switch arrowEnd to right one
        if (this.arrow.arrowEnd.textSide == 'left' && arrowCrossesOverText) {
            let index = this.arrow.arrowEnd.textNode.pointerCircles.indexOf(this.arrow.arrowEnd) + 1;
            // remove .arrow attr
            this.arrow.arrowEnd.arrow = null;
            this.arrow.arrowEnd = this.arrow.arrowEnd.textNode.pointerCircles[index];
            this.arrow.arrowEnd.arrow = this.arrow;
            // console.log(this.arrow.arrowEnd);
            // gotta replace the tip too
            this.arrow.tipEnd.set({ left: this.arrow.arrowEnd.left - 5, angle: 270 });
        }
    }
    // direction = leftwards
    else {
        let arrowCrossesOverText = Math.abs(this.relativeX) > Math.abs(this.arrow.arrowStart.left - this.arrow.arrowEnd.left);
        // if extended arrow crosses over text, gotta switch arrowEnd to left one
        if (this.arrow.arrowEnd.textSide == 'right' && arrowCrossesOverText) {
            let index = this.arrow.arrowEnd.textNode.pointerCircles.indexOf(this.arrow.arrowEnd) - 1;
            // remove .arrow attr
            this.arrow.arrowEnd.arrow = null;
            this.arrow.arrowEnd = this.arrow.arrowEnd.textNode.pointerCircles[index];
            this.arrow.arrowEnd.arrow = this.arrow;
            // gotta replace the tip too
            this.arrow.tipEnd.set({ left: this.arrow.arrowEnd.left + 5, angle: 90 });
        }
    }


    // After out-of-bounds check, we can continue
    // recalc the arrow boundingRect
    this.arrow.set({ width: Math.abs(this.left - this.arrow.arrowStart.left), height: Math.abs(this.top - this.arrow.arrowEnd.top) });
    this.arrow.set({ top: this.top });

    if (this.arrow.direction == 'leftwards') {
        this.arrow.set({ pathOffset: { x: -this.arrow.width / 2, y: -this.arrow.height / 2 } });
    }
    else {
        this.arrow.set({ pathOffset: { x: +this.arrow.width / 2, y: -this.arrow.height / 2 } });
    }
    this.arrow.setCoords();

    // console.log(this.arrow.arrowStart.left);
    // console.log(this.arrow.arrowStart.top);

    // this.relativeX = this.left - this.arrow.arrowStart.left;
    // this.relativeY = this.top - this.arrow.arrowStart.top;

    // redraw the arrow path
    this.arrow.points.length = 0;
    this.arrow.points.push(
        { x: 0, y: -this.relativeY },
        { x: 0, y: 0 },
        { x: this.relativeX, y: 0 },
        { x: this.relativeX, y: this.arrow.arrowEnd.top - this.arrow.top },
        { x: this.relativeX + (this.arrow.arrowEnd.left - this.left), y: this.arrow.arrowEnd.top - this.arrow.top }
    );

    this.arrow.set({ dirty: true });
    this.arrow.setCoords();

    canvas.renderAll();
    canvas.sendToBack(this.arrow);
    this.bringToFront(); //Handler always in front
    this.setCoords();
}

fabric.CircleHandler.fromObject = function (object, callback) {
    // console.log('fromObject() called');
    return fabric.Object._fromObject('Circle', object, callback);
};



///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////


// fabric.ArrowHandler = fabric.util.createClass(fabric.Rect, {
//     type: 'arrowHandler',

//     /**
//      * 
//      */
//     initialize: function (arrow, options) {
//         options || (options = {});
//         // callSuper() to initialize fabricJS Polyline
//         this.callSuper('initialize', options);
//         this.arrow = arrow;
//         this.historyID = setHistoryID();

//         this.set({ hasControls: false, hasBorders: false, opacity: 0.4 });
//         // this.bringToFront();
//         // this.arrow.sendBackwards();

//         this.on('mouseover', function () {
//             this.set({ opacity: 1 });
//         });
//         this.on('mouseout', function () {
//             this.set({ opacity: 0.4 });
//         });





//     },

//     _render: function (ctx) {
//         this.callSuper('_render', ctx);
//         this.bringToFront();
//     },

//     isMovePermitted: function (moveDestination) {
//         if (this.handlerType == 'top') {
//             let limit = this.arrow.left - this.arrow.endCoords.x;
//             // console.log(limit);
//             // console.log(moveDestination.x);

//             if (limit < moveDestination.x) {
//                 return true;
//             }
//             else { return false; }

//         }
//     }
// });


// fabric.ArrowHandler.fromObject = function (object, callback) {
//     // console.log('fromObject() called');
//     return fabric.Object._fromObject('ArrowHandler', object, callback);
// };

// // extending toObject for JSON serialization
// fabric.ArrowHandler.prototype.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             arrowStart: this.arrowStart,
//             arrowEnd: this.arrowEnd
//         });
//     };
// })(fabric.ArrowHandler.prototype.toObject);



