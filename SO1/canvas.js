
// create a wrapper around native canvas element (with id="treeCanvas")
var canvas = new fabric.Canvas('treeCanvas', {
    allowTouchScrolling: true,
});
var ctx = canvas.getContext('2d');

// Print coords of mouse on the screen for development
var Coordstext = new fabric.Text('', { left: 20, top: 20, fontSize: 25, selectable: false });
canvas.add(Coordstext);
canvas.on('mouse:move', function (e) {
    Coordstext.set({ text: `X : ${e.pointer.x.toFixed(2)},  Y : ${e.pointer.y.toFixed(2)}` });
    canvas.renderAll();
});

// My TreeNode custom class
var TreeNode = fabric.util.createClass(fabric.Polyline, {
    type: 'treeNode',

    initialize: function (X, Y, armsArray, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.armsArray = armsArray;
        let vertOffset = getVertOffset(this.armsArray);
        let nodeWidth = getNodeWidth(this.armsArray);

        this.set({ width: nodeWidth, height: vertOffset * 2, originX: 'center', originY: 'center' });
        this.set({ left: this.X, top: this.Y, fill: 'rgba(255, 255, 255, 0)', stroke: 'black', selectable: true });
        this.setCoords();
        this.set({ pathOffset: { x: 0, y: vertOffset } });

        for (point of this.armsArray) {
            // adding the arm coords to the polyline points
            this.points.push({ x: point[0], y: point[1] });
            this.points.push({ x: 0, y: 0 });
        }
    },
    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

var node1 = new TreeNode(100, 100, [[-80, 50], [80, 50]], []);
var node2 = new TreeNode(400, 100, [[-60, 50], [140, 60]], []);

canvas.add(node1, node2);
canvas.renderAll();



// helper functions I need for other things...
function getVertOffset(array) {
    let yCoords = [];
    for (point of array) {
        yCoords.push(point[1]);
    }
    return (Math.max(...yCoords) / 2);
}

function getNodeWidth(array) {
    let xCoords = [];
    for (point of array) {
        xCoords.push(point[0]);
    }
    let min = Math.abs(Math.min(...xCoords));
    let max = Math.max(...xCoords);

    return min + max;
}