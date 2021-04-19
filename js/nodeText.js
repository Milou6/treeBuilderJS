
fabric.IText.prototype.setInitVerticalSpace = function () {
    let hover = this.attachedHover;
    hover.childNode.moveSubtreeBy(0, this.numberLines * this.__lineHeights[0]);
}

fabric.IText.prototype.updateVerticalSpace = function () {
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

}

var globalColorCircles = []; // global var for textNode Color Menu
fabric.IText.prototype.showColorMenu = function () {
    let colorLeft = { x: this.aCoords.tl.x - 20, y: this.aCoords.tl.y };
    let colorRight = { x: this.aCoords.tr.x + 20, y: this.aCoords.tr.y };
    let colorArray = ['red', 'orange', 'yellow', 'white', 'green', 'blue', 'purple', 'black'];
    let colorIndex = 0;

    for (let i = 0; i < 8; i++) {
        let colorCircle = new fabric.Circle({
            left: colorIndex < 4 ? colorLeft.x : colorRight.x,
            // making right-side circles have correct y
            top: i < 4 ? colorLeft.y + 30 * i : colorLeft.y + 30 * (i - 4),
            originX: 'center',
            originY: 'center',
            fill: colorArray[colorIndex],
            radius: 10,
            selectable: false,
            textNode: this
        });
        colorCircle.on('mouseover', getSelectionIndexes);
        colorCircle.on('mousedown', setSelectionColor);  // events to color selection (or whole text)
        colorCircle.on('mouseout', resizeColorCircle);
        canvas.add(colorCircle);
        globalColorCircles.push(colorCircle);
        colorIndex += 1;

        if (i == 3) {
            colorCircle.off('mouseover');
            colorCircle.off('mousedown');  // remove events from circle, we'll re-add them to whole group
            colorCircle.off('mouseout');


            colorCircle.set({ stroke: 'black', strokeWidth: 0.3 });
            let strikeThroughLine = new fabric.Line([   // add a horizontal line to the strikethrough circle
                colorCircle.left - 5, colorCircle.top,
                colorCircle.left + 5, colorCircle.top],
                {
                    stroke: 'black',
                    selectable: false
                });

            globalColorCircles.pop();
            var group = new fabric.Group([colorCircle, strikeThroughLine], {
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            canvas.add(group);
            globalColorCircles.push(group);

            group.on('mouseover', getSelectionIndexes);
            group.on('mousedown', setSelectionColor);  // events to color selection (or whole text)
            group.on('mouseout', resizeColorCircle);

        }

    }
    canvas.renderAll();
}

var selectionStart = null; // Global vars to keep selection indexes from one event to another
var selectionEnd = null;
function getSelectionIndexes() {
    let circle = null;
    try { // If event caller is a group, gotta get the circle inside group
        circle = this.item(0);
        // console.log(this);
    }
    catch { // If caller is the circle itself, no prob
        circle = this;
    }
    selectionStart = circle.textNode.selectionStart;
    selectionEnd = circle.textNode.selectionEnd;
    circle.set({ radius: 12 });
}

function setSelectionColor() {
    let circle = null;
    try { // If event caller is a group, gotta get the circle inside group
        circle = this.item(0);
    }
    catch { // If caller is the circle itself, no prob
        circle = this;
    }

    if (circle.fill != 'white') {
        if (selectionStart == selectionEnd) { // If no selection exists, select whole text
            selectionStart = 0;
            selectionEnd = circle.textNode._text.length;
        }
        circle.textNode.setSelectionStart(selectionStart);
        circle.textNode.setSelectionEnd(selectionEnd);

        let style = { fill: circle.fill } // Add circle color to style object
        circle.textNode.setSelectionStyles(style);
        // circle.textNode.enterEditing();
    }


    else { // if white circle was selected, we want to set linethrough
        // console.log(selectionStart);
        let lineStart = circle.textNode.findLineBoundaryLeft(selectionStart);
        let lineEnd = circle.textNode.findLineBoundaryRight(selectionStart);
        // let middleIndex = (lineStart + lineEnd) / 2;
        // console.log(circle.textNode.styleHas('linethrough'));
        // console.log(circle.textNode.styles);


        currentStyle = circle.textNode.getSelectionStyles(0, circle.textNode._text.length).slice(lineStart, lineEnd);
        // if (circle.textNode.styleHas('linethrough')) {
        if (currentStyle[0].linethrough == true) { // If line is already strikethrough, remove it
            let style = { linethrough: false };
            circle.textNode.setSelectionStyles(style, lineStart, lineEnd);
        }
        else { // If line is not strikethrough, add it
            let style = { linethrough: true };
            circle.textNode.setSelectionStyles(style, lineStart, lineEnd);
        }
    }
}

function resizeColorCircle() {
    let circle = null;
    try { // If event caller is a group, gotta get the circle inside group
        circle = this.item(0);
    }
    catch { // If caller is the circle itself, no prob
        circle = this;
    }
    circle.set({ radius: 10 });
}

// Push color circle as textNode gets wider/shorter
fabric.IText.prototype.updateColorMenu = function () {
    let index = 0;
    for (let colorCircle of globalColorCircles) {
        if (index < 4) { colorCircle.set({ left: this.aCoords.tl.x - 20 }); }
        else { colorCircle.set({ left: this.aCoords.tr.x + 20 }); }
        colorCircle.setCoords();
        index += 1;
    }
}



fabric.IText.prototype.moveSecondaryText = function () {
    if (this.secondaryText != null) {
        let sec = this.secondaryText;

        sec.set({ left: this.X, top: this.Y + 60, dirty: true });
        sec.setCoords();
    }
}

fabric.IText.prototype.initPointers = function () {
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
            textSide: 'left',
            textNode: this
        });
        pointerCircle1.setCoords();
        var pointerCircle2 = new fabric.PointerCircle({
            radius: 7,
            fill: 'purple',
            left: circleRightX,
            top: circleY,
            originX: 'center',
            originY: 'center',
            opacity: 0,
            selectable: false,
            textSide: 'right',
            textNode: this
        });
        pointerCircle2.setCoords();
        //Gotta push to array before adding to canvas??? WTF
        this.pointerCircles.push(pointerCircle1, pointerCircle2);
        canvas.add(pointerCircle1, pointerCircle2);
    }

    canvas.renderAll();
    // console.log(this.pointerCircles);

}

fabric.IText.prototype.updatePointerCircles = function () {
    // console.log('CALLL');
    let startCoordLeft = { x: this.aCoords.tl.x, y: this.aCoords.tl.y };
    // console.log(startCoordLeft);
    let startCoordRight = { x: this.aCoords.tr.x, y: this.aCoords.tr.y };
    let circleLeftX = startCoordLeft.x - 10;
    let circleRightX = startCoordRight.x + 10;

    let pointerIterator = 0;
    for (let i = 0; i < 6; i++) {
        let circleY = startCoordLeft.y + i * this.__lineHeights[0] + (this.__lineHeights[0] / 2);

        // setting left pointer
        this.pointerCircles[pointerIterator].set({ left: circleLeftX, top: circleY, dirty: true });
        this.pointerCircles[pointerIterator].setCoords();
        if (this.pointerCircles[pointerIterator].arrow != null) {
            globalArrowsToUpdate.add(this.pointerCircles[pointerIterator].arrow);
        }
        pointerIterator += 1;
        // setting right pointer
        this.pointerCircles[pointerIterator].set({ left: circleRightX, top: circleY, dirty: true });
        this.pointerCircles[pointerIterator].setCoords();
        if (this.pointerCircles[pointerIterator].arrow != null) {
            // this.pointerCircles[pointerIterator].arrow.updateArrowPosition();
            globalArrowsToUpdate.add(this.pointerCircles[pointerIterator].arrow);
        }
        pointerIterator += 1;
    }

    // update arrows positioning if needed
    for (let arrow of globalArrowsToUpdate) {
        arrow.updateArrowPosition();
    }
    globalArrowsToUpdate.clear();
}





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
        this.set({
            left: this.X, top: this.Y, hasControls: false, fontSize: 20, textAlign: 'center' /*hasControls: false, */, lockMovementX: true, lockMovementY: true, padding: 4
        });

        this.setCoords();
        this.initPointers();

        this.on('changed', nodeTextChanged);
        this.on('editing:exited', nodeTextEditingExited);
        this.on('editing:entered', nodeTextEditingEntered);

        // this.on('moved', function (e) {
        //     console.log('moveee');
        //     // if object moved, allow pointers to be recreated
        //     this.alreadyHasPointers = false;
        //     this.deletePointers();
        // });

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
    return fabric.Object._fromObject('IText', object, callback, 'text'); // TY @asturur
};

// extending toObject for JSON serialization





function nodeTextChanged(e) {
    // console.log('CHANGE');
    // this.numberLines = this.textLines.length;
    this.updateVerticalSpace();
    this.updatePointerCircles();
    this.updateColorMenu();
    this.setCoords(); // Prevents clashes when textNodes overlapping...

    if (this._text[this.selectionStart - 1] == '\n') { // If current line is striketrough & we insert new line
        let style = { linethrough: false };            // remove the style from new line
        this.setSelectionStyles(style, this.selectionStart - 1, this.selectionStart + 1);
    }

    // if #lines changed, allow pointers to be recreated
    // this.alreadyHasPointers = false;
    // this.deletePointers();

}

function nodeTextEditingExited(e) {
    console.log('exited');
    // remove the Color circles of nodeText
    for (color of globalColorCircles) {
        if (color.type == 'group') {
            // console.log('GROUP');
            for (let obj of color.getObjects()) { canvas.remove(obj); }
            canvas.remove(color);
        }
        else { canvas.remove(color); }
    }
    globalColorCircles.length = 0;
    canvas.renderAll();

    if (this.text == "") {
        this.text = "...";
    }
    let histAction = [];
    histAction.push(['textEdited', this, this.oldText, this.text]);

    if (this.attachedHover.childNode != null) {
        // Check if childNode intersects w/ smth after updateVerticalSpace()
        resolveIntersections(this.attachedHover.childNode, histAction);
    }
    canvasHist.undoPush(histAction);
    // update pointerCircles, for ex. if text got wider or shorter
    // this.updatePointerCircles();
}

function nodeTextEditingEntered(e) {
    if (this.text == "...") {
        this.set({ text: "", textLines: [] });
        // this._text = [];
        // this._textBeforeEdit = "";
    }
    this.oldText = this._textBeforeEdit;

    // Create color circles to choose from
    this.showColorMenu();
}

