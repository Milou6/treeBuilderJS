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
        this.X = X;
        this.Y = Y;
        this.hoverType = hoverType;
        this.parentNode = parentNode;
        this.hasChildNode = false;

        this.set({ left: this.X, top: this.Y, radius: 10, fill: 'rgba(0,255,0,0.1)', selectable: false });
        // this.set({ pathOffset: { x: 0, y: 25 } }); //Maybe not for circle

        this.on('mouseover', function (options) {
            // Make circle opaque on hover-in
            options.target.set('fill', 'rgba(0,255,0,1)');
            canvas.renderAll();
        });
        this.on('mouseout', function (options) {
            // Make circle translucent on hover-out
            options.target.set('fill', 'rgba(0,255,0,0.1)');
            canvas.renderAll();
        });
    },

    _render: function (ctx) {
        // This version offsets the Y coord correctly 
        // Added "this.parentNode.pathOffset.x", TreeNode init seems good for now...
        this.set({ left: this.X + this.parentNode.pathOffset.x, top: this.Y - this.parentNode.pathOffset.y });
        this.setCoords(); // this line makes the hoverCircle update coords correctly... let's keep that
        this.callSuper('_render', ctx);
    }
});