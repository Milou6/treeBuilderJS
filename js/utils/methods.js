// IDEA : Make nodes initially small, grow as needed!


function resolveIntersections(node) {
    let intersectingObjects = [];
    let group = null;
    let objectMembers = [];

    // TO-DO : SHOULD RESET intersectingObjs AFTER MANAGING 1ST INTERS
    for (object of canvas.getObjects()) {
        if (object.type == 'polyline' && object != node && object != node.nodeParent) {
            // create group of node to check
            objectMembers = [];
            objectMembers.push(object);
            for (let text of object.textNodes) {
                objectMembers.push(text);
            }
            // console.log(objectMembers);
            group = new fabric.Group(objectMembers, {});
            // console.log(group.aCoords);

            if (node.intersectsWithObject(group)) {
                intersectingObjects.push({
                    object: object,
                    groupCoords: group.aCoords
                });
                // object.set({ stroke: 'blue' });
            }
            // Important to destroy group after intersection checking is done
            group.destroy();
        }
    }
    // console.log(intersectingObjects);

    if (intersectingObjects.length > 0) {
        resolveIntersectionX(node, intersectingObjects[0]);
    }


}



function resolveIntersectionX(node, objectGroup) {
    let nodeTL = node.aCoords.tl.x;
    let nodeTR = node.aCoords.tr.x;
    let objectGroupTL = objectGroup.groupCoords.tl.x;
    let objectGroupTR = objectGroup.groupCoords.tr.x;
    let intersection = '';

    if (nodeTL < objectGroupTL && objectGroupTL < nodeTR) intersection = 'right';
    else intersection = 'left';
    console.log(intersection);

    // Horizontal movement depends on which kind of intersection it is
    let movementX = 0;
    if (intersection == 'right') {
        movementX = nodeTR - objectGroupTL + 40;
        ancestorFind = findFirstCommonAncestor(node, objectGroup.object);
        // objectGroup.object.moveNodeBy(movementX, 0);
    }
    else if (intersection == 'left') {
        movementX = objectGroupTR - nodeTL + 40;
        ancestorFind = findFirstCommonAncestor(objectGroup.object, node);
        // node.moveNodeBy(movementX, 0);
    }


    if (ancestorFind != null) {
        let ancestor = ancestorFind[0];
        let ancestorHover = ancestorFind[1];
        let ancestorHoverIndex = ancestor.hoverCircles.indexOf(ancestorHover);
        console.log(ancestorHoverIndex);

        console.log(ancestor.armsArray);

        let armsToChange = [];
        // Looping through the ancestor's armsArray to update arm coords
        for (let i = 0; i < ancestor.armsArray.length; i++) {
            if (i < ancestorHoverIndex) {
                // left-most hoverCircles need no change of coords
                armsToChange.push([0, 0]);
            }
            else {
                // right-most hoverCircles must be pushed to the right
                armsToChange.push([movementX, 0]);
                // for each arm pushed, push subtree below that arm (if there is a subtree)
                if (ancestor.hoverCircles[i].childNode != null) {
                    ancestor.hoverCircles[i].childNode.moveSubtreeBy(movementX, 0);
                }
            }

        }
        console.log(armsToChange);


        // update arms
        ancestor.updateArmCoords(armsToChange);
    }

}






// node1, node2,
// hoverToFind : which hover to return? parentHover going down to node1 or to node2?

// should return ancestor + hoverCircle of ancestor that leads to arg2


/**
 * Finds the first ancestor TreeNode of node1 & node2.
 * 
 * @param {*} node1
 * @param {*} node2
 * @returns {Object} - An object with 2 elements. index[0] is the ancestor TreeNode, index[1] is the ancestor's hoverCircle that leads to node2.
 */
function findFirstCommonAncestor(node1, node2) {
    let node1Ancestors = [];
    let node2Ancestors = [];
    let ancestorFound = false;
    let filteredArray = [];
    let hover1 = null;
    let hover2 = null;
    let passedHover = null;

    let loopCounter = 0;
    while (ancestorFound == false) {
        // Fail-safe to keep method from running infinitely
        if (loopCounter > 100) {
            console.error(`${loopCounter} iterations : no ancestor found.`);
            return null;
        }
        loopCounter += 1;

        // save hover info to pass on to super-method
        hover1 = node1.hoverParent;
        hover2 = node2.hoverParent;

        if (node1.nodeParent != null) {
            node1 = node1.nodeParent;
            node1Ancestors.push(node1);
        }

        if (node2.nodeParent != null) {
            node2 = node2.nodeParent;
            node2Ancestors.push(node2);
        }

        // Alternative method to filter arrays
        // var arraysIntersection = node1Ancestors.filter(function(n) {
        //     return node2Ancestors.indexOf(n) !== -1;
        // });
        filteredArray = node1Ancestors.filter(value => node2Ancestors.includes(value));
        if (filteredArray.length > 0) {
            ancestorFound = true;
            console.log('ancestor found');
            // console.log(filteredArray);
        }
    }

    // keep going with the hover side, until we hit the ancestor
    if (node2 == filteredArray[0]) {
        passedHover = hover2;
    }
    else {
        // keep going up with node until we hit the ancestor, then save the hover that lead to it
        while (node2 != filteredArray[0]) {
            passedHover = node2.hoverParent;
            node2 = node2.nodeParent;
        }
    }
    // return ancestor + correct hover that leads to node2
    return [filteredArray[0], passedHover];
}



function spaceOutIntersections(node) {
    let intersectingObjects = [];

    for (object of canvas.getObjects()) {
        if (object.type == 'treeNode' && object != node && node.intersectsWithObject(object)) {
            // allNodes.push(object);
            intersectingObjects.push(object);
        }
    }

    for (object of intersectingObjects) {
        let nodeTL = node.aCoords.tl.x;
        let nodeTR = node.aCoords.tr.x;
        let objectTL = object.aCoords.tl.x;
        let objectTR = object.aCoords.tr.x;
        let intersection = '';

        if (nodeTL < objectTL && objectTL < nodeTR) intersection = 'right'
        else intersection = 'left'
        console.log(intersection);

        // let rightIntersection = Math.abs(nodeTR - objectTL);
        // let leftIntersection = Math.abs(nodeTL - objectTR);

        // intersection = Math.min(rightIntersection, leftIntersection) == rightIntersection ? 'right' : 'left';

        let ancestorFind = null;
        let movement = null;
        if (intersection == 'right') {
            movement = nodeTR - objectTL + 40;
            // movement = objectTR - nodeTL + 40;
            moveNodeBy(object, movement, 0);
            ancestorFind = findFirstCommonAncestor(node, object, 'right');
        }
        else if (intersection == 'left') {
            movement = objectTR - nodeTL + 40;
            moveNodeBy(node, movement, 0);
            ancestorFind = findFirstCommonAncestor(node, object, 'left');
        }

        let ancestor = ancestorFind[0];
        console.log('ancestor :');
        console.log(ancestor);
        let ancestorHover = ancestorFind[1];
        console.log(`ancestorHover : ${ancestorHover}`);
        console.log(ancestorHover);

        let hoverIndex = ancestor.hoverCircles.indexOf(ancestorHover);
        console.log(`hoverIndex : ${hoverIndex}`);
        console.log(`movement : ${movement}`);

        // create new armsArray for ancestor, but updating coords of the arm that needs to get longer
        let newArray = [];
        for (let i = 0; i < ancestor.armsArray.length; i++) {
            if (i == hoverIndex) {
                newArray.push([ancestor.armsArray[i][0] + movement, ancestor.armsArray[i][1]]);
                // newArray.push([ancestor.armsArray[i][0] + nodeTR - objectTL + 40, ancestor.armsArray[i][1]]);
            }
            else {
                newArray.push(ancestor.armsArray[i]);
            }
        }
        console.log(`newArray: ${newArray}`);

        ancestor.changeArms(newArray);
        // Alternative to re-render all canvas
        // canvas.requestRenderAll();
        canvas.renderAll();
        console.log(ancestor);

        // TRYING OUT
        // GOTTA MAKE CHILDREN MOVE TOO...
        // spaceOutIntersections(ancestor);

    }


}






/**
 * Returns the vertical offset of a TreeNode object.
 * \n
 * This offset is needed to correctly position the TreeNode in respect to its boundingRect().
 * 
 * @param {Array} array - the arm-coords array of a TreeNode object
 */
function getVertOffset(array) {
    let yCoords = [];
    for (point of array) {
        yCoords.push(point[1]);
    }
    return (Math.max(...yCoords) / 2);
}

/**
 * Returns the horizontal offset of a TreeNode object.
 * \n
 * This offset is needed to correctly position the TreeNode in respect to its boundingRect().
 * 
 * @param {Array} array - the arm-coords array of a TreeNode object
 */
function getHorizOffset(array) {
    let nodeWidth = getNodeWidth(array);
    let xCoords = [];
    for (point of array) {
        xCoords.push(point[0]);
    }
    let min = Math.abs(Math.min(...xCoords));
    // let max = Math.max(...xCoords);

    return (nodeWidth / 2) - min;
}

/**
 * Returns the total width of a TreeNode object.
 * 
 * @param {Array} array - the arm-coords array of a TreeNode object
 */
function getNodeWidth(array) {
    let xCoords = [];
    for (point of array) {
        xCoords.push(point[0]);
    }
    let min = Math.abs(Math.min(...xCoords));
    let max = Math.max(...xCoords);

    return min + max;
    // return Math.sqrt(Math.pow(min, 2) + Math.pow(height, 2)) + Math.sqrt(Math.pow(max, 2) + Math.pow(height, 2));
}


/**
 * Sets the global variable 'selectedButton' of canvas.js
 * 
 * @param {string} button - toolbar button to set as selected
 */
function setSelectedButton(button) {
    selectedButton = button.id;
    // console.log(selectedButton);
    let buttons = document.getElementsByClassName('btn');

    // console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    button.classList.add('active');
}


/**
 * When dragging a bottom hoverCircle, on mouse release, check if the drag is legal.
 * Returns true if drag is illegal (= user wants to move TreeNode arm to the opposite side of node)
 * , false otherwise.
 * 
 * @param {*} hoverCircle - the Circle that we're trying to drag
 * @param {*} delta - difference between Circle position on mouse:down & mouse:up
 * @returns {boolean} - is the drag illegal?
 */
function wantsToCrossMiddle(hoverCircle, delta) {
    let parentX = hoverCircle.parentNode.X;
    let hoverX = hoverCircle.X;

    // if hover was initially to the left of node middle
    if (hoverX < parentX) {
        if ((hoverX + delta.x) > parentX) return true;
    }
    if (hoverX > parentX) {
        if ((hoverX + delta.x) < parentX) return true;
    }
    return false;
}