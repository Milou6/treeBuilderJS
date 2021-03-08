// GLOBAL VARIABLES
// which Toolbar button is currently selected
var selectedButton = 'binaryNode';


var canvas = new fabric.Canvas('treeCanvas', {
});
var ctx = canvas.getContext('2d');
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


var myNode = new TreeNode(1200, 1600, [[-120, 50], [-90, 50], [-15, 90], [90, 50], [170, 50]], null, null, [],);

// The nulls here might cause trouble when working on upper tree
// var node1 = new TreeNode(200, 100, [[-160, 70], [80, 50]], null, null, [],);
var node2 = new TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
// var node3 = new TreeNode(800, 100, [[-80, 50], [160, 70]], null, null, [],);
// canvas.add(myNode, node1, node2, node3);
canvas.add(node2, myNode);

// TreeNode.stateProperties = TreeNode.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes"]);


// Block below to test TreeNode's methods moveNodeBy() & updateArmCoords()
// node1.moveNodeBy(100, 100);
// node1.moveNodeBy(0, 0);
// node1.moveNodeBy(-100, -100);
// node2.moveNodeBy(-50, -50);
// node3.moveNodeBy(30, 30);

// node1.updateArmCoords([[80, 10], [0, 30]]);
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
        // console.log(e);
        origPos = target.getCenterPoint();
        console.log(origPos);
    }
});

canvas.on('mouse:up', function (e) {
    if (e.target != null) {
        var target = e.target;

        delta = target.getCenterPoint().subtract(origPos);
        console.log(delta.x, delta.y);

        // if the hoverCircle was dragged more than 15px left or right, acivate its movement
        if (target.hoverType == 'bottom' && (delta.x > 20 || delta.x < -20)) {
            target.set({ X: this.X + delta.x });

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

        // otherwise, count the 'mouse:up' as a simple click
        else {
            if (target.type == 'hoverCircle') {

                if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'binaryNode') {
                    var newNode = new TreeNode(target.left + 12, target.top + 50, [[-50, 50], [50, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;
                    resolveIntersections(newNode);
                }

                else if (target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
                    var newNode = new TreeNode(target.left + 12, target.top + 60, [[0, 60]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;
                    target.hasChildNode = true;
                }

                else if (target.hoverType == 'top' && selectedButton == 'binaryNode' && !e.e.shiftKey) {
                    var newNode = new TreeNode(target.X + 12 - 80, target.Y - 60 - 60, [[-80, 50], [80, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                }

                else if (target.hoverType == 'top' && selectedButton == 'binaryNode' && e.e.shiftKey) {
                    var newNode = new TreeNode(target.X + 12 + 80, target.Y - 60 - 60, [[-80, 50], [80, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                }

            }



            if (target.type == 'hoverCircle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
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


function loadData() {
    // Create an XHR Object
    const xhr = new XMLHttpRequest();

    // OPEN
    xhr.open('GET', 'data.txt', true);
    console.log('READYSTATE', xhr.readyState);

    // Optional : for spinners/loaders
    xhr.onprogress = function () {
        // log
    }

    xhr.onload = function () {
        console.log('READYSTATE', xhr.readyState);
        if (this.status === 200) {
            console.log(this.responseText);
        }
    }

    xhr.send();
}