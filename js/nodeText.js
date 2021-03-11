var NodeText = fabric.util.createClass(fabric.IText, {
    type: 'nodeText',

    initialize: function (X, Y, parentNode, attachedHover, options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.X = X;
        this.Y = Y;
        this.numberLines = 1;
        this.parentNode = parentNode;
        this.attachedHover = attachedHover;

        this.set({ originX: 'center', originY: 'top' });
        this.set({ left: this.X, top: this.Y, editingBorderColor: 'green', fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true });

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
        });

        this.on('editing:entered', function (e) {
            if (this.text == "..") {
                this.set({ text: "", textLines: [] });
                // this._text = [];
                // this._textBeforeEdit = "";
            }
        });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    },

    updateVerticalSpace: function () {
        // console.log(this.attachedHover);

        if (this.attachedHover.hasChildNode) {
            let hover = this.attachedHover;
            let newLineNumber = this.textLines.length;
            let LineNumberDifference = newLineNumber - this.numberLines;
            // check if number of lines has changed from what's stored in attribute

            console.log(LineNumberDifference);
            if (LineNumberDifference != 0) {
                hover.childNode.moveSubtreeBy(0, LineNumberDifference * this.__lineHeights[0]);
            }

            // After everything is replaced, gotta reset the attribute to correct, new value
            this.numberLines = newLineNumber;
        }

    }
});

// var itext = new NodeText(200, 200, 'the dog');
// canvas.add(itext);