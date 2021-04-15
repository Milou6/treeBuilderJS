fabric.PointerCircle = fabric.util.createClass(fabric.Circle, {
    type: 'pointerCircle',

    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.arrow = null;
        this.historyID = setHistoryID();

        this.set({ originX: 'center', originY: 'center' });
        // this.set({ left: , top:  });

        // this.set({ left: this.X, top: this.Y, editingBorderColor: 'green', hasControls: false, fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true });

    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    },


});


fabric.PointerCircle.fromObject = function (object, callback) {
    // console.log(object)
    return fabric.Object._fromObject('Circle', object, callback);
};

