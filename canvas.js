// GLOBAL VARIABLES

// which Toolbar button is currently selected
var selectedButton = 'binaryNode';
var historyIDCounter = 0;


var canvas = new fabric.Canvas('treeCanvas', {
    fireRightClick: true,
    // line below not needed with jquery contextmenu
    // stopContextMenu: true
});
// canvas._historyInit();
var ctx = canvas.getContext('2d');
var canvasHist = new CanvasHistory(canvas);
// canvas.setZoom(0.5);

// Disabling selection removes bug when shift-clicking top hoverCircles repeatedly creates a hoverCircle group
canvas.selection = false;


function zoomInCanvas() {
    // canvas.zoomToPoint(canvas.getVpCenter(), canvas.getZoom() + 0.2);
    canvas.zoomToPoint({ x: 1500, y: 1200 }, canvas.getZoom() + 0.2);
    // canvas.setZoom(canvas.getZoom() + 0.2);
    canvas._offset.left = 20;
    canvas.renderAll();
    console.log(canvas);
}
function zoomOutCanvas() {
    // canvas.zoomToPoint(canvas.getVpCenter(), canvas.getZoom() - 0.2);
    canvas.zoomToPoint({ x: 1500, y: 1200 }, canvas.getZoom() - 0.2);
    // canvas.setZoom(canvas.getZoom() - 0.2);
    canvas.renderAll();
    console.log(canvas);
}







// Print coords of mouse on the screen for development
var Coordstext = new fabric.Text('', { left: 1200, top: 1100, fontSize: 25, selectable: true });
canvas.add(Coordstext);
canvas.on('mouse:move', function (e) {
    // we have to use absolutePointer, otherwise zoom messes up the text Coords!!
    Coordstext.set({ text: `X : ${e.absolutePointer.x.toFixed(0)},  Y : ${e.absolutePointer.y.toFixed(0)}` });
    canvas.renderAll();
});


var line = new fabric.Polyline([{ x: 0, y: 0 }, { x: -80, y: 50 }, { x: 0, y: 0 }, { x: 80, y: 50 }, { x: 0, y: 0 }], {
    top: 50,
    left: 300,
    fill: 'white',
    stroke: 'green'
});
// canvas.add(line);


// var myNode = new TreeNode(1200, 1600, [[-120, 50], [-90, 50], [-15, 90], [90, 50], [170, 50]], null, null, [],);

// The nulls here might cause trouble when working on upper tree
// var node1 = new TreeNode(1200, 1100, [[-160, 70], [80, 50]], null, null, [],);
var node2 = new fabric.TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
// var node3 = new TreeNode(1800, 1100, [[-80, 50], [160, 70]], null, null, [],);

canvas.add(node2);

fabric.NodeText.prototype.stateProperties.push('textLines');
console.log(fabric.NodeText.prototype.stateProperties);
// canvas.add(node1, node2, node3, myNode, rect1);

// var rect1 = new fabric.Rect({
//     width: 100, height: 100,
//     top: 1200, left: 1200
// });
// var rect2 = new fabric.Rect({
//     width: 100, height: 100,
//     top: 1400, left: 1200
// });
// var rect3 = new fabric.Rect({
//     width: 100, height: 100,
//     top: 1200, left: 1400
// });
// canvas.add(rect1, rect2, rect3);

// TreeNode.stateProperties = TreeNode.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes"]);


// Block below to test TreeNode's methods moveNodeBy() & updateArmCoords()
// node1.moveNodeBy(-100, 100);
// node1.moveNodeBy(0, 0);
// node1.moveNodeBy(-100, -100);
// node2.moveNodeBy(-100, -100);
// node3.moveNodeBy(30, 30);

// node1.updateArmCoords([[80, 10], [30, 30]]);
node2.updateArmCoords([[-40, 30], [40, 90]]);
node2.updateArmCoords([[40, -30], [-40, -90]]);
// node3.updateArmCoords([[-80, 20], [-80, 0]]);
// myNode.updateArmCoords([[-120, 80], [-90, 80], [0, 80], [90, 80], [120, 80]]);
canvas.renderAll();



// Testing out group functions
// var group = new fabric.Group([node1, node1.textNodes[0], node1.textNodes[1]], {
// var group = new fabric.Group([node3, node3.textNodes[0], node3.textNodes[1]], {
//     // left: 200,
//     // top: 300
// });

// console.log(group);

// // add group onto canvas
// canvas.add(group);

// group.destroy();
// canvas.remove(group);
// canvas.renderAll();





var origPos = null;
// Canvas click events
canvas.on('mouse:down', function (e) {
    if (e.target != null) {
        var target = e.target;
        origPos = target.getCenterPoint();
    }

    else {
        // for zoom function
        this.panning = true;
        // debug zoom function
        // console.log(e);
        console.log(canvas);
    }
});

canvas.on('mouse:move', function (e) {
    if (this.panning && e && e.e) {
        let delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
    }
});

canvas.on('mouse:up:before', function (e) {
    // console.log('BEFORE');
    // myHistory.undoPush();
});

// canvas.on('mouse:wheel', function (opt) {
//     var delta = opt.e.deltaY;
//     var zoom = canvas.getZoom();
//     zoom *= 0.999 ** delta;
//     if (zoom > 20) zoom = 20;
//     if (zoom < 0.01) zoom = 0.01;
//     canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
//     opt.e.preventDefault();
//     opt.e.stopPropagation();
// });

canvas.on('mouse:up', function (e) {
    if (e.target != null) {
        var target = e.target;
        console.log(target);

        delta = target.getCenterPoint().subtract(origPos);
        // console.log(delta.x, delta.y);


        // this array will contain all sub-actions caused by user click
        let histAction = [];


        // if the hoverCircle was dragged more than 20px left or right, activate its movement
        if (target.hoverType == 'bottom' && Math.abs(delta.x) > 20) {

            // second check : make sure user cannot drag an arm past the middle of its node
            if (!wantsToCrossMiddle(target, delta)) {
                histAction.push(['moveCircle', target, delta.x]);
                target.set({ X: this.X + delta.x, dirty: true });
                target.setCoords();

                // We have to find the corresponding arm to update
                let parent = target.parentNode;
                // console.log(parent.hoverCircles);
                // console.log(target);
                let hoverIndex = parent.hoverCircles.indexOf(target);

                for (circle of parent.hoverCircles) {
                    if (circle.historyID == target.historyID) {
                        hoverIndex = parent.hoverCircles.indexOf(circle);
                    }
                }

                if (hoverIndex == -1) console.error('Index of dragged hover not found on parentNode');
                // console.log(hoverIndex);

                let armsToChange = [];
                // Looping through the ancestor's armsArray to update arm coords
                for (let i = 0; i < parent.armsArray.length; i++) {
                    if (i != hoverIndex) {
                        // left-most hoverCircles need no change of coords
                        armsToChange.push([0, 0]);
                    }
                    else {
                        // right-most hoverCircles must be pushed to the right
                        armsToChange.push([delta.x, 0]);
                    }
                }
                // console.log(armsToChange);
                parent.updateArmCoords(armsToChange);
                histAction.push(['updateArms', parent, armsToChange]);
                if (target.childNode != null) {
                    target.childNode.moveSubtreeBy(delta.x, 0);
                    histAction.push(['moveSubtree', target.childNode, delta.x, 0]);
                }
            }
            canvasHist.undoPush(histAction);
        }

        // otherwise, count the 'mouse:up' as a simple click
        else {
            if (target.type == 'hoverCircle') {

                if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'binaryNode') {
                    var newNode = new fabric.TreeNode(target.left + 12, target.top + 50, [[-50, 50], [50, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;

                    resolveIntersections(newNode, histAction);
                    // if the hoverCircle's textNode is multiple lines long, make sure to push new node a bit down
                    target.attachedNodeText.updateVerticalSpace();
                    histAction.push(['addedChild', target, target.childNode]);
                    histAction.push(['nodeAdded', newNode]);
                    console.log(histAction);
                    canvasHist.undoPush(histAction);

                    // myHistory.undoPush();
                    // console.log(myHistory.undoStack);
                }

                else if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
                    var newNode = new fabric.TreeNode(target.left + 12, target.top + 60, [[0, 60]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;

                    resolveIntersections(newNode, histAction);
                    target.attachedNodeText.updateVerticalSpace();

                    histAction.push(['addedChild', target, target.childNode]);
                    histAction.push(['nodeAdded', newNode]);
                    canvasHist.undoPush(histAction);
                }

                else if (target.hoverType == 'top' && target.parentNode.nodeParent == null && selectedButton == 'binaryNode' && !e.e.shiftKey) {
                    var newNode = new fabric.TreeNode(target.X + 12 - 50, target.Y - 60 - 20, [[-50, 50], [50, 50]], null, null, []);
                    canvas.add(newNode);

                    // link the node clicked to the node just created
                    let clickedNode = target.parentNode;
                    clickedNode.nodeParent = newNode;
                    // get the second hoverCircle of parent, A.K.A bottom-right circle
                    clickedNode.hoverParent = newNode.hoverCircles[1];
                    clickedNode.hoverParent.childNode = clickedNode;
                    clickedNode.hoverParent.hasChildNode = true;

                    histAction.push(['upperNodeAdded', clickedNode, newNode, newNode.hoverCircles[1]]);
                    canvasHist.undoPush(histAction);
                }

                else if (target.hoverType == 'top' && target.parentNode.nodeParent == null && selectedButton == 'binaryNode' && e.e.shiftKey) {
                    var newNode = new fabric.TreeNode(target.X + 12 + 50, target.Y - 60 - 20, [[-50, 50], [50, 50]], null, null, []);
                    canvas.add(newNode);

                    // link the node clicked to the node just created
                    let clickedNode = target.parentNode;
                    clickedNode.nodeParent = newNode;
                    // get the first hoverCircle of parent, A.K.A bottom-left circle
                    clickedNode.hoverParent = newNode.hoverCircles[0];
                    clickedNode.hoverParent.childNode = clickedNode;
                    clickedNode.hoverParent.hasChildNode = true;

                    histAction.push(['upperNodeAdded', clickedNode, newNode, newNode.hoverCircles[1]]);
                    canvasHist.undoPush(histAction);
                }


            } // if (target.type == 'hoverCircle')

            else if (target.type == 'nodeText') {
                target.enterEditing();
                // target.setCursorByClick(e);
                // target.set({ linethrough: true, overline: true });
                // console.log(target.calcTextHeight());
                // console.log(target.getSelectionStartFromPointer(e));

            }



            if (target.type == 'hoverCircle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
            }
        } // else



    }
    // for zoom function
    this.panning = false;
});


// Uncomment block below to make boundingRects visible for all objects
// canvas.on("after:render", function (opt) {
//     canvas.contextContainer.strokeStyle = '#FF0000';
//     canvas.forEachObject(function (obj) {
//         var bound = obj.getBoundingRect();
//         if (bound) {
//             canvas.contextContainer.strokeRect(
//                 bound.left + 0.5,
//                 bound.top + 0.5,
//                 bound.width,
//                 bound.height
//             );
//         }
//     });
// });


// console.log(canvas.historyUndo);


// console.log(JSON.stringify(canvas));
// console.log(canvas.toJSON());

// Function below saves the initial canvas to SVG format.
var textFile = null;
makeTextFile = function () {
    var data = new Blob([canvas.toSVG()], { type: 'text' });
    // var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    var reader = new FileReader();
    reader.onload = function () {
        console.log(reader.result);
    }
    reader.readAsText(data);

    // // returns a URL you can use as a href
    // return textFile;

    var link = document.getElementById('downloadlink');
    link.href = textFile;
};

// var test = makeTextFile();
// console.log(test);

// var link = document.getElementById('downloadlink');
// link.href = makeTextFile();






function saveCanvas() {

    let canvasFlattenedObjects = _.cloneDeep(canvas.getObjects());
    flattenObjects(canvasFlattenedObjects);

    var rect1 = new fabric.Rect({
        left: 500,
        top: 200,
        fill: 'red',
        width: 20,
        height: 20,
        angle: 30
    });
    var rect2 = new fabric.Rect({
        left: 700,
        top: 300,
        fill: 'blue',
        width: 20,
        height: 20,
        angle: 80
    });

    let testLoad = [JSON.stringify(rect1), JSON.stringify(rect2)];
    console.log(testLoad);
    // this.canvas.add(rect);

    // let canvasJSON = new Blob([JSON.stringify(canvasFlattenedObjects)], { type: 'application/json' });
    let canvasJSON = new Blob([JSON.stringify([rect1, rect2])], { type: 'application/json' });
    let link = document.getElementById('downloadlink');
    link.href = window.URL.createObjectURL(canvasJSON);
}


function clearCanvas() {
    canvas.clear();
    console.log(canvas);
}

function loadCanvas() {

}

const fileSelector = document.getElementById('fileLoader');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);

    const reader = new FileReader();
    reader.addEventListener("load", e => {
        console.log(e.target.result, JSON.parse(reader.result))
        canvas.loadFromJSON('{"objects":[{ "type": "treeNode", "version": "4.3.1", "originX": "center", "originY": "top", "left": 500, "top": 200, "width": 160, "height": 50, "fill": "rgba(255, 255, 255, 1)", "stroke": "black", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0, "points": [ { "x": -80, "y": 50 }, { "x": 0, "y": 0 }, { "x": 80, "y": 50 }, { "x": 0, "y": 0 } ], "X": 500, "Y": 200, "armsArray": [ [ -80, 50 ], [ 80, 50 ] ], "nodeParent": null, "hoverParent": null, "hoverCircles": [ 2, 4, 6 ], "textNodes": [ 3, 5 ], "horizOffset": 0, "vertOffset": 25, "selectable": false, "pathOffset": { "x": 0, "y": 25 }, "customType": "polyline", "historyID": 1}]}', canvas.renderAll.bind(canvas), function (o, object) {
            console.log("LOADER WORKING");
        });
    });

    reader.readAsText(fileList[0]);
});


// '{"objects":[{ "type": "treeNode", "version": "4.3.1", "originX": "center", "originY": "top", "left": 500, "top": 200, "width": 160, "height": 50, "fill": "rgba(255, 255, 255, 1)", "stroke": "black", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0, "points": [ { "x": -80, "y": 50 }, { "x": 0, "y": 0 }, { "x": 80, "y": 50 }, { "x": 0, "y": 0 } ], "X": 500, "Y": 200, "armsArray": [ [ -80, 50 ], [ 80, 50 ] ], "nodeParent": null, "hoverParent": null, "hoverCircles": [ 2, 4, 6 ], "textNodes": [ 3, 5 ], "horizOffset": 0, "vertOffset": 25, "selectable": false, "pathOffset": { "x": 0, "y": 25 }, "customType": "polyline", "historyID": 1 }]}'

// '{"objects":[{"type":"rect","left":50,"top":50,"width":20,"height":20,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0},{"type":"circle","left":100,"top":100,"width":100,"height":100,"fill":"red","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"radius":50}],"background":"rgba(0, 0, 0, 0)"}'