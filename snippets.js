// // reference canvas element (with id="treeCanvas")
// var canvasEl = document.getElementById('treeCanvas');

// // get 2d context to draw on (the "bitmap" mentioned earlier)
// var ctx = canvasEl.getContext('2d');

// // set fill color of context
// ctx.fillStyle = 'blue';

// // create rectangle at a 100,100 point, with 20x20 dimensions
// ctx.fillRect(100, 100, 20, 20);




// canvas.on('mouse:down', function (options) {
//     console.log(options.e.clientX, options.e.clientY);
//     if (options.target) {
//         console.log('an object was clicked! ', options.target.type);
//     }
// });



// create a rectangle object
var rect = new fabric.Rect({
    left: 300,
    top: 300,
    fill: 'red',
    width: 20,
    height: 20,
    angle: 30
});

// "add" rectangle onto canvas
// canvas.add(rect);

// move the rect object on the canvas
// rect.set({ left: 20, top: 50 }); // makes the square unmovable
rect.set({ strokeWidth: 5, stroke: 'rgba(100,200,200,0.5)' });
rect.set('angle', 15).set('flipY', true).set('skewY', 30);
canvas.renderAll();

// some useful canvas methods
canvas.item(0); // reference fabric.Rect added earlier (first object)
console.log(canvas.getObjects()); // get all objects on canvas (rect will be first and only)

rect.animate('left', 450, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeOutBounce
});

// canvas.remove(rect); // remove previously-added fabric.Rect

// draw more shapes
var circle = new fabric.Circle({
    radius: 20,
    fill: 'green',
    left: 100,
    top: 100
});
var triangle = new fabric.Triangle({
    width: 20,
    height: 30,
    fill: 'blue',
    left: 50,
    top: 50
});

// canvas.add(circle, triangle);






// 3rd version of TreeNode (trying to fix originX and originY problem)
var TreeNode = fabric.util.createClass(fabric.Polyline, {
    type: 'treeNode',

    initialize: function (X, Y, armsArray, nodeParent, hoverParent, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.armsArray = armsArray;
        this.nodeParent = nodeParent;
        this.hoverParent = hoverParent;
        this.hoverCircles = [];
        this.textNodes = [];
        // this.group = new fabric.Group([]);
        // this.group.add(this);
        let vertOffset = getVertOffset(this.armsArray);
        let nodeWidth = getNodeWidth(this.armsArray);
        console.log(nodeWidth);
        let horizOffset = getHorizOffset(this.armsArray);
        console.log(horizOffset);

        for (point of this.armsArray) {
            // adding the arm coords to the polyline points
            this.points.push({ x: point[0] - horizOffset, y: point[1] - vertOffset });
            // this.points.push({ x: 0, y: 0 - vertOffset });
            this.points.push({ x: 0 - horizOffset, y: 0 - vertOffset });

            // creating the bottom hoverCircles for each arm
            var hoverCircle = new HoverCircle(this.X + point[0] - 12, this.Y + point[1] - 12, 'bottom', this);
            canvas.add(hoverCircle);
            this.hoverCircles.push(hoverCircle);

            // creating the bottom textNodes
            var textNode = new NodeText(this.X + point[0] - 12, this.Y + point[1] - 12 + 20, 'XP');
            canvas.add(textNode);
            this.textNodes.push(textNode);
        }
        // creating the top hoverCircle
        var topHoverCircle = new HoverCircle(this.X - 12, this.Y - 12, 'top', this);
        canvas.add(topHoverCircle);
        this.hoverCircles.push(topHoverCircle);

        this.set({ left: X + horizOffset, top: Y + vertOffset, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: true });
        this.set({ width: nodeWidth, height: vertOffset * 2, originX: 'center', originY: 'center' });
        // this.set('label', options.label || '');

        // creating the nodeText for each hoverCircle
        // for(circle of this.hoverCircles) {

        // }

    },
    _render: function (ctx) {
        this.callSuper('_render', ctx);
        console.log('rendering');
        // RESET points
        // this.points = [];
    },
    changeArms: function (newArray) {
        let oldArmsArray = this.armsArray;
        this.points = [];
        let point = [];
        let horizOffset = getHorizOffset(newArray);
        let vertOffset = getVertOffset(newArray);
        let nodeWidth = getNodeWidth(newArray);
        console.log(`horizOffset : ${horizOffset}`);
        this.armsArray = newArray;

        // why don't I have to update top coords too below??
        this.set({ width: nodeWidth, left: this.left + horizOffset });

        // for (point of newArray) {
        for (let i = 0; i < newArray.length; i++) {
            point = newArray[i];
            // adding the arm coords to the polyline points
            this.points.push({ x: point[0] - horizOffset, y: point[1] - vertOffset });
            this.points.push({ x: 0 - horizOffset, y: 0 - vertOffset });

            // console.log(`old X : ${this.hoverCircles[i].X} new X : ${this.X + point[0] - 12}`);
            // console.log(`old Y : ${this.hoverCircles[i].Y} new Y : ${this.Y + point[1] - 12}`);

            // updating the hoverCircle coords to keep them on node edges
            // for X : get oldX + difference between new armX and old armX
            this.hoverCircles[i].set({ X: this.hoverCircles[i].X + (point[0] - oldArmsArray[i][0]), Y: this.hoverCircles[i].Y + (point[1] - oldArmsArray[i][1]), dirty: true });
            // VERSION BELOW NOT WORKING...
            // this.hoverCircles[i].set({ X: this.X + point[0] - 12, Y: this.Y + point[1] - 12, dirty: true });
            console.log(`UPDATED HOVER ${i}`);
        }
        // don't forget to update the last hoverCircle (i+1)
        // this.hoverCircles[newArray.length].set({ X: this.X - 12, Y: this.Y - 12, dirty: true });
        this.set({ dirty: true });
        // canvas.renderAll();
    },
    moveNodeBy: function (moveX, moveY) {
        // console.log(`horiz offset: ${getHorizOffset(node.armsArray)}`);
        // move the node itself
        this.set({ X: this.X + getHorizOffset(this.armsArray) + moveX, Y: this.Y + getVertOffset(this.armsArray) + moveY });
        this.set({ left: this.X, top: this.Y });
        this.set({ dirty: true });
        this.setCoords();
        // move each of its hoverCircles
        for (circle of this.hoverCircles) {
            circle.set({ X: circle.X + moveX, Y: circle.Y + moveY });
            circle.set({ dirty: true });
            circle.setCoords();
        }
        // move each of its textNodes
        for (text of this.textNodes) {
            console.log('textnode');
            text.set({ X: text.X + moveX, Y: text.Y + moveY });
            text.set({ left: text.X, top: text.Y, dirty: true });
            text.setCoords();
        }
        // canvas.renderAll();
    }
});



// 2nd version of TreeNode (before revision)
var TreeNode = fabric.util.createClass(fabric.Polyline, {
    type: 'treeNode',

    initialize: function (X, Y, armsArray, parent, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.armsArray = armsArray;
        this.parent = parent;
        this.hoverCircles = [];
        this.nodeTexts = [];
        this.group = new fabric.Group([]);
        // this.group.add(this);
        let vertOffset = getVertOffset(this.armsArray);

        for (point of this.armsArray) {
            // creating the hover circle for each arm
            var hoverCircle = new HoverCircle(this.X + point[0] - 12, this.Y + point[1] - 12 - vertOffset, 'bottom', this);
            canvas.add(hoverCircle);
            this.hoverCircles.push(hoverCircle);
        }
        // adding the top hoverCircle
        var hoverCircle = new HoverCircle(this.X - 12, this.Y - 12 - vertOffset, 'top', this);
        canvas.add(hoverCircle);
        this.hoverCircles.push(hoverCircle);

        this.set({ width: 210, height: 50, originX: 'center', originY: 'center' });
        this.set({ left: X, top: Y, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: false });
        // this.set('label', options.label || '');

    },
    _render: function (ctx) {
        console.log('rendering');
        // RESET points
        this.points = [];

        let vertOffset = getVertOffset(this.armsArray);
        // console.log(vertOffset);
        for (point of this.armsArray) {
            // pushing each arm coord to the Polyline object
            this.points.push({ x: point[0], y: point[1] - vertOffset });
            this.points.push({ x: 0, y: 0 - vertOffset });

            // updating the hover circle coords for each arm
            this.hoverCircles[this.armsArray.indexOf(point)].set({ X: this.X + point[0] - 12, Y: this.Y + point[1] - 12 - vertOffset, dirty: true });
            // var hoverCircle = new HoverCircle(this.X + point[0] - 12, this.Y + point[1] - 12 - vertOffset, 'bottom', this);
            // canvas.add(hoverCircle);
            // this.hoverCircles.push(hoverCircle);
        }
        // this.points.push({ x: 10, y: 0 }, { x: 80, y: 60 }, { x: 80, y: 120 }, { x: 10, y: 110 }, { x: 10, y: 00 });
        // adding the top hoverCircle
        // var hoverCircle = new HoverCircle(this.X - 12, this.Y - 12 - vertOffset, 'top', this);
        // canvas.add(hoverCircle);
        // this.hoverCircles.push(hoverCircle);

        // console.log(this.points);
        // console.log(this.hoverCircles);
        this.callSuper('_render', ctx);
    },

    // moveNodeBy(moveX, moveY) {
    //     this.set({ left: this.X + moveX, top: this.Y + moveY });
    //     // this.set({ dirty: true });
    //     for (circle of this.hoverCircles) {
    //         circle.set({ left: circle.X + moveX, top: circle.Y + moveY });
    //         circle.set({ dirty: true });
    //     }
    //     // canvas.renderAll();
    // }
});


// OLD VERSION OF CLASS TreeNode (binary only)

// var TreeNode = fabric.util.createClass(fabric.Polyline, {
//     type: 'treeNode',

//     initialize: function (X, Y, leftArmX, leftArmY, rightArmX, rightArmY, options) {
//         options || (options = {});
//         this.callSuper('initialize', options);
//         this.X = X;
//         this.Y = Y;
//         this.leftArmX = leftArmX;
//         this.leftArmY = leftArmY;
//         this.rightArmX = rightArmX;
//         this.rightArmY = rightArmY;

//         this.set({ left: X, top: Y, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: false });
//         // this.points.push({ x: -70, y: 50 }, { x: 0, y: 0 }, { x: 70, y: 50 }, { x: 0, y: 0 });
//         this.points.push({ x: leftArmX, y: leftArmY }, { x: 0, y: 0 }, { x: rightArmX, y: rightArmY }, { x: 0, y: 0 });
//         // this.set('label', options.label || '');
//         var leftHover = new HoverCircle(X + leftArmX - 12, Y + leftArmY - 12);
//         var rightHover = new HoverCircle(X + rightArmX - 12, Y + rightArmY - 12);
//         var topHover = new HoverCircle(X - 12, Y - 12);
//         this.leftHover = leftHover;
//         canvas.add(leftHover, rightHover, topHover);
//     },
//     _render: function (ctx) {
//         this.callSuper('_render', ctx);
//     }
// });



// OLD INTERSECTION MATH
for (object of intersectingObjects) {
    let nodeTL = node.aCoords.tl.x;
    let nodeTR = node.aCoords.tr.x;
    let objectTL = object.aCoords.tl.x;
    let objectTR = object.aCoords.tr.x;
    let intersection = '';

    let rightIntersection = Math.abs(nodeTR - objectTL);
    let leftIntersection = Math.abs(nodeTL - objectTR);
    // console.log(`right intersec: ${rightIntersection}`);
    // console.log(`left intersec: ${leftIntersection}`);

    intersection = Math.min(rightIntersection, leftIntersection) == rightIntersection ? 'right' : 'left';

    if (intersection == 'right') {
        // object.set({ left: object.left + 30 });
        // for (circle of object.hoverCircles) {
        //     circle.set({ X: circle.X + 30 });
        //     circle.set({ dirty: true });
        // }

        // object.moveNodeBy(40, 0);
        moveNodeBy(object, 40, 0);

        let ancestor = findFirstCommonAncestor(node, object);
        // console.log(ancestor);
        // ancestor.set({ left: ancestor.left + 50 });
        ancestor.set({ armsArray: [[-80, 50], [120, 50]] });
        ancestor.set({ dirty: true });
        // Alternative to re-render all canvas
        // canvas.requestRenderAll();
        canvas.renderAll();
        console.log(ancestor);

    }
}