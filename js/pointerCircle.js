fabric.PointerCircle = fabric.util.createClass(fabric.Circle, {
    type: 'pointerCircle',

    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.historyID = setHistoryID();

        this.set({ originX: 'center', originY: 'center' });
        // this.set({ left: , top:  });

        // this.set({ left: this.X, top: this.Y, editingBorderColor: 'green', hasControls: false, fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true });

    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    },

    // ** CHANGE: export the custom method when serializing
    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            // updateVerticalSpace: this.updateVerticalSpace
        });
    },

});


fabric.PointerCircle.fromObject = function (object, callback) {
    // console.log(object)
};

// extending toObject for JSON serialization
// fabric.IText.prototype.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             X: this.X,
//             Y: this.Y,
//             numberLines: this.hoverType,
//             parentNode: this.parentNode,
//             attachedHover: this.hasChildNode,
//             lockMovementY: this.lockMovementY,
//             lockMovementX: this.lockMovementX,
//             customType: this.customType,
//             historyID: this.historyID
//         });
//     };
// })(fabric.IText.prototype.toObject);
