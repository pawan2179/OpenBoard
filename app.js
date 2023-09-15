const express = require("express");
const socket = require("socket.io");
const path = require("path");

const app = express();  //initializes node application, server ready

app.use(express.static(path.join(__dirname, "public")));

let port = 3000;
let server = app.listen(port, () => {
    console.log("Listening to port " + port);
});

let io = socket(server);

io.on("connection", (socket) => {
    console.log("made socket instance");

    //Listening for events
    socket.on("beginPath", (data) => {
        //send data to front-end listeners
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawPath", (data) => {
        io.sockets.emit("drawPath", data);
    });

    socket.on("undoRedoCanvas", (data) => {
        io.sockets.emit("undoRedoCanvas", data);
    })
});