// GLOBAL VARIABLES

// which Toolbar button is currently selected
var selectedButton = 'binaryNode';
// ID for JSON flattening
var historyIDCounter = 0;
// Global node shape
var nodeShape = [[-60, 30], [60, 30]];
// All nodeTexts for fast retrieval
var allTexts = null; // NOT USED YET, BUT COULD SPEED UP POINTERS
// setSelectedButton(document.getElementById('arrow'));
var arrowStart = null;
var arrowEnd = null;
fabric.Object.NUM_FRACTION_DIGITS = 2; // DOESNT SEEM TO WORK FOR SVG EXPORT
var globalArrowsToUpdate = new Set();
// Globals to set hoverCircles visible/not
var hoverInOpacity = 1;
var hoverOutOpacity = 0.1;
// Global to allow User to choose surviving subtree when deleting node w/ multiple children
var choiceCircles = [];


var canvas = new fabric.Canvas('treeCanvas', {
    preserveObjectStacking: true,
    // targetFindTolerance: 10
    // fireRightClick: true,
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

function toggleHoverCircleVisibility() {
    if (hoverInOpacity == 1) {
        hoverInOpacity = 0.1;
        hoverOutOpacity = 0;
        for (let obj of canvas._objects) {
            if (obj.type == 'hoverCircle') {
                console.log('one');
                canvas.setActiveObject(obj);
                // obj.set({fill: 'rgba(0,255,0,0)', dirty: true});
                obj.set({opacity: 0, dirty: true});
                // canvas.fire('mouseout', {target: obj});
            }
        }
    }
    else {
        hoverInOpacity = 1;
        hoverOutOpacity = 0.1;
        for (let obj of canvas._objects) {
            if (obj.type == 'hoverCircle') {
                console.log('one');
                canvas.setActiveObject(obj);
                // obj.set({fill: 'rgba(0,255,0,0.1)', dirty: true});
                obj.set({opacity: 0.1, dirty: true});
                // canvas.fire('mouseout', {target: obj});
            }
            // obj.set({opacity: 0.1, dirty: true});
            // canvas.setActiveObject(obj);
            // canvas.fire('mouseout', {target: obj});
        }
    }
    canvas.renderAll();
}



// Print coords of mouse on the screen for development
// var Coordstext = new fabric.Text('', { left: 1200, top: 1100, fontSize: 25, selectable: true });
// canvas.add(Coordstext);

// ** Attaching all events handlers to canvas
canvas.on('mouse:move', canvasMouseMove);
var origPos = null;
canvas.on('mouse:down', canvasMouseDown);
canvas.on('mouse:up', canvasMouseUp);
// canvas.on('mouse:up:before',);



// var root = new fabric.TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
var root = new fabric.TreeNode(1500, 1200, _.cloneDeep(nodeShape), null, null, [],);
// var root = new fabric.TreeNode(1500, 1200, [[-60, 50], [60, 50]], null, null, [],);

// var node2 = new fabric.TreeNode(1700, 1200, [[-80, 50], [30, 50]], null, null, [],);
// var node3 = new fabric.TreeNode(1900, 1200, [[-30, 50], [80, 50]], null, null, [],);

// let rootTopText = new fabric.NodeText(root.X  /*- this.horizOffset*/, root.Y /*+ this.vertOffset*/ - 12 - 20, root, root.hoverCircles[2], 'XP');
// root.textNodes.push(rootTopText);

canvas.add(root);
// canvas.add(root, node2, node3);



// Block below to test TreeNode's methods moveNodeBy() & updateArmCoords()
// node1.moveNodeBy(-100, 100);
// node1.moveNodeBy(0, 0);
// node1.moveNodeBy(-100, -100);
// node2.moveNodeBy(-100, -100);
// node3.moveNodeBy(30, 30);

// node1.updateArmCoords([[80, 10], [30, 30]]);
// node2.updateArmCoords([[-40, 30], [40, 90]]);
// node2.updateArmCoords([[40, -30], [-40, -90]]);
// node3.updateArmCoords([[-80, 20], [-80, 0]]);
// myNode.updateArmCoords([[-120, 80], [-90, 80], [0, 80], [90, 80], [120, 80]]);
canvas.renderAll();

// FASTER DEBUG FOR ARROWS
// canvas.fire('mouse:up', { target: canvas._objects[16] });
// canvas.fire('mouse:up', { target: canvas._objects[46] });

// canvas.fire('mouse:up', { target: canvas._objects[62] });
// canvas.fire('mouse:up', { target: canvas._objects[92] });
// canvas.fire('mouse:up', { target: canvas._objects[122] });
// setSelectedButton(document.getElementById('arrow'));



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



var globalBounding = false;
function renderBoundingRect() {
    if (!globalBounding) {
        canvas.on("after:render", function (opt) {
            canvas.contextContainer.strokeStyle = '#FF0000';
            canvas.forEachObject(function (obj) {
                if (obj.type != 'pointerCircle') {
                    var bound = obj.getBoundingRect();
                    if (bound) {
                        canvas.contextContainer.strokeRect(
                            bound.left + 0.5,
                            bound.top + 0.5,
                            bound.width,
                            bound.height
                        );
                    }

                }
            }); // forEach
        });
        globalBounding = true;
    }
    else {
        canvas.off("after:render");
        globalBounding = false;
    }

}





// Function below saves the canvas to SVG format.
var globalURL = null;
var myLink = null;
function SVGDownload(e) {
    console.log(e);
    // e.preventDefault();
    let canvasSVG = canvas.toSVG();
    var data = new Blob([canvasSVG], { type: 'text' });
    // If we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks.
    if (myLink !== null) { window.URL.revokeObjectURL(textFile); }

    var reader = new FileReader();
    reader.onload = function () {
        var modifSVG = reader.result;
        modifSVG = correctViewBox(modifSVG);

        var modifData = new Blob([modifSVG], { type: 'text' });
        var myLink = window.URL.createObjectURL(modifData);
        console.log(myLink);

        // var link = document.getElementById('downloadlink');
        globalURL = myLink;
    }
    reader.onloadend = function () {
        // set download link to Download button
        var anchor = document.getElementById('CanvasDownload');
        anchor.href = globalURL;
        // window.open(globalURL);
        anchor.click();
    }
    reader.readAsText(data);
    // console.log(reader.result);
};








// function saveCanvas() {
//     let canvasFlattenedObjects = _.cloneDeep(canvas.getObjects());
//     flattenObjects(canvasFlattenedObjects);

//     var rect1 = new fabric.Rect({
//         left: 500,
//         top: 200,
//         fill: 'red',
//         width: 20,
//         height: 20,
//         angle: 30
//     });
//     var rect2 = new fabric.Rect({
//         left: 700,
//         top: 300,
//         fill: 'blue',
//         width: 20,
//         height: 20,
//         angle: 80
//     });

//     let testLoad = [JSON.stringify(rect1), JSON.stringify(rect2)];
//     console.log(testLoad);
//     // this.canvas.add(rect);

//     // let canvasJSON = new Blob([JSON.stringify(canvasFlattenedObjects)], { type: 'application/json' });
//     let canvasJSON = new Blob([JSON.stringify([rect1, rect2])], { type: 'application/json' });
//     let link = document.getElementById('downloadlink');
//     link.href = window.URL.createObjectURL(canvasJSON);
// }


function clearCanvas() {
    canvas.clear();
    console.log(canvas);
}



function clickFileLoader() {
    $('#fileLoader').click();
}

const fileSelector = document.getElementById('fileLoader');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    // console.log(fileList);

    const reader = new FileReader();
    reader.addEventListener("load", e => {
        // console.log(e.target.result, JSON.parse(reader.result))

        // let flattenedObjects = JSON.parse(reader.result).objects;
        // console.log(flattenedObjects);
        let JSONobjects = reader.result;
        canvas.clear();
        canvas.loadFromJSON(JSONobjects, canvas.renderAll.bind(canvas), /*function (o, object) {
            reviveCanvasObject(o, object)
        }*/);

        // Reviving all objects has to be done AFTER all objects are loaded
        // otherwise getOobjectByID doesnt work
        for (let obj of canvas.getObjects()) {
            reviveCanvasObject(null, obj);
        }

        // Gotta reset the Undo/Redo stacks
        canvasHist.undoStack.length = 0;
        $('#undoBtn').prop('disabled', true);
        canvasHist.redoStack.length = 0;
        $('#redoBtn').prop('disabled', true);

        // Coordstext = new fabric.Text('', { left: 1200, top: 1100, fontSize: 25, selectable: true });
        // canvas.add(Coordstext);

        // remove events for debug
        // canvas.off('mouse:move', canvasMouseMove);
        // canvas.off('mouse:down', canvasMouseDown);
        // canvas.off('mouse:up', canvasMouseUp);

        // canvas.on('mouse:up', function (e) {
        //     console.log(e.target);
        // })

        // canvas.clear();
        // canvas.add(JSONobjects[0]);
        // canvas.renderAll();

    });

    reader.readAsText(fileList[0]);
});







var histCanvas = new fabric.Canvas('historyCanvas', {
});
histCanvas.on('mouse:up', function (e) {
    if (e.target != null) {
        console.log(e.target);
    }
});
var jsonCanvas = null;
function saveCanvasToJSON() {
    // var json = canvas.toJSON();

    let canvasRegularObjects = canvas.getObjects();
    let canvasFlattenedObjects = flattenObjects(_.cloneDeep(canvasRegularObjects));

    // console.log('FLAT');
    // console.log(canvasFlattenedObjects);
    // console.log('REG');
    // console.log(canvasRegularObjects);

    histCanvas.clear();
    histCanvas.add(...canvasFlattenedObjects);
    jsonCanvas = JSON.stringify(histCanvas);
    // jsonCanvas = JSON.stringify(canvasFlattenedObjects);
    // jsonCanvas = canvasFlattenedObjects;

    // console.log(jsonCanvas);




    let jsonObjects = JSON.stringify(histCanvas);
    let blob = new Blob([jsonObjects], { type: 'application/json' });
    let downloadLink = window.URL.createObjectURL(blob);
    // console.log(downloadLink);

    let anchor = document.getElementById('canvasJSONDownload');
    anchor.href = downloadLink;
    anchor.click();
}


function loadCanvasFromJSON() {
    // canvas.clear();

    // Using the predef functions doesn't work, lets try smth else
    // canvas.loadFromJSON(jsonCanvas, canvas.renderAll.bind(canvas), function (o, object) {
    //     reviveCanvasObject(o, object)
    // });





    // clear canvas and re-add objects from json file
    canvas.clear();
    canvas.add(...histCanvas.getObjects());

    // // de-flatten every object
    // for (let obj of canvas.getObjects()) {
    //     reviveCanvasObject(null, obj);
    // }




    // fabric.util.enlivenObjects(jsonCanvas, function (objects) {
    //     objects.forEach(function (o) {
    //         canvas.add(o);
    //     });

    //     canvas.renderAll();
    // });

    // Re-attach canvas EventHandlers
    // canvas.on('mouse:move', canvasMouseMove);
    // canvas.on('mouse:down', canvasMouseDown);
    // canvas.on('mouse:up', canvasMouseUp);
}
