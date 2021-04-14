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

    // ** CHANGE: export the custom method when serializing
    // toObject: function () {
    //     return fabric.util.object.extend(this.callSuper('toObject'), {
    //         // updateVerticalSpace: this.updateVerticalSpace
    //     });
    // },

});


fabric.PointerCircle.fromObject = function (object, callback) {
    // console.log(object)
    return fabric.Object._fromObject('Circle', object, callback);
};

fabric.PointerCircle.prototype.toObject = (function (toObject) { // The .prototype SHOULD be there, it seems
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrow: this.arrow,
            historyID: this.historyID,
            textSide: this.textSide,
            textNode: this.textNode
        });
    };
})(fabric.PointerCircle.prototype.toObject);

fabric.Circle.prototype.toObject = (function (toObject) { // The .prototype SHOULD be there, it seems
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrow: this.arrow,
            historyID: this.historyID,
            textSide: this.textSide,
            textNode: this.textNode
        });
    };
})(fabric.Circle.prototype.toObject);

fabric.PointerCircle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrow", "historyID", "textSide", "textNode"]);
fabric.Circle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrow", "historyID", "textSide", "textNode"]);
