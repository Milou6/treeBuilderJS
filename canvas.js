// GLOBAL VARIABLES

// which Toolbar button is currently selected
var selectedButton = 'binaryNode';


var canvas = new fabric.Canvas('treeCanvas', {
});
// canvas._historyInit();
var ctx = canvas.getContext('2d');
// var history = require('fabric-history');
// canvas.setZoom(0.5);

// Disabling selection removes bug when shift-clicking top hoverCircles repeatedly creates a hoverCircle group
canvas.selection = false;



// Print coords of mouse on the screen for development
var Coordstext = new fabric.Text('', { left: 1300, top: 1100, fontSize: 25, selectable: true });
canvas.add(Coordstext);
canvas.on('mouse:move', function (e) {
    Coordstext.set({ text: `X : ${e.pointer.x.toFixed(0)},  Y : ${e.pointer.y.toFixed(0)}` });
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
var node2 = new TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
// var node3 = new TreeNode(1800, 1100, [[-80, 50], [160, 70]], null, null, [],);

canvas.add(node2);
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
// node2.updateArmCoords([[-40, 30], [40, 90]]);
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
        // console.log(target.type);
        console.log(target);
        origPos = target.getCenterPoint();
        console.log(origPos);
    }
});

canvas.on('mouse:up:before', function (e) {
    console.log('BEFORE');
    // myHistory.undoPush();
});

canvas.on('mouse:up', function (e) {
    if (e.target != null) {
        var target = e.target;

        delta = target.getCenterPoint().subtract(origPos);
        console.log(delta.x, delta.y);


        // testing out history without nodes
        // myHistory.undoPush();
        // console.log('hist PUSH');


        // if the hoverCircle was dragged more than 20px left or right, activate its movement
        if (target.hoverType == 'bottom' && Math.abs(delta.x) > 20) {

            // second check : make sure user cannot drag an arm past the middle of its node
            if (!wantsToCrossMiddle(target, delta)) {
                target.set({ X: this.X + delta.x, dirty: true });
                target.setCoords();

                // We have to find the corresponding arm to update
                let parent = target.parentNode;
                let hoverIndex = parent.hoverCircles.indexOf(target);
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
                parent.updateArmCoords(armsToChange);
                if (target.childNode != null) {
                    target.childNode.moveSubtreeBy(delta.x, 0);
                }
            }
        }

        // otherwise, count the 'mouse:up' as a simple click
        else {
            if (target.type == 'circle') {

                if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'binaryNode') {
                    var newNode = new TreeNode(target.left + 12, target.top + 50, [[-50, 50], [50, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;
                    resolveIntersections(newNode);
                    // if the hoverCircle's textNode is multiple lines long, make sure to push new node a bit down
                    target.attachedNodeText.updateVerticalSpace();
                    myHistory.undoPush();
                    // console.log(myHistory.undoStack);
                }

                else if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
                    var newNode = new TreeNode(target.left + 12, target.top + 60, [[0, 60]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;
                    target.hasChildNode = true;
                }

                else if (target.hoverType == 'top' && target.parentNode.nodeParent == null && selectedButton == 'binaryNode' && !e.e.shiftKey) {
                    var newNode = new TreeNode(target.X + 12 - 80, target.Y - 60 - 60, [[-80, 50], [80, 50]], null, null, []);
                    canvas.add(newNode);

                    // link the node clicked to the node just created
                    let clickedNode = target.parentNode;
                    clickedNode.nodeParent = newNode;
                    // get the second hoverCircle of parent, A.K.A bottom-right circle
                    clickedNode.hoverParent = newNode.hoverCircles[1];
                    clickedNode.hoverParent.childNode = clickedNode;
                    clickedNode.hoverParent.hasChildNode = true;
                }

                else if (target.hoverType == 'top' && target.parentNode.nodeParent == null && selectedButton == 'binaryNode' && e.e.shiftKey) {
                    var newNode = new TreeNode(target.X + 12 + 80, target.Y - 60 - 60, [[-80, 50], [80, 50]], null, null, []);
                    canvas.add(newNode);

                    // link the node clicked to the node just created
                    let clickedNode = target.parentNode;
                    clickedNode.nodeParent = newNode;
                    // get the first hoverCircle of parent, A.K.A bottom-left circle
                    clickedNode.hoverParent = newNode.hoverCircles[0];
                    clickedNode.hoverParent.childNode = clickedNode;
                    clickedNode.hoverParent.hasChildNode = true;
                }


            } // if (target.type == 'hoverCircle')

            else if (target.type == 'i-text') {
                // console.log('TEXT');
                target.enterEditing();
                // target.setCursorByClick(e);
                // target.set({ linethrough: true, overline: true });
                // console.log(target.calcTextHeight());
                // console.log(target.getSelectionStartFromPointer(e));

            }



            if (target.type == 'circle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
            }
        } // else



    }
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
    // if (textFile !== null) {
    //     window.URL.revokeObjectURL(textFile);
    // }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

var test = makeTextFile();
console.log(test);

var link = document.getElementById('downloadlink');
link.href = makeTextFile();
