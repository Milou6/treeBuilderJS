fabric.TreeTriangle = fabric.util.createClass(fabric.Polygon, {
    // Type below must be 'polyline' for SVG export to work properly
    type: 'treeTriangle',

    /**
     * Creates a new TreeNode object.
     * Example: var myNode = new TreeNode(100, 100, [[-80, 70], [80, 70]], null, null, [],);
     * @constructor
     * @param {number} X - horizontal coord of the TreeNode top
     * @param {number} Y - vertical coord of the TreeNode top
     */
    initialize: function (relativeX, relativeY, attachedText, options) {
        options || (options = {});
        // callSuper() to initialize fabricJS Polyline
        this.callSuper('initialize', options);
        this.relativeX = relativeX;
        this.relativeY = relativeY;
        this.attachedText = attachedText;
        this.historyID = setHistoryID();

        this.set({ width: 60, height: 30, originX: 'center', originY: 'top' });
        this.set({ left: this.attachedText.X + relativeX, top: this.attachedText.Y + relativeY, fill: 'rgba(255, 255, 255, 1)', stroke: 'black', selectable: false });
        this.setCoords();

        this.set({ pathOffset: { x: 0, y: 15 } });

        this.points.push({ x: 0, y: 0 }, { x: -30, y: 30 }, { x: 30, y: 30 });


    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
        // canvas.sendToBack(this);
    },
});

fabric.TreeTriangle.fromObject = function (object, callback) {
    return fabric.Object._fromObject('Polygon', object, callback, 'points'); // TY @asturur
};