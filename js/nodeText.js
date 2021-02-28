var NodeText = fabric.util.createClass(fabric.IText, {
    type: 'nodeText',

    initialize: function (X, Y, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;

        this.set({ left: this.X, top: this.Y, editingBorderColor: 'purple', fontSize: 20, textAlign: 'center' /*hasControls: false, */ });
    },
    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

// var itext = new NodeText(200, 200, 'the dog');
// canvas.add(itext);