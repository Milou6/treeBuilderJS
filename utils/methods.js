
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

// node1, node2,
// hoverToFind : which hover to return? parentHover going down to node1 or to node2?
function findFirstCommonAncestor(node1, node2, hoverToFind) {
    let node1Ancestors = [];
    let node2Ancestors = [];
    let ancestorFound = false;
    let filteredArray = [];
    let hover1 = null;
    let hover2 = null;
    let passedHover = null;

    while (ancestorFound == false) {
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

            // find out which hover should be passed
            // if (hover1.parentNode == filteredArray[0]) passedHover = hover1
            // else passedHover = hover2
        }
    }

    // keep going with the hover side, until we hit the ancestor
    let secondRun = hoverToFind == 'right' ? node2 : node1;
    if (secondRun == filteredArray[0] && hoverToFind == 'right') {
        passedHover = hover2;
    }
    else if (secondRun == filteredArray[0] && hoverToFind == 'left') {
        passedHover = hover1;
    }
    else {
        // keep going up with node until we hit the ancestor, then save the hover that lead to it
        while (secondRun != filteredArray[0]) {
            passedHover = secondRun.hoverParent;
            secondRun = secondRun.nodeParent;
        }
    }
    // return ancestor + correct hover to it
    return [filteredArray[0], passedHover];
}


// function moveNodeBy(node, moveX, moveY) {
//     // console.log(`horiz offset: ${getHorizOffset(node.armsArray)}`);
//     // move the node itself
//     node.set({ left: node.X + getHorizOffset(node.armsArray) + moveX, top: node.Y + getVertOffset(node.armsArray) + moveY });
//     node.set({ dirty: true });
//     // move each of its hoverCircles
//     for (circle of node.hoverCircles) {
//         circle.set({ X: circle.X + moveX, Y: circle.Y + moveY });
//         circle.set({ dirty: true });
//         console.log('hover moved');
//         // console.log(circle);
//     }
//     // canvas.renderAll();
// }









function getVertOffset(array) {
    let yCoords = [];
    for (point of array) {
        yCoords.push(point[1]);
    }
    return (Math.max(...yCoords) / 2);
}

function getHorizOffset(array) {
    let nodeWidth = getNodeWidth(array);
    let xCoords = [];
    for (point of array) {
        xCoords.push(point[0]);
    }
    let min = Math.abs(Math.min(...xCoords));
    let max = Math.max(...xCoords);

    return (nodeWidth / 2) - min;
}

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



function setSelectedButton(choice) {
    selectedButton = choice;
}