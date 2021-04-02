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
        this.attachedTriangle = null;
        this.secondaryText = null;
        this.customType = 'i-text';
        this.historyID = setHistoryID();
        this.oldText = 'XP';
        this.pointerCircles = [];
        // this.alreadyHasPointers = false;

        this.set({ originX: 'center', originY: 'top' });
        this.set({ left: this.X, top: this.Y, editingBorderColor: 'green', hasControls: false, fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true });

        this.setCoords();
        this.initPointers();

        this.on('changed', function (e) {
            // this.numberLines = this.textLines.length;
            this.updateVerticalSpace();
            // if #lines changed, allow pointers to be recreated
            // this.alreadyHasPointers = false;
            // this.deletePointers();

        });

        // this.on('moved', function (e) {
        //     console.log('moveee');
        //     // if object moved, allow pointers to be recreated
        //     this.alreadyHasPointers = false;
        //     this.deletePointers();
        // });

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
    // toObject: function () {
    //     return fabric.util.object.extend(this.callSuper('toObject'), {
    //         updateVerticalSpace: this.updateVerticalSpace
    //     });
    // },

    setInitVerticalSpace: function () {
        let hover = this.attachedHover;
        hover.childNode.moveSubtreeBy(0, this.numberLines * this.__lineHeights[0]);
    },

    updateVerticalSpace: function () {
        // console.log(this.attachedHover);
        let hover = this.attachedHover;
        let newLineNumber = this.textLines.length;
        let LineNumberDifference = newLineNumber - this.numberLines;
        // check if number of lines has changed from what's stored in attribute

        // console.log(LineNumberDifference);
        if (LineNumberDifference != 0 && hover.hasChildNode) {
            hover.childNode.moveSubtreeBy(0, LineNumberDifference * this.__lineHeights[0]);
        }

        // After everything is replaced, gotta reset the attribute to correct, new value
        this.numberLines = newLineNumber;

    },

    moveSecondaryText: function () {
        if (this.secondaryText != null) {
            let sec = this.secondaryText;

            sec.set({ left: this.X, top: this.Y + 60, dirty: true });
            sec.setCoords();
        }
    },

    initPointers: function () {
        let startCoordLeft = { x: this.aCoords.tl.x, y: this.aCoords.tl.y };
        // console.log(startCoordLeft);
        let startCoordRight = { x: this.aCoords.tr.x, y: this.aCoords.tr.y };
        let circleLeftX = startCoordLeft.x - 10;
        let circleRightX = startCoordRight.x + 10;

        for (let i = 0; i < 6; i++) {
            console.log('init');
            // aligns each circle with a line of textNode (same Y for left/right circles of each line)
            let circleY = startCoordLeft.y + i * this.__lineHeights[0] + (this.__lineHeights[0] / 2);
            // console.log(circleY);

            var pointerCircle1 = new fabric.PointerCircle({
                radius: 7,
                fill: 'purple',
                left: circleLeftX,
                top: circleY,
                originX: 'center',
                originY: 'center',
                opacity: 0,
                selectable: false,
                // textNode: this
            });
            var pointerCircle2 = new fabric.PointerCircle({
                radius: 7,
                fill: 'purple',
                left: circleRightX,
                top: circleY,
                originX: 'center',
                originY: 'center',
                opacity: 0,
                selectable: false,
                // textNode: this
            });
            canvas.add(pointerCircle1, pointerCircle2);
            this.pointerCircles.push(pointerCircle1, pointerCircle2);
        }

        canvas.renderAll();
        // console.log(this.pointerCircles);

    },

    updatePointerCircles: function () {
        console.log('CALLL');
        let startCoordLeft = { x: this.aCoords.tl.x, y: this.aCoords.tl.y };
        // console.log(startCoordLeft);
        let startCoordRight = { x: this.aCoords.tr.x, y: this.aCoords.tr.y };
        let circleLeftX = startCoordLeft.x - 10;
        let circleRightX = startCoordRight.x + 10;

        let pointerIterator = 0;
        for (let i = 0; i < 6; i++) {
            let circleY = startCoordLeft.y + i * this.__lineHeights[0] + (this.__lineHeights[0] / 2);
            // if (pointerIterator % 2 == 0) {
            //     coordLeft = circleLeftX;
            // }
            // else { coordLeft = circleRightX; }

            // setting left pointer
            this.pointerCircles[pointerIterator].set({ left: circleLeftX, top: circleY, dirty: true });
            pointerIterator += 1;
            // setting right pointer
            this.pointerCircles[pointerIterator].set({ left: circleRightX, top: circleY, dirty: true });
            pointerIterator += 1;
        }
    }

    // initPointers: function () {
    //     let startCoordLeft = { x: this.aCoords.tl.x, y: this.aCoords.tl.y };
    //     // console.log(startCoordLeft);
    //     let startCoordRight = { x: this.aCoords.tr.x, y: this.aCoords.tr.y };
    //     let circleLeftX = startCoordLeft.x - 10;
    //     let circleRightX = startCoordRight.x + 10;

    //     let testArray = [];
    //     // let test = [0, 1, 2, 3, 4, 5];
    //     for (let i = 0; i < 6; i++) {
    //         // for (number of test) {
    //         console.log('init');
    //         // aligns each circle with a line of textNode (same Y for left/right circles of each line)
    //         let circleY = startCoordLeft.y + i * this.__lineHeights[0] + (this.__lineHeights[0] / 2);
    //         console.log(circleY);

    //         var pointerCircle1 = new fabric.Circle({
    //             radius: 7,
    //             fill: 'purple',
    //             left: circleLeftX,
    //             top: circleY,
    //             originX: 'center',
    //             originY: 'center',
    //             opacity: 1,
    //             selectable: true,
    //             // textNode: this
    //         });
    //         canvas.add(pointerCircle1);
    //         canvas.renderAll();
    //         this.pointerCircles.push(pointerCircle1);
    //         var pointerCircle2 = new fabric.Circle({
    //             radius: 7,
    //             fill: 'purple',
    //             left: circleRightX,
    //             top: circleY,
    //             originX: 'center',
    //             originY: 'center',
    //             opacity: 0,
    //             selectable: true,
    //             // textNode: this
    //         });
    //     }
    //     // canvas.renderAll();
    //     console.log(this.pointerCircles);

    // },

    // deletePointers: function () {
    //     if (this.pointerCircles.length != 0) {
    //         for (let point of this.pointerCircles) {
    //             canvas.remove(point);
    //         }
    //         this.pointerCircles.length = 0;
    //         // canvas.renderAll();
    //     }
    // }
});


fabric.NodeText.fromObject = function (object, callback) {
    // console.log(object)
};

// extending toObject for JSON serialization
fabric.NodeText.prototype.toObject = (function (toObject) {
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
            historyID: this.historyID,
            pointerCircles: this.pointerCircles,

            updateVerticalSpace: this.updateVerticalSpace,
            moveSecondaryText: this.moveSecondaryText,
            initPointers: this.initPointers
        });
    };
})(fabric.NodeText.prototype.toObject);
