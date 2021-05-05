// This file recollects all instances of fabric prototype re-definition in a single location
// Also all re-definitions of fabric object's toObject() method

// NodeText
fabric.NodeText.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            X: this.X,
            Y: this.Y,
            numberLines: this.numberLines,
            parentNode: this.parentNode,
            attachedHover: this.attachedHover,
            attachedTriangle: this.attachedTriangle,
            secondaryText: this.secondaryText,
            lockMovementX: this.lockMovementX,
            lockMovementY: this.lockMovementY,
            customType: this.customType,
            historyID: this.historyID,
            oldText: this.oldText,
            pointerCircles: this.pointerCircles,
            mainTextNode: this.mainTextNode,

            onInput: this.onInput,
            updateVerticalSpace: this.updateVerticalSpace,
            moveSecondaryText: this.moveSecondaryText,
            showColorMenu: this.showColorMenu,
            updateColorMenu: this.updateColorMenu,
            initPointers: this.initPointers,
            updatePointerCircles: this.updatePointerCircles
        });
    };
})(fabric.NodeText.prototype.toObject);
fabric.IText.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            X: this.X,
            Y: this.Y,
            numberLines: this.numberLines,
            parentNode: this.parentNode,
            attachedHover: this.attachedHover,
            attachedTriangle: this.attachedTriangle,
            secondaryText: this.secondaryText,
            lockMovementX: this.lockMovementX,
            lockMovementY: this.lockMovementY,
            customType: this.customType,
            historyID: this.historyID,
            oldText: this.oldText,
            pointerCircles: this.pointerCircles,
            mainTextNode: this.mainTextNode,

            onInput: this.onInput,
            updateVerticalSpace: this.updateVerticalSpace,
            moveSecondaryText: this.moveSecondaryText,
            showColorMenu: this.showColorMenu,
            updateColorMenu: this.updateColorMenu,
            initPointers: this.initPointers,
            updatePointerCircles: this.updatePointerCircles
        });
    };
})(fabric.IText.prototype.toObject);


// TreeNode
fabric.TreeNode.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            X: this.X,
            Y: this.Y,
            armsArray: this.armsArray,
            nodeParent: this.nodeParent,
            hoverParent: this.hoverParent,
            hoverCircles: this.hoverCircles,
            textNodes: this.textNodes,
            topTextNode: this.topTextNode,
            horizOffset: this.horizOffset,
            vertOffset: this.vertOffset,
            nodeWidth: this.nodeWidth,
            selectable: this.selectable,
            pathOffset: this.pathOffset,
            customType: this.customType,
            historyID: this.historyID,
            isOnTreeSpine: this.isOnTreeSpine,

            updateArmCoords: this.updateArmCoords,
            moveNodeBy: this.moveNodeBy,
            moveSubtreeBy: this.moveSubtreeBy,
            getChildNodes: this.getChildNodes,
            delete: this.delete,
            deleteSubtree: this.deleteSubtree,
            reAddSubtree: this.reAddSubtree
        });
    };
})(fabric.TreeNode.prototype.toObject);
// fabric.Polyline.prototype.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             X: this.X,
//             Y: this.Y,
//             armsArray: this.armsArray,
//             nodeParent: this.nodeParent,
//             hoverParent: this.hoverParent,
//             hoverCircles: this.hoverCircles,
//             textNodes: this.textNodes,
//             horizOffset: this.horizOffset,
//             vertOffset: this.vertOffset,
//             nodeWidth: this.nodeWidth,
//             selectable: this.selectable,
//             pathOffset: this.pathOffset,
//             customType: this.customType,
//             historyID: this.historyID,
//             isOnTreeSpine: this.isOnTreeSpine,

//             updateArmCoords: this.updateArmCoords,
//             moveNodeBy: this.moveNodeBy,
//             moveSubtreeBy: this.moveSubtreeBy,
//             getChildNodes: this.getChildNodes,
//             delete: this.delete
//         });
//     };
// })(fabric.Polyline.prototype.toObject);

// Arrow
fabric.Arrow.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrowStart: this.arrowStart,
            arrowEnd: this.arrowEnd,
            tipStart: this.tipStart,
            tipEnd: this.tipEnd,
            circleHandler: this.circleHandler,
            historyID: this.historyID,
            handlers: this.handlers,

            arrowInitSequence: this.arrowInitSequence,
            initArrowHandlers: this.initArrowHandlers,
            initArrowTips: this.initArrowTips,
            updateArrowPosition: this.updateArrowPosition

        });
    };
})(fabric.Arrow.prototype.toObject);
fabric.Polyline.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            // TreeNode
            X: this.X,
            Y: this.Y,
            armsArray: this.armsArray,
            nodeParent: this.nodeParent,
            hoverParent: this.hoverParent,
            hoverCircles: this.hoverCircles,
            textNodes: this.textNodes,
            topTextNode: this.topTextNode,
            horizOffset: this.horizOffset,
            vertOffset: this.vertOffset,
            nodeWidth: this.nodeWidth,
            selectable: this.selectable,
            pathOffset: this.pathOffset,
            customType: this.customType,
            historyID: this.historyID,
            isOnTreeSpine: this.isOnTreeSpine,

            updateArmCoords: this.updateArmCoords,
            moveNodeBy: this.moveNodeBy,
            moveSubtreeBy: this.moveSubtreeBy,
            getChildNodes: this.getChildNodes,
            delete: this.delete,
            deleteSubtree: this.deleteSubtree,
            reAddSubtree: this.reAddSubtree,
            // Arrow
            arrowStart: this.arrowStart,
            arrowEnd: this.arrowEnd,
            tipStart: this.tipStart,
            tipEnd: this.tipEnd,
            circleHandler: this.circleHandler,
            // historyID: this.historyID,
            handlers: this.handlers,

            arrowInitSequence: this.arrowInitSequence,
            initArrowHandlers: this.initArrowHandlers,
            initArrowTips: this.initArrowTips,
            updateArrowPosition: this.updateArrowPosition

        });
    };
})(fabric.Polyline.prototype.toObject);



// HoverCircle
fabric.HoverCircle.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            X: this.X,
            Y: this.Y,
            hoverType: this.hoverType,
            parentNode: this.parentNode,
            hasChildNode: this.hasChildNode,
            childNode: this.childNode,
            attachedNodeText: this.attachedNodeText,
            lockMovementY: this.lockMovementY,
            lockMovementX: this.lockMovementX,
            hasControls: false,
            hasBorders: false,
            selectable: this.selectable,
            customType: this.customType,
            historyID: this.historyID
        });
    };
})(fabric.HoverCircle.prototype.toObject);
// fabric.Circle.prototype.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             X: this.X,
//             Y: this.Y,
//             hoverType: this.hoverType,
//             parentNode: this.parentNode,
//             hasChildNode: this.hasChildNode,
//             childNode: this.childNode,
//             attachedNodeText: this.attachedNodeText,
//             lockMovementY: this.lockMovementY,
//             lockMovementX: this.lockMovementX,
//             hasControls: false,
//             hasBorders: false,
//             selectable: this.selectable,
//             customType: this.customType,
//             historyID: this.historyID,

//         });
//     };
// })(fabric.Circle.prototype.toObject);

// CircleHandler
fabric.CircleHandler.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrow: this.arrow,
            historyID: this.historyID,
            relativeX: this.relativeX,
            relativeY: this.relativeY,
            hasControls: this.hasControls,
            hasBorders: this.hasBorders
        });
    };
})(fabric.CircleHandler.prototype.toObject);
// fabric.Circle.prototype.toObject = (function (toObject) {
//     return function () {
//         return fabric.util.object.extend(toObject.call(this), {
//             arrow: this.arrow,
//             historyID: this.historyID,
//             relativeX: this.relativeX,
//             relativeY: this.relativeY,
//             hasControls: this.hasControls,
//             hasBorders: this.hasBorders
//         });
//     };
// })(fabric.Circle.prototype.toObject);

// PointerCircle
fabric.PointerCircle.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            arrow: this.arrow,
            historyID: this.historyID,
            textSide: this.textSide,
            textNode: this.textNode,
            selectable: this.selectable
        });
    };
})(fabric.PointerCircle.prototype.toObject);
fabric.Circle.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            // HoverCircle attribs
            X: this.X,
            Y: this.Y,
            hoverType: this.hoverType,
            parentNode: this.parentNode,
            hasChildNode: this.hasChildNode,
            childNode: this.childNode,
            attachedNodeText: this.attachedNodeText,
            lockMovementY: this.lockMovementY,
            lockMovementX: this.lockMovementX,
            hasControls: false,
            hasBorders: false,
            selectable: this.selectable,
            customType: this.customType,
            historyID: this.historyID,
            // CircleHandler attribs
            // arrow: this.arrow,
            // historyID: this.historyID,
            relativeX: this.relativeX,
            relativeY: this.relativeY,
            // PointerCircle attribs
            arrow: this.arrow,
            selectable: this.selectable,
            // historyID: this.historyID,
            // hasControls: this.hasControls,
            // hasBorders: this.hasBorders
            textSide: this.textSide,
            textNode: this.textNode
        });
    };
})(fabric.Circle.prototype.toObject);



fabric.TreeTriangle.prototype.toObject = (function (toObject) {
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            pointer: this.pointer,
            attachedText: this.attachedText,
            relativeX: this.relativeX,
            relativeY: this.relativeY,
            historyID: this.historyID,
            selectable: this.selectable
        });
    };
})(fabric.TreeTriangle.prototype.toObject);
fabric.Triangle.prototype.toObject = (function (toObject) { // The .prototype SHOULD be there, it seems
    return function () {
        return fabric.util.object.extend(toObject.call(this), {
            pointer: this.pointer,
            attachedText: this.attachedText,
            relativeX: this.relativeX,
            relativeY: this.relativeY,
            historyID: this.historyID,
            selectable: this.selectable
        });
    };
})(fabric.Triangle.prototype.toObject);



// stateProperties //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
fabric.NodeText.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["X", "Y", "numberLines", "parentNode", "attachedHover", "attachedTriangle", "secondaryText", "lockMovementX", "lockMovementY", "customType", "historyID", "oldText", "pointerCircles", "mainTextNode", "onInput", "updateVerticalSpace", "moveSecondaryText", "showColorMenu", "updateColorMenu", "initPointers", "updatePointerCircles"]);

fabric.IText.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["X", "Y", "numberLines", "parentNode", "attachedHover", "attachedTriangle", "secondaryText", "lockMovementX", "lockMovementY", "customType", "historyID", "oldText", "pointerCircles", "mainTextNode", "onInput", "updateVerticalSpace", "moveSecondaryText", "showColorMenu", "updateColorMenu", "initPointers", "updatePointerCircles"]);



fabric.TreeNode.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes", "topTextNode", "moveSubtreeBy", "deleteSubtree", "reAddSubtree"
    // arrow obj atribs
    // "arrowStart", "arrowEnd", "tipStart", "tipEnd", "circleHandler", "arrowInitSequence", "initArrowHandlers", "initArrowTips", "updateArrowPosition"

]);

fabric.Arrow.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrowStart", "arrowEnd", "tipStart", "tipEnd", "circleHandler", "arrowInitSequence", "initArrowHandlers", "initArrowTips", "updateArrowPosition"]);
fabric.Polyline.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat([
    // TreeNode attribs
    "X", "Y", "armsArray", "nodeParent", "hoverParent", "hoverCircles", "textNodes", "topTextNode", "moveSubtreeBy", "deleteSubtree", "reAddSubtree",
    // Arrow
    "arrowStart", "arrowEnd", "tipStart", "tipEnd", "circleHandler", "arrowInitSequence", "initArrowHandlers", "initArrowTips", "updateArrowPosition",

]);



fabric.PointerCircle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrow", "historyID", "textSide", "textNode"]);
// fabric.Circle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrow", "historyID", "textSide", "textNode"]);

fabric.CircleHandler.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["arrow", "relativeX", "relativeY"]);
fabric.Circle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat([
    "arrow", "relativeX", "relativeY",
    // PointerCircle attribs
    "historyID", "textSide", "textNode"
]);



fabric.TreeTriangle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["pointer", "attachedText", "relativeX", "relativeY", "historyID", "selectable"]);
fabric.Triangle.prototype.stateProperties = fabric.Object.prototype.stateProperties.concat(["pointer", "attachedText", "relativeX", "relativeY", "historyID", "selectable"]);