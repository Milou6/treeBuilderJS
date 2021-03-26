fabric.NodeText = fabric.util.createClass(fabric.IText, {
    type: 'nodeText',

    initialize: function (X, Y, parentNode, attachedHover, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.numberLines = 1;
        this.parentNode = parentNode;
        this.attachedHover = attachedHover;
        this.customType = 'i-text';
        this.historyID = setHistoryID();
        this.oldText = 'XP';

        this.set({ originX: 'center', originY: 'top' });
        this.set({ left: this.X, top: this.Y, editingBorderColor: 'green', hasControls: false, fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true });

        this.on('changed', function (e) {
            console.log("change");
            // this.numberLines = this.textLines.length;
            console.log(this.numberLines);
            this.updateVerticalSpace();

        });

        this.on('editing:exited', function (e) {
            console.log('exited');
            if (this.text == "") {
                this.text = "..";
            }
            let histAction = [];
            histAction.push(['textEdited', this, this.oldText, this.text]);

            if (this.attachedHover.childNode != null) {
                // Check if childNode intersects w/ smth after updateVerticalSpace()
                resolveIntersections(this.attachedHover.childNode, histAction);
            }
            canvasHist.undoPush(histAction);
            // console.log(canvasHist.undoStack);
        });

        this.on('editing:entered', function (e) {
            if (this.text == "..") {
                this.set({ text: "", textLines: [] });
                // this._text = [];
                // this._textBeforeEdit = "";
            }
            this.oldText = this._textBeforeEdit;
        });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    },

    // ** CHANGE: export the custom method when serializing
    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            updateVerticalSpace: this.updateVerticalSpace
        });
    },

    updateVerticalSpace: function () {
        // console.log(this.attachedHover);

        if (this.attachedHover.hasChildNode) {
            let hover = this.attachedHover;
            let newLineNumber = this.textLines.length;
            let LineNumberDifference = newLineNumber - this.numberLines;
            // check if number of lines has changed from what's stored in attribute

            // console.log(LineNumberDifference);
            if (LineNumberDifference != 0) {
                hover.childNode.moveSubtreeBy(0, LineNumberDifference * this.__lineHeights[0]);
            }

            // After everything is replaced, gotta reset the attribute to correct, new value
            this.numberLines = newLineNumber;
        }

    }
});


fabric.NodeText.fromObject = function (object, callback) {
    // console.log(object)
};

// extending toObject for JSON serialization
fabric.IText.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            X: this.X,
            Y: this.Y,
            numberLines: this.hoverType,
            parentNode: this.parentNode,
            attachedHover: this.hasChildNode,
            lockMovementY: this.lockMovementY,
            lockMovementX: this.lockMovementX,
            customType: this.customType,
            historyID: this.historyID
        });
    };
})(fabric.IText.prototype.toObject);
