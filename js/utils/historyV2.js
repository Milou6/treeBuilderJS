// console.log(canvas._objects[1].type);
// console.log(JSON.stringify(canvas));

class CanvasHistory {

    constructor(canvas) {
        this.canvas = canvas;
        this.undoStack = [];
        this.redoStack = [];
        // this.map = new Map();
        // this.mapIndex = 0;
        // this.histCanvas = new fabric.Canvas('historyCanvas', {
        // });

        // Push initial canvas to undoStack
        // this.undoStack.push(JSON.stringify(this.canvas));
        // this.undoStack.push(JSON.decycle(this.canvas.getObjects()));
    }

    mapAdd(object) {
        this.map.set(object, this.mapIndex);
        this.mapIndex += 1;
        // console.log(this.map);
    }


    undoPush(action) {
        console.log('UNDO-PUSH');

        this.undoStack.push(action);

        // Enable Undo button
        if (this.undoStack.length > 0) {
            $('#undoBtn').prop('disabled', false);
        }
    }

    undo() {
        console.log('UNDO');

        let action = this.undoStack.pop();
        console.log(action);

        for (let subAction of action) {
            this.undoSubAction(subAction);
        }

        // important to reverse before pushing to redoStack
        action.reverse();
        this.redoStack.push(action);

        // Enable the Redo button
        $('#redoBtn').prop('disabled', false);

        // Disable button if no more moves to Undo
        if (this.undoStack.length == 0) {
            $('#undoBtn').prop('disabled', true);
        }


    } // END undo()

    redo() {
        console.log('REDO');

        let action = this.redoStack.pop();

        for (let subAction of action) {
            this.redoSubAction(subAction);
        }

        // important to reverse before pushing to undoStack
        action.reverse();
        this.undoStack.push(action);

        // Enable the undo button
        $('#undoBtn').prop('disabled', false);

        // Disable Redo button if no more moves to Redo
        if (this.redoStack.length == 0) {
            $('#redoBtn').prop('disabled', true);
        }
    }

    undoSubAction(subAction) {
        if (subAction[0] == 'addedChild') {
            let hover = subAction[1];
            hover.childNode = null;
            hover.hasChildNode = false;
        }

        else if (subAction[0] == 'upperNodeAdded') {
            subAction[1].hoverParent = null;
            subAction[1].nodeParent = null;
            for (let circle of subAction[2].hoverCircles) {
                this.canvas.remove(circle);
            }
            for (let text of subAction[2].textNodes) {
                this.canvas.remove(text);
            }
            this.canvas.remove(subAction[2]);
        }

        else if (subAction[0] == 'nodeAdded') {
            let node = subAction[1];

            for (let circle of node.hoverCircles) {
                this.canvas.remove(circle);
            }
            for (let text of node.textNodes) {
                this.canvas.remove(text);
            }
            this.canvas.remove(node);
        }

        else if (subAction[0] == 'updateArms') {
            let ancestor = subAction[1];
            let update = subAction[2];

            for (let coord of update) {
                coord[0] = (-1) * coord[0];
                coord[1] = (-1) * coord[1];
            }
            ancestor.updateArmCoords(update);
        }

        else if (subAction[0] == 'moveSubtree') {
            let root = subAction[1];
            subAction[2] = (-1) * subAction[2];
            subAction[3] = (-1) * subAction[3];
            root.moveSubtreeBy(subAction[2], subAction[3]);
        }

        else if (subAction[0] == 'moveCircle') {
            let circle = subAction[1];
            subAction[2] = (-1) * subAction[2];
            circle.set({ X: circle.X + subAction[2], dirty: true });
            circle.setCoords();
        }

        else if (subAction[0] == 'textEdited') {
            subAction[1].set({ text: subAction[2] });
            subAction[1].updateVerticalSpace();
            canvas.renderAll();
        }




    }

    redoSubAction(subAction) {
        if (subAction[0] == 'addedChild') {
            let hover = subAction[1];
            hover.childNode = subAction[2];
            hover.hasChildNode = true;
        }

        else if (subAction[0] == 'upperNodeAdded') {
            subAction[1].hoverParent = subAction[3];
            subAction[1].nodeParent = subAction[2];
            for (let circle of subAction[2].hoverCircles) {
                this.canvas.add(circle);
            }
            for (let text of subAction[2].textNodes) {
                this.canvas.add(text);
            }
            this.canvas.add(subAction[2]);
        }

        else if (subAction[0] == 'nodeAdded') {
            let node = subAction[1];

            for (let circle of node.hoverCircles) {
                this.canvas.add(circle);
            }
            for (let text of node.textNodes) {
                this.canvas.add(text);
            }
            this.canvas.add(node);
        }

        else if (subAction[0] == 'updateArms') {
            let ancestor = subAction[1];
            let update = subAction[2];

            for (let coord of update) {
                coord[0] = (-1) * coord[0];
                coord[1] = (-1) * coord[1];
            }
            ancestor.updateArmCoords(update);
        }

        else if (subAction[0] == 'moveSubtree') {
            let root = subAction[1];
            subAction[2] = (-1) * subAction[2];
            subAction[3] = (-1) * subAction[3];
            root.moveSubtreeBy(subAction[2], subAction[3]);
        }

        else if (subAction[0] == 'textEdited') {
            subAction[1].set({ text: subAction[3] });
            subAction[1].updateVerticalSpace();
            canvas.renderAll();
        }
    }

}
