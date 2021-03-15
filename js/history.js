// console.log(canvas._objects[1].type);
// console.log(JSON.stringify(canvas));

class CanvasHistory {

    constructor(canvas) {
        this.canvas = canvas;
        this.undoStack = [];
        this.redoStack = [];
        this.map = new Map();
        this.mapIndex = 0;

        // Push initial canvas to undoStack
        // this.undoStack.push(JSON.stringify(this.canvas));
        // this.undoStack.push(JSON.decycle(this.canvas.getObjects()));

        // store existing canvas objects in map
        let canvasObjects = this.canvas.getObjects();

        for (let index in canvasObjects) {
            // console.log(canvasObjects[index]);
            this.map.set(canvasObjects[index], this.mapIndex);
            this.mapIndex += 1;
        }
        console.log(this.map);

    }

    mapAdd(object) {
        this.map.set(object, this.mapIndex);
        this.mapIndex += 1;
        // console.log(this.map);
    }


    undoPush() {
        console.log('UNDO PUSH');

        // VERSION : with decycle/retrocycle...
        // // let canvasState = JSON.stringify(this.canvas);
        // this.undoStack.push(JSON.decycle(this.canvas.getObjects()));

        // // Version below returns a non-flattened array..... wrong
        // // let flattenedObjects = JSON.decycle(this.canvas.getObjects());

        // console.log(this.undoStack);
        // VERSION : with decycle/retrocycle...



        // SET 1 : 1 map
        let canvasRegularObjects = this.canvas.getObjects();
        // let canvasFlattenedObjects = this.canvas.getObjects();
        // let canvasFlattenedObjects = canvasRegularObjects.slice(0);

        // Works, but different structure??
        // var canvasFlattenedObjects = $.map(canvasRegularObjects, function (obj) {
        //     return $.extend(true, {}, obj);
        // });

        // I freaking love Lodash
        let canvasFlattenedObjects = _.cloneDeep(canvasRegularObjects);


        canvasFlattenedObjects[1].childNode = 666;
        flattenObjects(canvasFlattenedObjects, this);
        // this.canvas._objects = [];
        console.log('FLAT');
        console.log(canvasFlattenedObjects);
        console.log('REG');
        console.log(canvasRegularObjects);
        console.log(this.canvas);




        // Enable Undo button
        $('#undoBtn').prop('disabled', false);
    }

    undo() {
        console.log('UNDO');

        // BASE CASE : create a node, save it to JSON then try to load into canvas
        var test = new TreeNode(1200, 1200, [[-80, 50], [80, 50]], null, null, [],);
        this.canvas.add(test);

        // remove the node
        this.canvas.remove(test.hoverCircles[0], test.hoverCircles[1], test.hoverCircles[2], test.textNodes[0], test.textNodes[1]);
        test.hoverCircles = [];
        test.textNodes = [];

        console.log(test);
        console.log(test.toObject());

        // save node as JSON
        // var stringed = this.canvas.toJSON();
        var stringed = JSON.stringify(this.canvas); // these are both the same!

        console.log(stringed);

        this.canvas.loadFromJSON(stringed, canvas.renderAll.bind(canvas), function (o, object) {
            // console.log(o);
            // console.log(object);
            console.log('RECREATING');
        });


        // VERSION : with decycle/retrocycle...
        // this.redoStack.push(this.undoStack.pop());
        // this.canvas.clear();
        // this.canvas.renderAll();
        // let flattenedObjects = this.undoStack[this.undoStack.length - 1];
        // // console.log(this.undoStack);
        // // console.log(this.undoStack[this.undoStack.length - 1]);
        // let regularObjects = JSON.retrocycle(flattenedObjects);
        // console.log(regularObjects);
        // // console.log(flattenedObjects);

        // // for (let x in regularObjects) {
        // //     console.log(regularObjects[x]);
        // //     this.canvas.add(regularObjects[x]);
        // // }

        // // this.canvas._objects = [...regularObjects];
        // regularObjects[1].parentNode = 0;
        // regularObjects[1].childNode = 0;
        // regularObjects[1].attachedNodeText = 0;
        // regularObjects[1].canvas = null;

        // setTimeout(this.canvas.add(regularObjects[1]), 10000);
        // console.log(this.canvas);
        // this.canvas.renderAll();
        // VERSION : with decycle/retrocycle...


        // this.redoStack.push(this.undoStack.pop());
        // console.log(this.undoStack.length - 1);
        // this.canvas.loadFromJSON(this.undoStack[this.undoStack.length - 1], function () {
        //     canvas.renderAll();
        //     console.log("reloading from JSON");
        // });





        // Enable the Redo button
        $('#redoBtn').prop('disabled', false);

        // Disable button if no more moves to Undo
        if (this.undoStack.length == 1) {
            $('#undoBtn').prop('disabled', true);
        }




    } // END undo()

    redo() {
        console.log('REDO');

        let state = this.redoStack.pop();

        this.canvas.loadFromJSON(state, function () {
            canvas.renderAll();
            console.log("reloading from JSON");
        });
        this.undoStack.push(state);

        // Enable the undo button
        $('#undoBtn').prop('disabled', false);

        // Disable Redo button if no more moves to Redo
        if (this.redoStack.length == 0) {
            $('#redoBtn').prop('disabled', true);
        }
    }




}

var myHistory = new CanvasHistory(canvas);
console.log(this.canvas);
console.log(myHistory.undoStack);



// Making sure history map updates on object adding
myHistory.canvas.on('object:added', function (e) {
    // console.log("OBJECT CREATED");
    myHistory.mapAdd(e.target);
});
myHistory.canvas.on('object:removed', function (e) {
    console.log("OBJECT REMOVED");
    myHistory.map.delete(e.target);
});


// UNDO PUSH TEST
myHistory.undoPush();
