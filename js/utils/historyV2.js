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
        // console.log('UNDO-PUSH');

        this.undoStack.push(action);

        // Enable Undo button
        if (this.undoStack.length > 0) {
            $('#undoBtn').prop('disabled', false);
        }

        // Everytime an Action is made, we should clear the redoStack!?
        this.redoStack.length = 0;
        $('#redoBtn').prop('disabled', true);
    }

    undo() {
        // console.log('UNDO');

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

        // remove node and resolve parenthood
        else if (subAction[0] == 'upperNodeAdded') {
            subAction[1].hoverParent = null;
            subAction[1].nodeParent = null;
            for (let circle of subAction[2].hoverCircles) {
                this.canvas.remove(circle);
            }
            for (let text of subAction[2].textNodes) {
                for (let pointer of text.pointerCircles) {
                    this.canvas.remove(pointer);
                }
                this.canvas.remove(text);
            }
            this.canvas.remove(subAction[2]);
        }

        // simply remove node
        else if (subAction[0] == 'nodeAdded') {
            let node = subAction[1];

            for (let circle of node.hoverCircles) {
                this.canvas.remove(circle);
            }
            for (let text of node.textNodes) {
                for (let pointer of text.pointerCircles) {
                    this.canvas.remove(pointer);
                }
                this.canvas.remove(text);
            }
            this.canvas.remove(node);
        }

        // 1: node, 2: topText
        else if (subAction[0] == 'topTextRemoved') {
            subAction[1].textNodes.push(subAction[2]);
            canvas.add(subAction[2]);

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

        // 1: root moved, 2: delta.x of movement , 3: delta.y of movement
        else if (subAction[0] == 'moveSubtree') {
            let root = subAction[1];
            subAction[2] = (-1) * subAction[2];
            subAction[3] = (-1) * subAction[3];
            root.moveSubtreeBy(subAction[2], subAction[3]);
        }

        // 1: circle moved, 2: delta.x of movement // NOT USED ANYMORE, MIGHT BE ABLE TO DELETE?
        else if (subAction[0] == 'moveCircle') {
            let circle = subAction[1];
            subAction[2] = (-1) * subAction[2];
            console.log(subAction[2]);
            circle.set({ X: circle.X + subAction[2], dirty: true });
            circle.setCoords();
        }

        else if (subAction[0] == 'textEdited') {
            subAction[1].set({ text: subAction[2] });
            subAction[1].updateVerticalSpace();
            canvas.renderAll();
        }

        // 1: old node, 2: old parent , 3: hoverIndex (to re-bind hoverParent), 4: in.between node
        else if (subAction[0] == 'addedBetweenNode') {
            // re-bind the hoverParent using passed index
            subAction[1].hoverParent = subAction[2].hoverCircles[subAction[3]];
            subAction[1].nodeParent = subAction[2];

            // re-bind childNode of parent's hoverCircle
            subAction[2].hoverCircles[subAction[3]].childNode = subAction[1];
        }

        // 1: node deleted, 2: parent, 3: hoverParent, 4: childNode
        else if (subAction[0] == 'nodeRemoved') {
            let node = subAction[1];
            for (let circle of node.hoverCircles) {
                this.canvas.add(circle);
            }
            for (let text of node.textNodes) {
                for (let pointer of text.pointerCircles) {
                    this.canvas.add(pointer);
                }
                this.canvas.add(text);
            }
            this.canvas.add(node);
            // make sure hovers are clickable
            node.sendToBack();

            // re-attach parent to node and childNode to node
            try {
                subAction[3].hasChildNode = true;
                subAction[3].childNode = subAction[1];
            }
            catch { }
            try {
                subAction[4].nodeParent = subAction[1];
                subAction[4].hoverParent = subAction[1];
            }
            catch { }


        }

        else if (subAction[0] == '3rdArmAdded') {
            // subAction[1].hoverParent.childNode = subAction[1];
            try { subAction[1].hoverParent.childNode = subAction[1]; }
            catch { }
        }

        // 1: ternaryNode, 2: binaryNode
        else if (subAction[0] == '3rdArmRemoved') {
            subAction[1].hoverParent.childNode = subAction[1];
        }

        // 1: subtree
        else if (subAction[0] == 'subtreeRemoved') {
            subAction[1].reAddSubtree();
        }

        else if (subAction[0] == 'arrowAdded') {
            let arrow = subAction[1];
            arrow.arrowStart.arrow = null;
            arrow.arrowEnd.arrow = null;
            canvas.remove(arrow.tipStart, arrow.tipEnd, arrow.circleHandler, arrow);
            canvas.renderAll();
        }

        else if (subAction[0] == 'addedTriangle') {
            let tri = subAction[1];
            tri.attachedText.attachedTriangle = null;
            this.canvas.remove(tri);
            canvas.renderAll();
        }

        // 1: textNode, 2: secondaryText
        else if (subAction[0] == 'addedSecText') {
            subAction[1].secondaryText = null;
            subAction[1].text = subAction[1].text.concat('\n', subAction[2].text);
            this.canvas.remove(subAction[2]);
            canvas.renderAll();
        }

        else if (subAction[0] == 'removedTriangle') {
            let tri = subAction[1];
            tri.attachedText.attachedTriangle = tri;
            this.canvas.add(tri);
            canvas.renderAll();
        }

        // 1: textNode, 2: secondaryText, 3: textNode original text
        else if (subAction[0] == 'removedSecText') {
            subAction[1].secondaryText = subAction[2];
            this.canvas.add(subAction[2]);
            subAction[1].text = subAction[3];
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
                for (let pointer of text.pointerCircles) {
                    this.canvas.add(pointer);
                }
                this.canvas.add(text);
            }
            this.canvas.add(subAction[2]);
            subAction[2].sendToBack();
        }

        else if (subAction[0] == 'nodeAdded') {
            let node = subAction[1];

            for (let circle of node.hoverCircles) {
                this.canvas.add(circle);
            }
            for (let text of node.textNodes) {
                for (let pointer of text.pointerCircles) {
                    this.canvas.add(pointer);
                }
                this.canvas.add(text);
            }
            this.canvas.add(node);
            node.sendToBack();
        }

        // 1: node, 2: topText
        else if (subAction[0] == 'topTextRemoved') {
            subAction[1].textNodes.pop();
            canvas.remove(subAction[2]);

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

        // 1: old node, 2: old parent , 3: hoverIndex (to re-bind hoverParent), 4: in.between node
        else if (subAction[0] == 'addedBetweenNode') {
            // re-bind the hoverParent using passed index
            subAction[1].hoverParent = subAction[4].hoverCircles[subAction[3]];
            subAction[1].nodeParent = subAction[4];

            // re-bind childNode of parent's hoverCircle
            subAction[2].hoverCircles[subAction[3]].childNode = subAction[4];
        }

        // 1: node deleted, 2: parent, 3: hoverParent, 4: childNode
        else if (subAction[0] == 'nodeRemoved') {
            let node = subAction[1];
            for (let circle of node.hoverCircles) {
                this.canvas.remove(circle);
            }
            for (let text of node.textNodes) {
                for (let pointer of text.pointerCircles) {
                    this.canvas.remove(pointer);
                }
                this.canvas.remove(text);
            }
            this.canvas.remove(node);

            // re-attach parent to ((node)) childNode 
            try {
                subAction[3].hasChildNode = false;
                subAction[3].childNode = subAction[4];
            }
            catch { }
            try {
                subAction[4].nodeParent = subAction[2];
                subAction[4].hoverParent = subAction[3];
            }
            catch { }
        }

        else if (subAction[0] == '3rdArmAdded') {
            // subAction[1].hoverParent.childNode = subAction[2];
            try { subAction[1].hoverParent.childNode = subAction[2]; }
            catch { }
        }

        // 1: ternaryNode, 2: binaryNode
        else if (subAction[0] == '3rdArmRemoved') {
            subAction[1].hoverParent.childNode = subAction[2];
        }

        // 1: subtree
        else if (subAction[0] == 'subtreeRemoved') {
            subAction[1].deleteSubtree();
        }

        else if (subAction[0] == 'arrowAdded') {
            let arrow = subAction[1];
            arrow.arrowStart.arrow = arrow;
            arrow.arrowEnd.arrow = arrow;
            canvas.add(arrow.tipStart, arrow.tipEnd, arrow.circleHandler, arrow);
            canvas.renderAll();
        }

        else if (subAction[0] == 'addedTriangle') {
            let tri = subAction[1];
            tri.attachedText.attachedTriangle = tri;
            this.canvas.add(tri);
            canvas.renderAll();
        }

        // 1: textNode, 2: secondaryText, 3: textNode original text
        else if (subAction[0] == 'addedSecText') {
            subAction[1].secondaryText = subAction[2];
            this.canvas.add(subAction[2]);
            subAction[1].text = subAction[3];
            canvas.renderAll();
        }

        else if (subAction[0] == 'removedTriangle') {
            let tri = subAction[1];
            tri.attachedText.attachedTriangle = null;
            this.canvas.remove(tri);
            canvas.renderAll();
        }

        // 1: textNode, 2: secondaryText, 3: textNode original text
        else if (subAction[0] == 'removedSecText') {
            subAction[1].secondaryText = null;
            subAction[1].text = subAction[1].text.concat('\n', subAction[2].text);
            this.canvas.remove(subAction[2]);
            canvas.renderAll();
        }
    }

}


function undo() {
    canvasHist.undo();
    // myHistory.undo();
}

function redo() {
    canvasHist.redo();
    // myHistory.redo();
}