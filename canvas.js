// GLOBAL VARS
var selectedButton = 'binaryNode';



// create a wrapper around native canvas element (with id="treeCanvas")
var canvas = new fabric.Canvas('treeCanvas', {
    // backgroundColor: 'rgb(100,100,200)',
    // selectionColor: 'red'
    allowTouchScrolling: true,
});
var ctx = canvas.getContext('2d');

// canvas.setZoom(0.5);



// Print coords of mouse on the screen for development
var Coordstext = new fabric.Text('', { left: 20, top: 20, fontSize: 25, selectable: false });
canvas.add(Coordstext);
canvas.on('mouse:move', function (e) {
    Coordstext.set({ text: `X : ${e.pointer.x.toFixed(2)},  Y : ${e.pointer.y.toFixed(2)}` });
    canvas.renderAll();
    // console.log(e);
});



var NodeText = fabric.util.createClass(fabric.IText, {
    type: 'nodeText',

    initialize: function (X, Y, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;

        this.set({ left: X, top: Y, editingBorderColor: 'green', fontSize: 20, textAlign: 'center' /*hasControls: false, */ });
    },
    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

// var itext = new NodeText(200, 200, 'the dog');
// canvas.add(itext);



var HoverCircle = fabric.util.createClass(fabric.Circle, {
    type: 'hoverCircle',

    initialize: function (X, Y, hoverType, parentNode, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.hoverType = hoverType;
        this.parentNode = parentNode;
        this.hasChildNode = false;

        this.set({ left: X, top: Y, radius: 10, fill: 'rgba(0,255,0,0.1)', selectable: false });
        // this.set({ pathOffset: { x: 0, y: 25 } }); //Maybe not for circle

        this.on('mouseover', function (options) {
            options.target.set('fill', 'rgba(0,255,0,1)'); // Make circle opaque on hover-in
            canvas.renderAll();
            // console.log('in');
        });
        this.on('mouseout', function (options) {
            options.target.set('fill', 'rgba(0,255,0,0.1)'); // Make circle translucent on hover-out
            canvas.renderAll();
            // console.log('out');
        });
    },
    _render: function (ctx) {
        // This version offsets the Y coord correctly 
        this.set({ left: this.X, top: this.Y - this.parentNode.pathOffset.y });
        // this.set({ left: this.X, top: this.Y - this.parentNode.pathOffset.y });
        this.setCoords(); // this line makes the hoverCircle update coords correctly... let's keep that
        this.callSuper('_render', ctx);
    }
});


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

        this.set({ width: nodeWidth, height: vertOffset * 2, originX: 'center', originY: 'center' });
        this.set({ left: this.X, top: this.Y, fill: 'rgba(255, 255, 255, 1)', stroke: 'black', strokeWidth: 5, selectable: true/*, centeredScaling: true*/ });
        this.setCoords();
        // this._calcDimensions();

        // SHOULD BE DYNAMICALLY SETTING OFFSET!!!
        // console.log(vertOffset);
        this.set({ pathOffset: { x: 0, y: vertOffset } });

        // this.set({stateProperties: })

        for (point of this.armsArray) {
            // adding the arm coords to the polyline points
            // this.points.push({ x: point[0] - horizOffset, y: point[1] - vertOffset });
            this.points.push({ x: point[0], y: point[1] });
            // this.points.push({ x: 0 - horizOffset, y: 0 - vertOffset });
            this.points.push({ x: 0, y: 0 });
            // this.points.push({ x: 50, y: -25 });

            // creating the bottom hoverCircles for each arm
            var hoverCircle = new HoverCircle(this.X + point[0] - 12, this.Y + point[1] - 12, 'bottom', this);
            canvas.add(hoverCircle);
            this.hoverCircles.push(hoverCircle);

            // creating the bottom textNodes
            var textNode = new NodeText(this.X + point[0] - 12, this.Y + point[1] - vertOffset + 12, 'XP');
            canvas.add(textNode);
            this.textNodes.push(textNode);
        }
        // creating the top hoverCircle
        var topHoverCircle = new HoverCircle(this.X - 12, this.Y - 12, 'top', this);
        canvas.add(topHoverCircle);
        this.hoverCircles.push(topHoverCircle);

        // adding method call to havetop of node at the desired coords
        // ex: first node is correctly at (400,200)
        this.moveNodeBy(0, vertOffset);

        // this.set({ left: X + horizOffset, top: Y + vertOffset, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: true });
        // this.set({ width: nodeWidth, height: vertOffset * 2, originX: 'center', originY: 'center' });

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
        let oldArmsArray = [...this.armsArray];
        this.points = [];
        let point = [];
        let horizOffset = getHorizOffset(newArray);
        let vertOffset = getVertOffset(newArray);
        let nodeWidth = getNodeWidth(newArray);
        console.log(`horizOffset : ${horizOffset}`);
        this.armsArray = newArray;

        // why don't I have to update top coords too below??
        // this.set({ width: nodeWidth, left: this.left + horizOffset });
        this.set({ width: nodeWidth, height: vertOffset * 2 });

        let minX = 0;
        let maxX = 0;
        for (let i = 0; i < newArray.length; i++) {
            point = newArray[i];
            // Getting minX and maxX to calculate offestX later
            minX = Math.min(minX, point[0]);
            maxX = Math.max(maxX, point[0]);
        }
        // Set the X offset of the node
        let offsetX = Math.abs(Math.abs(minX) - Math.abs(maxX)) / 2;
        console.log(`offsetX: ${offsetX}`);
        this.set({ pathOffset: { x: offsetX, y: this.pathOffset.y } });

        // for (point of newArray) {
        for (let i = 0; i < newArray.length; i++) {
            point = newArray[i];

            // adding the arm coords to the polyline points
            // this.points.push({ x: point[0] - horizOffset, y: point[1] - vertOffset });
            this.points.push({ x: point[0], y: point[1] });
            // this.points.push({ x: 0 - horizOffset, y: 0 - vertOffset });
            this.points.push({ x: 0, y: 0 });

            // console.log(`old X : ${this.hoverCircles[i].X} new X : ${this.X + point[0] - 12}`);
            // console.log(`old Y : ${this.hoverCircles[i].Y} new Y : ${this.Y + point[1] - 12}`);

            // updating the hoverCircle coords to keep them over node edges
            // for X : get oldX + difference between new armX and old armX
            this.hoverCircles[i].set({ X: this.hoverCircles[i].X + (point[0] - oldArmsArray[i][0]) - offsetX, Y: this.hoverCircles[i].Y + (point[1] - oldArmsArray[i][1]), dirty: true });

            // updating the textNode coords too
            this.textNodes[i].set({ X: this.textNodes[i].X + (point[0] - oldArmsArray[i][0]) - offsetX, Y: this.textNodes[i].Y + (point[1] - oldArmsArray[i][1]) });
            // this.textNodes[i].set({ X: this.textNodes[i].X + 20, Y: this.textNodes[i].Y + 20 });
            this.textNodes[i].set({ left: this.textNodes[i].X, top: this.textNodes[i].Y, dirty: true });

            // VERSION BELOW NOT WORKING...
            // this.hoverCircles[i].set({ X: this.X + point[0] - 12, Y: this.Y + point[1] - 12, dirty: true });
            console.log(`UPDATED HOVER ${i}`);

        }
        // don't forget to update the last hoverCircle (i+1)
        let topCircle = this.hoverCircles[this.hoverCircles.length - 1];
        topCircle.set({ X: this.X, Y: this.Y });
        topCircle.set({ left: topCircle.X, top: topCircle.Y, dirty: true });
        this.set({ dirty: true });

        this.moveNodeBy(offsetX, 0); //TURN ON AGAIN
        // canvas.renderAll();
    },
    moveNodeBy: function (moveX, moveY) {
        // console.log(`horiz offset: ${getHorizOffset(node.armsArray)}`);
        // Line below is old complicated version
        // this.set({ X: this.X + getHorizOffset(this.armsArray) + moveX, Y: this.Y + getVertOffset(this.armsArray) + moveY });
        // move the node itself
        this.set({ X: this.X + moveX, Y: this.Y + moveY });
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
// TRYING TO FIX SVG EXPORT
// fabric.Object.prototype.toObject = (function (toObject) {
//     // TreeNode.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             // name: this.name,
//             // X: this.X,
//             // Y: this.Y,
//             // armsArray: this.armsArray,
//             // nodeParent: this.nodeParent,
//             // hoverParent: this.hoverParent,
//             // hoverCircles: this.hoverCircles,
//             // textNodes: this.textNodes,
//             // testATTR: 'lalalala'
//         });
//     };
// })(fabric.Object.prototype.toObject);
// })(TreeNode.toObject);

// fabric.Object.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes"]);
console.log(fabric.Object.prototype.stateProperties);

console.log(fabric.TreeNode);


var line = new fabric.Polyline([{ x: 0, y: 0 }, { x: -80, y: 50 }, { x: 0, y: 0 }, { x: 80, y: 50 }, { x: 0, y: 0 }], {
    top: 50,
    left: 300,
    fill: 'white',
    stroke: 'green'
});
canvas.add(line);

var myNode = new TreeNode(400, 200, [[-120, 50], [-90, 50], [-15, 90], [90, 50], [170, 50]], null, null, [],);
// var myNode = new TreeNode(400, 200, [[-30, 50], [14, 39], [29, 120], [180, 90]], null,null, [],);

// The nulls here might cause trouble when working on upper tree
// var myNode = new TreeNode(400, 200, [[-80, 50], [80, 50]], null, null, [],);
// var node2 = new TreeNode(100, 100, [[-50, 90], [100, 50]], null, null, [],);
var node2 = new TreeNode(100, 100, [[-80, 50], [80, 50]], null, null, [],);
// let box = node2.getBoundingRect();
// box.width = 200;
// console.log(box);
// node2.setCoords();
// node2.set({ dirty: true });
canvas.add(myNode, node2);
canvas.renderAll();
console.log(node2.getBoundingRect());
// TreeNode.stateProperties = TreeNode.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes"]);

console.log(JSON.stringify(canvas));
// console.log(canvas.toJSON());

var textFile = null,
    makeTextFile = function () {
        var data = new Blob([canvas.toSVG()], { type: 'text' });
        // var data = new Blob([text], {type: 'text/plain'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
    };

var test = makeTextFile();
console.log(test);

var link = document.getElementById('downloadlink');
link.href = makeTextFile();

// DEBUGGING THE GOD DAMN POSITIONING/MOVING SYSTEM
// myNode.moveNodeBy(100, 100);
// canvas.renderAll();
// myNode.moveNodeBy(200, -50);
// myNode.changeArms([[-80, 80], [140, 60]]);
// canvas.renderAll();
// myNode.changeArms([[-100,60], [130,60]]); // different X for each arm 


// NOT SURE THESE ARE NEEDED FOR ANYTHING FOR THE MOMENT...
// myNode.getBoundingRect().width = 140;
// console.log(myNode.points);
// console.log(myNode.getBoundingRect());


// canvas Events
canvas.on('mouse:down', function (e) {
    if (e.target != null) {
        var target = e.target;
        // console.log(target.type);
        console.log(e);

        // myNode.moveNodeBy(100, 0);

        if (target.type == 'hoverCircle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'binaryNode') {
            // console.log('bottom');
            var newNode = new TreeNode(target.left + 12, target.top + 60, [[-80, 50], [80, 50]], target.parentNode, target, []);
            canvas.add(newNode);

            // set boolean on hoverCircle to disable adding new children to it
            target.hasChildNode = true;
            // console.log(newNode.getOff());
            // spaceOutIntersections(newNode);
            // console.log(e.target.intersectsWithObject(myNode));
        }

        if (target.type == 'hoverCircle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
            var newNode = new TreeNode(target.left + 12, target.top + 60, [[0, 60]], target.parentNode, target, []);
            canvas.add(newNode);
            target.hasChildNode = true;
        }
    }
});