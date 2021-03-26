// console.log(canvas._objects[1].type);
// console.log(JSON.stringify(canvas));

class CanvasHistory {

    constructor(canvas) {
        this.canvas = canvas;
        this.undoStack = [];
        this.redoStack = [];
        this.map = new Map();
        this.mapIndex = 0;
        this.histCanvas = new fabric.Canvas('historyCanvas', {
        });

        // Push initial canvas to undoStack
        // this.undoStack.push(JSON.stringify(this.canvas));
        // this.undoStack.push(JSON.decycle(this.canvas.getObjects()));

        // store existing canvas objects in map
        // let canvasObjects = this.canvas.getObjects();

        // for (let index in canvasObjects) {
        //     this.map.set(canvasObjects[index], this.mapIndex);
        //     this.mapIndex += 1;
        // }
        // console.log(this.map);

    }

    mapAdd(object) {
        this.map.set(object, this.mapIndex);
        this.mapIndex += 1;
        // console.log(this.map);
    }


    undoPush() {
        console.log('UNDO PUSH');


        // SET 1 : 1 map
        let canvasRegularObjects = this.canvas.getObjects();
        // Works, but different structure??
        // var canvasFlattenedObjects = $.map(canvasRegularObjects, function (obj) {
        //     return $.extend(true, {}, obj);
        // });

        // I freaking love Lodash (might have to check rfdc too...)
        let canvasFlattenedObjects = _.cloneDeep(canvasRegularObjects); // FIX BACK
        flattenObjects(canvasFlattenedObjects);
        flattenObjects(canvasRegularObjects);

        // console.log('FLAT');
        // console.log(canvasFlattenedObjects);
        // console.log('REG');
        // console.log(canvasRegularObjects);
        // console.log(this.canvas);

        // console.log(canvasRegularObjects[0] == canvasFlattenedObjects[0]);

        // this.histCanvas = new fabric.Canvas('historyCanvas', {
        // });
        // clear histCanvas
        this.histCanvas.clear();
        this.histCanvas.add(...canvasRegularObjects);

        // var rect = new fabric.Rect({
        //     left: 1500,
        //     top: 1200,
        //     fill: 'red',
        //     width: 20,
        //     height: 20,
        //     angle: 30
        // });
        // this.histCanvas.add(rect);
        // this.histCanvas.renderAll();

        // FOR DEBUG ONLY
        this.histCanvas.on('mouse:up', function (e) {
            if (e.target != null) {
                console.log(e.target);
            }
        });

        // store the "flattened" canvas to stack
        // this.undoStack.push(this.histCanvas.toJSON());
        this.undoStack.push(JSON.stringify(this.histCanvas));
        // console.log(JSON.stringify(this.histCanvas));

        // clear histCanvas again after!!!
        // this.histCanvas.clear();
        // this.histCanvas.renderAll();

        // Enable Undo button
        if (this.undoStack.length > 1) {
            $('#undoBtn').prop('disabled', false);
        }
    }

    undo() {
        console.log('UNDO');
        // this.redoStack.push(this.undoStack.pop());

        // console.log(this.undoStack[this.undoStack.length - 1]);
        // this.canvas.clear();
        this.canvas.renderAll();
        let test = JSON.parse(this.undoStack[0]);
        // let test = this.undoStack;
        console.log(test);

        // console.log(this.canvas[0] == test.objects[0]);

        // var rect = new fabric.Rect({
        //     left: 1500,
        //     top: 1200,
        //     fill: 'red',
        //     width: 20,
        //     height: 20,
        //     angle: 30
        // });

        // let stringed = JSON.stringify(rect);
        // this.canvas.add(rect);

        this.canvas.loadFromJSON(test, this.canvas.renderAll.bind(this.canvas), function (o, object) {
            console.log('reviver');

        });

        // this.canvas.loadFromJSON(this.undoStack[this.undoStack.length - 1], canvas.renderAll.bind(canvas)
        // , function (o, object) {
        //     console.log('REVIVER');
        //     // reviveCanvasObject(o, object);
        //     // object = fabric.Polyline.fromObject(object);

        // }
        // );

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

        this.canvas.loadFromJSON(state, canvas.renderAll.bind(canvas), function (o, object) {
            // console.log('REVIVER');
            reviveCanvasObject(o, object);
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
// myHistory.canvas.on('object:added', function (e) {
//     // console.log("OBJECT CREATED");
//     myHistory.mapAdd(e.target);
// });
// myHistory.canvas.on('object:removed', function (e) {
//     console.log("OBJECT REMOVED");
//     myHistory.map.delete(e.target);
// });


// UNDO-PUSH TEST
// myHistory.undoPush();
