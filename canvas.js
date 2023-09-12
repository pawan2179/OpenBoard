let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorContainer = document.querySelector(".pencil-color-cont");
let pencilWidthContainer = document.querySelector(".pencil-width-cont");
let pencilWidthInput = document.querySelector(".pencil-width-input");
let eraserWidthInput = document.querySelector(".eraser-width-input");
let pencilColors = document.querySelectorAll(".pencil-color");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let currentColor = "red";
let currentWidth = "3";
let eraserColor = "white";
let currentEraserWidth = "3";
let pencilWidth = pencilWidthInput.value;
let eraserWidth = eraserWidthInput.value;

let tool = canvas.getContext("2d");
tool.strokeStyle = currentColor;
tool.lineWidth = currentWidth;

let isMouseDown = false;
let undoRedoTracker = [];
let track = 0;

canvas.addEventListener("mouseup", (event) => {
    isMouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    beginPath({x: event.clientX, y: event.clientY});
});

canvas.addEventListener("mousemove", (event) => {
    if(isMouseDown) {
        drawPath({
                x: event.clientX,
                y: event.clientY,
                color: eraserToolVisible ? eraserColor : currentColor,
                width: eraserToolVisible ? currentEraserWidth  : currentWidth
            });
    }
});

function beginPath(point) {
    tool.beginPath();
    tool.moveTo(point.x, point.y);
}

function drawPath(point) {
    tool.lineTo(point.x, point.y);
    tool.strokeStyle = point.color;
    tool.lineWidth = point.width;
    tool.stroke();
}

pencilColors.forEach((colorElem) => {
    colorElem.addEventListener("click", (event) => {
        let color = colorElem.classList[0];
        currentColor = color;
    })
});

pencilWidthInput.addEventListener("change", (event) => {
    currentWidth = pencilWidthInput.value;
    tool.lineWidth = currentWidth;
});

eraserWidthInput.addEventListener("change", (event) => {
    eraserWidth = eraserWidthInput.value;
    currentEraserWidth = eraserWidth;
});

eraser.addEventListener("click", (event) => {
    if(eraserToolVisible) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = currentEraserWidth;
    }
    else {
        tool.strokeStyle = currentColor;
        tool.lineWidth = currentWidth;
    }
});

download.addEventListener("click", (event) => {
    let a = document.createElement("a");
    let url = canvas.toDataURL();
    a.href = url;
    a.download = "board.jpg";
    a.click();
});

undo.addEventListener("click", (event) => {
    if(track == 0)    return ;
    else {
        track--;
        console.log("undo running", track, undoRedoTracker);
        let trackObj = {
            trackValue: track,
            undoRedoTracker
        }
        undoRedoCanvas(trackObj);
    }
});

redo.addEventListener("click", (event) => {
    if(track = undoRedoTracker.length - 1)    return ;
    else {
        track++;
        console.log("redo running", track, undoRedoTracker);
        let trackObj = {
            trackValue: track,
            undoRedoTracker
        };
        undoRedoCanvas(trackObj);
    }
});

function undoRedoCanvas(obj) {
    track = obj.trackValue;
    undoRedoTracker = obj.undoRedoTracker;

    let img = new Image();
    let url = undoRedoTracker[track];
    img.src = url;
    img.onload = (event) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}