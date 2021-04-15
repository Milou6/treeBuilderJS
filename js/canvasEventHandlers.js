function canvasMouseMove(e) {
    // we have to use absolutePointer, otherwise zoom messes up the text Coords!!
    Coordstext.set({ text: `X : ${e.absolutePointer.x.toFixed(0)},  Y : ${e.absolutePointer.y.toFixed(0)}` });

    // This is for dragging the canvas w/ the mouse 
    if (this.panning && e && e.e) {
        let delta = new fabric.Point(e.e.movementX, e.e.movementY);
        canvas.relativePan(delta);
    }


    // ALL LOGIC FOR CREATING ARROWS DOWN HERE
    if (selectedButton == 'arrow') {
        allTexts = canvas.getObjects('nodeText');

        for (let text of allTexts) {
            let textCenter = text.getCenterPoint();
            if (Math.abs(textCenter.x - e.absolutePointer.x) < 90 && Math.abs(textCenter.y - e.absolutePointer.y) < 90) {

                // for (let pointer of text.pointerCircles) {
                for (let i = 0; i < text.numberLines * 2; i++) {
                    let point = text.pointerCircles[i];
                    // let point2 = text.pointerCircles[i * 2];
                    // ... check distance of possible point to mouse ...
                    if (Math.abs(point.left - e.absolutePointer.x) < 60 && Math.abs(point.top - e.absolutePointer.y) < 20 && point.arrow == null) {
                        // ... and set opacity accordingly
                        point.set({ opacity: 0.4 });
                        // if (!canvas.contains(point)) { // Not re-adding pointers anymore
                        //     canvas.add(point);
                        // }
                    }
                    else { point.set({ opacity: 0 }); }
                    // else { canvas.remove(point); }


                }

            } // first if Math.abs

            else {
                for (point of text.pointerCircles) {
                    point.set({ opacity: 0 });
                    // canvas.remove(point);
                }
            }
        }
    }
    canvas.renderAll();
}

var globalTriangleSelected = null;
function canvasMouseDown(e) {
    if (e.target != null) {
        var target = e.target;
        origPos = target.getCenterPoint();
        if (target.type == 'triangle') { globalTriangleSelected = target; } // For arrowTip moving
        // console.log(globalTriangleSelected);
    }

    else {
        // for zoom function
        this.panning = true;
        // debug zoom function
        // console.log(e);
        console.log(canvas);
    }
}

// function canvasMouseMove(e) {

// }

function canvasMouseUp(e) {
    if (e.target != null) {
        var target = e.target;
        console.log(target);

        try {
            delta = target.getCenterPoint().subtract(origPos);
        }
        catch {
            delta = 0;
        }
        // console.log(delta.x, delta.y);


        // this array will contain all sub-actions caused by user click
        let histAction = [];


        // if the hoverCircle was dragged more than 20px left or right, activate its movement
        if (target.hoverType == 'bottom' && Math.abs(delta.x) > 20) {

            // second check : make sure user cannot drag an arm past the middle of its node
            if (!wantsToCrossMiddle(target, delta)) {
                histAction.push(['moveCircle', target, delta.x]);
                target.set({ X: target.X + delta.x });
                target.set({ left: target.X, dirty: true });
                target.setCoords();

                // We have to find the corresponding arm to update
                let parent = target.parentNode;
                // console.log(parent.hoverCircles);
                // console.log(target);
                let hoverIndex = parent.hoverCircles.indexOf(target);

                for (circle of parent.hoverCircles) { // WHAT the hell does this do??
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

        else if (target.type == 'arrowHandler' && Math.abs(delta.x) > 3) {
            // console.log('HANDLER ACTION');
            // checking that handler move is permitted
            if (target.isMovePermitted(target.getCenterPoint())) {
                console.log('PERMITTED');
            }
            else {
                // if move not permitted
                target.set({
                    left: target.arrow.left - target.arrow.endCoords.x,
                    top: target.arrow.top - (target.arrow.endCoords.y / 2)
                });
                target.setCoords();

            }
        }

        // otherwise, count the 'mouse:up' as a simple click
        else {
            if (target.type == 'hoverCircle') {

                if (target.hoverType == 'bottom' && !target.hasChildNode && target.attachedNodeText.attachedTriangle == null && selectedButton == 'binaryNode') {

                    if (target.parentNode == root || target.parentNode.isOnTreeSpine != null) {

                        // is new node coming from left or right side of parentNode?
                        // depending on it, we'll nudge new node left or right 
                        let sidewaysNudge = 0;
                        let spineLabel = null;
                        if (target.parentNode.hoverCircles.indexOf(target) == 0 && (target.parentNode.isOnTreeSpine == 'left' || target.parentNode == root)) {
                            sidewaysNudge = -30;
                            spineLabel = 'left';
                        }
                        else if (target.parentNode.hoverCircles.indexOf(target) != 0 && (target.parentNode.isOnTreeSpine == 'right') || target.parentNode == root) {
                            sidewaysNudge = 30;
                            spineLabel = 'right';
                        }

                        var newNode = new fabric.TreeNode(target.left + 12 + sidewaysNudge, target.top + 30, _.cloneDeep(nodeShape), target.parentNode, target, []);
                        newNode.isOnTreeSpine = spineLabel;
                    }
                    else {
                        var newNode = new fabric.TreeNode(target.left + 12, target.top + 30, [[-50, 30], [50, 30]], target.parentNode, target, []);
                        // var newNode = new fabric.TreeNode(target.left + 12, target.top + 40, [[-60, 50], [60, 50]], target.parentNode, target, []);
                    }
                    // var newNode = new fabric.TreeNode(target.left + 12, target.top + 50, [[-50, 50], [50, 50]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;

                    resolveIntersections(newNode, histAction);
                    // if the hoverCircle's textNode is multiple lines long, make sure to push new node a bit down
                    // console.log(target.childNode);
                    target.attachedNodeText.setInitVerticalSpace();
                    histAction.push(['addedChild', target, target.childNode]);
                    histAction.push(['nodeAdded', newNode]);
                    console.log(histAction);
                    canvasHist.undoPush(histAction);

                    // myHistory.undoPush();
                    // console.log(myHistory.undoStack);
                }

                else if (target.hoverType == 'bottom' && !target.hasChildNode && target.attachedNodeText.attachedTriangle == null && selectedButton == 'singleNode') {
                    var newNode = new fabric.TreeNode(target.left + 12, target.top + 50, [[0, 60]], target.parentNode, target, []);
                    canvas.add(newNode);
                    // set boolean on hoverCircle to disable adding new children to it
                    target.hasChildNode = true;
                    target.childNode = newNode;

                    resolveIntersections(newNode, histAction);
                    target.attachedNodeText.setInitVerticalSpace();

                    histAction.push(['addedChild', target, target.childNode]);
                    histAction.push(['nodeAdded', newNode]);
                    canvasHist.undoPush(histAction);
                }

                else if (target.hoverType == 'top' && target.parentNode.nodeParent == null && selectedButton == 'binaryNode' && !e.e.shiftKey) {
                    // var newNode = new fabric.TreeNode(target.X + 12 - 50, target.Y - 60 - 20, [[-50, 50], [50, 50]], null, null, []);
                    // targetX - fullNodeWidth - halfCircle
                    var newNode = new fabric.TreeNode(target.left - 60 - 6, target.top - 30 - 30, _.cloneDeep(nodeShape), null, null, []);
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
                    // var newNode = new fabric.TreeNode(target.X + 12 + 50, target.Y - 60 - 20, [[-50, 50], [50, 50]], null, null, []);
                    var newNode = new fabric.TreeNode(target.left + 60 + 12 + 30, target.top - 30 - 30, _.cloneDeep(nodeShape), null, null, []);
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

            // this one must come before the basic arrow event below
            else if (target.type == 'pointerCircle' && selectedButton == 'arrow' && globalTriangleSelected != null) {
                // only perform move if both pointers on the same side of nodeText
                if (globalTriangleSelected.pointer.textSide == target.textSide) {
                    console.log('ARROW TRIANGLE MOVE');
                    let arrow = globalTriangleSelected.pointer.arrow;
                    if (arrow.tipStart == globalTriangleSelected) {
                        arrow.tipStart.pointer.arrow = null;
                        // update attrib of arrow tip
                        arrow.tipStart.pointer = target;
                        // arrow.tipStart.pointer.arrow = arrow;
                        arrow.arrowStart = target;
                        arrow.arrowStart.arrow = arrow;
                        // recalculate arrow Position
                        arrow.updateArrowPosition();
                    }
                    else {
                        arrow.tipEnd.pointer.arrow = null;
                        // update attrib of arrow tip
                        arrow.tipEnd.pointer = target;
                        // arrow.tipStart.pointer.arrow = arrow;
                        arrow.arrowEnd = target;
                        arrow.arrowEnd.arrow = arrow;
                        arrow.updateArrowPosition();
                    }
                }
            }

            else if (target.type == 'pointerCircle' && selectedButton == 'arrow') {
                // console.log('touch');
                if (arrowStart == null) {
                    arrowStart = target;
                }
                else {
                    arrowEnd = target;
                }

                if (arrowStart != null && arrowEnd != null && arrowStart != arrowEnd) {
                    // before making arrow, check if arrowStart/arrowEnd need a SWAP
                    if (arrowStart.top < arrowEnd.top) { [arrowStart, arrowEnd] = [arrowEnd, arrowStart]; }

                    // create arrow
                    let newArrow = new fabric.Arrow(arrowStart, arrowEnd, []);
                    canvas.add(newArrow);
                    canvas.renderAll();

                    // link pointerCircles to the new arrow
                    arrowStart.arrow = newArrow;
                    arrowEnd.arrow = newArrow;

                    console.log('ARROWWWWWWWWW');
                    console.log(newArrow);

                    // add move to history
                    histAction.push(['arrowAdded', newArrow]);
                    canvasHist.undoPush(histAction);


                    // reset global vars at the end
                    arrowStart = null;
                    arrowEnd = null;
                }





            } // arrow




            // if (target.type == 'hoverCircle' && target.hoverType == 'bottom' && !target.hasChildNode && selectedButton == 'singleNode') {
            // }
        } // else



    }
    // for zoom function
    this.panning = false;
    globalTriangleSelected = null;
}