/**
 * Updates the coords of each arm of the TreeNode.
 * 
 * For example, for myTreeNode with arm coords [[-80,70], [80,70]]
 * myTreeNode.updateArmCoords([[-70, 20], [20, 30]]);
 * 
 * myTreeNode now has arm coords [[-150, 90], [100, 100]].
 * 
 * @param {Array} coordUpdates - Array containing the changes to make to each arm
 */
fabric.Polyline.prototype.updateArmCoords = function (coordUpdates) {
    // console.log('UPDATINGARMS');
    if (coordUpdates.length != this.armsArray.length) {
        console.error("updateArmCoords: new array length different from old array length");
    }

    for (let i = 0; i < this.armsArray.length; i++) {
        // setting new X of each arm
        this.armsArray[i][0] = this.armsArray[i][0] + coordUpdates[i][0];
        // setting new Y of each arm
        this.armsArray[i][1] = this.armsArray[i][1] + coordUpdates[i][1];
        // console.log('changing arms');
    }
    // console.log(this.armsArray);

    // Difference between the horizOffset of old & new arm coords arrays
    let horizOffsetDifference = getHorizOffset(this.armsArray) - this.horizOffset; // dont set it just yet
    // console.log(horizOffsetDifference);

    // We need to move the TreeNode before redrawing the arms, 
    // and also before recalculating new this.horizOffset
    this.moveNodeBy(horizOffsetDifference, 0);
    this.horizOffset = getHorizOffset(this.armsArray);


    // deleting all old points from polyline
    this.points = [];
    // resetting width, height, coords, pathOffset, all according to new arm coords
    this.nodeWidth = getNodeWidth(this.armsArray);
    this.vertOffset = getVertOffset(this.armsArray);
    this.set({ width: this.nodeWidth, height: this.vertOffset * 2 });
    this.set({ pathOffset: { x: this.horizOffset, y: this.vertOffset } });
    this.set({ X: this.X - horizOffsetDifference });
    // Line below fixes width/height issues
    this.setCoords();

    let point = [];
    for (let i = 0; i < this.armsArray.length; i++) {
        point = this.armsArray[i];
        // adding the new arm coords to the polyline points
        this.points.push({ x: point[0], y: point[1] });
        this.points.push({ x: 0, y: 0 });

        // resetting correct bottom-hoverCircle coords
        this.hoverCircles[i].set({ X: this.X + point[0] - 12, Y: this.Y + point[1] - 12 });
        // this.hoverCircles[i].set({ X: this.X + point[0] - 12 - this.horizOffset, Y: this.Y + point[1] - 12 });
        this.hoverCircles[i].set({ left: this.hoverCircles[i].X, top: this.hoverCircles[i].Y });
        this.hoverCircles[i].setCoords();

        // resetting correct bottom-textNode coords
        this.textNodes[i].set({ X: this.X + point[0]  /*- this.horizOffset*/, Y: this.Y + point[1] /*+ this.vertOffset*/ + 25 - 12 });
        this.textNodes[i].set({ left: this.textNodes[i].X, top: this.textNodes[i].Y });
        this.textNodes[i].setCoords();
        // this.textNodes[i].alreadyHasPointers = false; // FKIN LINES BREAKING MY CODE
        // this.textNodes[i].deletePointers();

        // if text has attached triangle, move as well
        if (this.textNodes[i].attachedTriangle != null) {
            let tri = this.textNodes[i].attachedTriangle;
            tri.set({ left: this.textNodes[i].X + tri.relativeX, top: this.textNodes[i].Y + tri.relativeY, dirty: true });
            tri.setCoords();
            // move secondary text if present
            this.textNodes[i].moveSecondaryText();
        }
        // move text pointerCircles as well
        this.textNodes[i].updatePointerCircles();
    }

    // resetting correct top-hoverCircle coords
    // this.hoverCircles[this.hoverCircles.length - 1].set({ X: this.X - 12, Y: this.Y - 12 });
    this.hoverCircles[this.hoverCircles.length - 1].set({ X: this.X - 12, Y: this.Y - 12 });
    this.hoverCircles[this.hoverCircles.length - 1].set({ left: this.hoverCircles[this.hoverCircles.length - 1].X, top: this.hoverCircles[this.hoverCircles.length - 1].Y });
    this.hoverCircles[this.hoverCircles.length - 1].setCoords();
    canvas.renderAll();
}

/**
 * Move the TreeNode in the canvas.
 * The function recalculates the position of each of the TreeNode's hoverCircles & nodeTexts.
 * 
 * @param {number} moveX - how much horizontal movement (negative value moves the TreeNode to the left)
 * @param {number} moveY - how much vertical movement (negative value moves the TreeNode upwards)
 */
fabric.Polyline.prototype.moveNodeBy = function (moveX, moveY) {
    // move the node itself
    this.set({ X: this.X + moveX, Y: this.Y + moveY });

    // important to add horizOffset to left: here
    this.set({ left: this.X + this.horizOffset, top: this.Y });
    this.set({ dirty: true });
    this.setCoords();

    // move each of the TreeNode's hoverCircles
    for (circle of this.hoverCircles) {
        circle.set({ X: circle.X + moveX, Y: circle.Y + moveY }); // horizOffset also here
        circle.set({ left: circle.X, top: circle.Y }); // horizOffset also here
        circle.set({ dirty: true });
        circle.setCoords();
    }
    // move each of of the TreeNode's textNodes
    for (text of this.textNodes) {
        text.set({ X: text.X + moveX, Y: text.Y + moveY });
        text.set({ left: text.X, top: text.Y, dirty: true });
        text.setCoords();
        // if text has attached triangle, move as well
        if (text.attachedTriangle != null) {
            let tri = text.attachedTriangle;
            tri.set({ left: text.X + tri.relativeX, top: text.Y + tri.relativeY, dirty: true });
            tri.setCoords();
            // move secondary text if present
            text.moveSecondaryText();
        }
        // move text pointerCircles as well
        text.updatePointerCircles();
    }

    // update arrows positioning if needed
    //     for (let arrow of globalArrowsToUpdate) {
    //         arrow.updateArrowPosition();
    //     }
    //     globalArrowsToUpdate.clear();
}

fabric.Polyline.prototype.moveSubtreeBy = function (moveX, moveY) {
    // console.log("Moving subtree");
    // console.log(this.getChildNodes());
    this.moveNodeBy(moveX, moveY);

    for (child of this.getChildNodes()) {
        child.moveSubtreeBy(moveX, moveY);
    }

    canvas.renderAll();
}

/**
 * @returns {Array} - Array of TreeNode objects that are children of this node
 */
fabric.Polyline.prototype.getChildNodes = function () {
    let result = [];
    for (let i = 0; i < this.hoverCircles.length - 1; i++) {
        // for (circle of this.hoverCircles) {
        let child = this.hoverCircles[i].childNode;
        // let child = circle.childNode;
        if (child != null) result.push(child);
    }
    // if (result.length > 0) result.pop();
    return result;
}

fabric.Polyline.prototype.delete = function () {
    for (let circle of this.hoverCircles) {
        this.canvas.remove(circle);
    }
    for (let text of this.textNodes) {
        this.canvas.remove(text);
    }
    this.canvas.remove(this);
}





fabric.TreeNode = fabric.util.createClass(fabric.Polyline, {
    // Type below must be 'polyline' for SVG export to work properly
    type: 'treeNode',

    /**
     * Creates a new TreeNode object.
     * Example: var myNode = new TreeNode(100, 100, [[-80, 70], [80, 70]], null, null, [],);
     * @constructor
     * @param {number} X - horizontal coord of the TreeNode top
     * @param {number} Y - vertical coord of the TreeNode top
     * @param {Array} armsArray - contains the tip coords of each TreeNode arm
     * @param {TreeNode} nodeParent - this TreeNode's parent (node just above it)
     * @param {hoverCircle} hoverParent - the specific hoverCircle that connects this TreeNode to its parent
     */
    initialize: function (X, Y, armsArray, nodeParent, hoverParent, options) {
        options || (options = {});
        // callSuper() to initialize fabricJS Polyline
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.armsArray = armsArray;
        this.nodeParent = nodeParent;
        this.hoverParent = hoverParent;
        this.customType = 'polyline';
        this.historyID = setHistoryID();
        this.isOnTreeSpine = false;

        // Arrays containing this node's hoverCircles & textNodes
        this.hoverCircles = [];
        this.textNodes = [];
        // horizOffset & vertOffset needed for proper alignment of a TreeNode's boundingRect
        this.horizOffset = getHorizOffset(this.armsArray);
        this.vertOffset = getVertOffset(this.armsArray);
        let nodeWidth = getNodeWidth(this.armsArray);

        this.set({ width: nodeWidth, height: this.vertOffset * 2, originX: 'center', originY: 'top' });
        this.set({ left: this.X, top: this.Y, fill: 'rgba(255, 255, 255, 1)', stroke: 'black', selectable: false });
        this.setCoords();

        // Dymanically setting the offset
        this.set({ pathOffset: { x: this.horizOffset, y: this.vertOffset } });
        // Correcting the X-coord of node top
        this.set({ X: this.X - this.horizOffset });


        for (point of this.armsArray) {
            // adding the arm coords to the polyline points
            this.points.push({ x: point[0], y: point[1] });
            this.points.push({ x: 0, y: 0 });

            // creating the bottom hoverCircles for each arm
            // var hoverCircle = new fabric.HoverCircle(this.X + point[0] - 12 - this.horizOffset, this.Y + point[1] - 12 + this.vertOffset, 'bottom', this);
            var hoverCircle = new fabric.HoverCircle(this.X + point[0] - 12, this.Y + point[1] - 12, 'bottom', this);
            hoverCircle.setCoords();
            canvas.add(hoverCircle);
            this.hoverCircles.push(hoverCircle);

            // creating the bottom textNodes
            var textNode = new fabric.NodeText(this.X + point[0]  /*- this.horizOffset*/, this.Y + point[1] /*+ this.vertOffset*/ + 25 - 12, this, hoverCircle, 'XP'); // The textNodes don't need coord offset apparently
            canvas.add(textNode);
            this.textNodes.push(textNode);
            // link hoverCircle & textNode together
            hoverCircle.attachedNodeText = textNode;
        }
        // creating the top hoverCircle
        // var topHoverCircle = new fabric.HoverCircle(this.X - 12 - this.horizOffset, this.Y - 12 + this.vertOffset, 'top', this);
        var topHoverCircle = new fabric.HoverCircle(this.X - 12 /*- this.horizOffset*/, this.Y - 12, 'top', this);
        canvas.add(topHoverCircle);
        this.hoverCircles.push(topHoverCircle);

        // Correcting the positioning of TreeNode on canvas
        this.moveNodeBy(this.horizOffset, 0);


        // this.on('drag:enter', function (e) {
        //     // console.log(e);
        //     console.log("dragenter");
        // });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        // console.log('rendering');
        // send node to back, to make sure hoverCircles are clickable
        canvas.sendToBack(this);
    },

    // ** CHANGE: export the custom method when serializing
    // toObject: function () {
    //     return fabric.util.object.extend(this.callSuper('toObject'), {
    //         X: this.X,
    //         Y: this.Y,
    //         armsArray: this.armsArray,
    //         nodeParent: this.nodeParent,
    //         hoverParent: this.hoverParent,
    //         hoverCircles: this.hoverCircles,
    //         textNodes: this.textNodes,
    //         horizOffset: this.horizOffset,
    //         vertOffset: this.vertOffset,
    //         nodeWidth: this.nodeWidth,
    //         selectable: this.selectable,
    //         pathOffset: this.pathOffset,
    //         customType: this.customType,
    //         historyID: this.historyID,

    //         updateArmCoords: this.updateArmCoords,
    //         moveNodeBy: this.moveNodeBy,
    //         moveSubtreeBy: this.moveSubtreeBy,
    //         getChildNodes: this.getChildNodes
    //     });
    // },

    // _fromObject: function (object, callback) {
    //     // return fabric.Object._fromObject('Polyline', object, callback);
    //     // return new fabric.TreeNode(this.X, this.Y, this.armsArray, this.nodeParent, this.hoverParent, []);
    //     return new fabric.TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
    // },


});




fabric.TreeNode.fromObject = function (object, callback) {
    console.log('fromObject() called');
    // return fabric.Object._fromObject('TreeNode', object, callback); // cannot read x of undef...
    return fabric.Object._fromObject('Polyline', object, callback, 'points'); // TY @asturur
    // return new fabric.TreeNode(1500, 1200, [[-80, 50], [80, 50]], null, null, [],);
};


// fabric.TreeNode.fromObject = function (object, callback) {
//     var _enlivenedObjects;
//     fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
//         delete object.objects;
//         _enlivenedObjects = enlivenedObjects;
//     });
//     return new fabric.TreeNode(_enlivenedObjects, object);
// };




// fabric.TreeNode.async = true;
