// let coords = document.getElementById('coords');

// // Listener for Mouse coords X Y
// document.body.addEventListener('mousemove', function (e) {
//     coords.innerHTML = `X : ${e.offsetX}, Y : ${e.offsetY}`
// });

// document.getElementById('treeCanvas').addEventListener('click', createNode);

// var canvas = document.getElementById('treeCanvas');
// var ctx = canvas.getContext('2d');

// function createNode(e) {
//     let X = e.offsetX;
//     let Y = e.offsetY;
//     ctx.beginPath();
//     ctx.moveTo(X, Y);
//     ctx.lineTo(X - 70, Y + 50);
//     ctx.moveTo(X, Y);
//     ctx.lineTo(X + 70, Y + 50);
//     ctx.stroke();
// }


// class Node {
//     constructor(X, Y) {
//         this.X = X;
//         this.Y = Y;
//     }
// }


var stage = new createjs.Stage("treeCanvas");
var g = new createjs.Graphics();

// var circle = new createjs.Shape();
// circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
// circle.x = 100;
// circle.y = 100;

// g.moveTo(50, 50);
// g.lineTo(100, 100);
// g.endStroke();

var line = new createjs.Shape();

line.graphics.setStrokeStyle(1).beginStroke("#000000");
line.graphics.moveTo(100, 100);
line.graphics.lineTo(50, 90);
line.graphics.lineTo(250, 250);
line.graphics.endStroke();


line.on("mousedown", function (evt) {
    // keep a record on the offset between the mouse position and the container
    // position. currentTarget will be the container that the event listener was added to:
    evt.currentTarget.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };
});

line.on("pressmove", function (evt) {
    // Calculate the new X and Y based on the mouse new position plus the offset.
    evt.currentTarget.x = evt.stageX + evt.currentTarget.offset.x;
    evt.currentTarget.y = evt.stageY + evt.currentTarget.offset.y;
    // make sure to redraw the stage to show the change:
    stage.update();
});

stage.addChild(line);
stage.update();




// class TreeNode extends createjs.Container {
//     constructor(X, Y) {
//         super();
//         this.X = X;
//         this.Y = Y;
//         // this.stage = stage;

//         const line = new createjs.Shape();
//         line.graphics.moveTo(X, Y);
//         line.graphics.lineTo(X - 70, Y + 50);
//         line.graphics.moveTo(X, Y);
//         line.graphics.lineTo(X + 70, Y + 50);
//         line.graphics.endStroke();

//         this.addChild(line);
//     }
// }
// export default createjs.promote(TreeNode, "Container");

const node = new TreeNode(300, 300);
stage.addChild(node);
stage.update();


// stage.on("click", function (evt) {
//     let node = new Node(evt.X, evt.Y, evt.target.stage );
// });
