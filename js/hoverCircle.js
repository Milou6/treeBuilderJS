


fabric.HoverCircle = fabric.util.createClass(fabric.Circle, {
    type: 'hoverCircle',

    /**
     * Creates a clickable circle that hovers over a TreeNode's arms and top.
     * \n
     * Clicking on a TreeNode's circles appends a child/parent to the TreeNode.
     * 
     * @constructor
     * @param {*} X - horizontal coord of the hoverCircle
     * @param {*} Y - vertical coord of the hoverCircle
     * @param {string} hoverType - 'top' or 'bottom' : is this hoverCircle at the top of TreeNode, or over one of its arms?
     * @param {TreeNode} parentNode - the TreeNode this hoverCircle belongs to
     */
    initialize: function (X, Y, hoverType, parentNode, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.parentNode = parentNode;
        this.hoverType = hoverType;
        this.hasChildNode = false;
        this.childNode = null;
        this.attachedNodeText = null;
        this.X = X;
        this.Y = Y;
        // this.X = X + this.parentNode.pathOffset.x; // THIS MADE NO SENSE AT ALL
        // this.Y = Y - this.parentNode.pathOffset.y;
        this.customType = 'circle';
        this.historyID = setHistoryID();

        this.set({ hasControls: false, hasBorders: false });
        this.set({ left: this.X, top: this.Y, radius: 10, fill: 'rgba(0,255,0,0.1)', selectable: true, lockMovementY: true });
        this.setCoords();
        // this.set({ left: this.X, top: this.Y, radius: 10, fill: 'rgba(0,255,0,0)', selectable: true, lockMovementY: true });
        // this.set({ pathOffset: { x: 0, y: 25 } }); //Maybe not for circle

        if (this.hoverType == 'top') {
            this.set({ lockMovementX: true });
        }

        this.on('mouseover', hoverCircleMouseOver);
        this.on('mouseout', hoverCircleMouseOut);
    },

    _render: function (ctx) {
        // Any stuff here won't work on canvas load, so we take it off!! 
        // This version offsets the Y coord correctly
        // this.set({ left: this.X, top: this.Y });
        // this.setCoords(); // this line makes the hoverCircle update coords correctly... let's keep that
        this.callSuper('_render', ctx);
    },

    // ** CHANGE: export the custom method when serializing
    // toObject: function () {
    //     return fabric.util.object.extend(this.callSuper('toObject'), {
    //         // updateArmCoords: this.updateArmCoords,
    //         // moveNodeBy: this.moveNodeBy,
    //         // moveSubtreeBy: this.moveSubtreeBy,
    //         // getChildNodes: this.getChildNodes
    //     });
    // },

    // _toObject: function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //         X: "asd"
    //         // Y: this.Y,
    //         // hoverType: this.hoverType
    //     });
    // }
});


fabric.HoverCircle.fromObject = function (object, callback) {
    // console.log(object)
    return fabric.Object._fromObject('Circle', object, callback);
};



function hoverCircleMouseOver(e) {
    // Make circle opaque on hover-in
    e.target.set('fill', 'rgba(0,255,0,1)');
    canvas.renderAll();
}

function hoverCircleMouseOut(e) {
    // Make circle translucent on hover-out
    e.target.set('fill', 'rgba(0,255,0,0.1)');
    // e.target.set('fill', 'rgba(0,255,0,0)');
    canvas.renderAll();
}

