var HoverCircle = fabric.util.createClass(fabric.Circle, {
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
        this.X = X + this.parentNode.pathOffset.x;
        this.Y = Y - this.parentNode.pathOffset.y;

        this.set({ hasControls: false, hasBorders: false });
        this.set({ left: this.X, top: this.Y, radius: 10, fill: 'rgba(0,255,0,0.1)', selectable: true, lockMovementY: true });
        // this.set({ left: this.X, top: this.Y, radius: 10, fill: 'rgba(0,255,0,0)', selectable: true, lockMovementY: true });
        // this.set({ pathOffset: { x: 0, y: 25 } }); //Maybe not for circle

        if (this.hoverType == 'top') {
            this.set({ lockMovementX: true });
        }

        this.on('mouseover', function (e) {
            // Make circle opaque on hover-in
            e.target.set('fill', 'rgba(0,255,0,1)');
            canvas.renderAll();
        });
        this.on('mouseout', function (e) {
            // Make circle translucent on hover-out
            e.target.set('fill', 'rgba(0,255,0,0.1)');
            // e.target.set('fill', 'rgba(0,255,0,0)');
            canvas.renderAll();
        });
        // this.on('mousedown', function (e) {
        //     this.origPos = this.getCenterPoint();
        // });
        // this.on('mouseup', function (e) {
        //     delta = this.getCenterPoint().subtract(this.origPos);
        //     console.log(delta.x, delta.y);
        //     this.set({ X: this.X + delta.x });
        //     this.parentNode.updateArmCoords([[0, 0], [delta.x, 0]]);

        //     if (this.childNode != null) {
        //         this.childNode.moveSubtreeBy(delta.x, 0);
        //     }
        // });
    },

    _render: function (ctx) {
        // This version offsets the Y coord correctly
        this.set({ left: this.X, top: this.Y });
        this.setCoords(); // this line makes the hoverCircle update coords correctly... let's keep that
        this.callSuper('_render', ctx);
    }
});