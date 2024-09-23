const express = require("express");
const path = require("path"); // Import the 'path' module
const app = express();
const indexRouter = require("./routes");
const socketIO = require("socket.io");

const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);
//on means recieved

let waitingusers = [];
let room = {};

io.on("connection", function (socket) {
  // console.log("connected from the web browser");
  socket.on("joinroom", function () {
    if (waitingusers.length > 0) {
      let partner = waitingusers.shift();
      const roonmane = `${socket.id}-${partner.id}`;

      socket.join(roonmane);
      partner.join(roonmane);

      io.to(roonmane).emit("joined",roonmane);
    } else {
      waitingusers.push(socket);
    }
  });

  socket.on("signalingMessage",function(data){
    // console.log(data.room,data.message);
    socket.broadcast.to(data.room).emit("signalingMessage",data.message);
  })

  socket.on("message",function(data){
    // console.log(data);
    socket.broadcast.to(data.room).emit("message",data.message);
  })

  socket.on("startVideoCall",function({room}){
    console.log("hey");
    socket.broadcast.to(room).emit("incomingCall");
  })

  socket.on("acceptCall",function({room}){
    socket.broadcast.to(room).emit("callAccepted");
  })

  socket.on("rejectCall",function({room}){
    console.log("hey");
    socket.broadcast.to(room).emit("callRejected");
  })

  socket.on("disconnect", function () {
    let index = waitingusers.findIndex(
      (waitingUser) => waitingUser.id === socket.id
    );

    waitingusers.splice(index, 1);
  });
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Ensure 'path' is used correctly

app.use("/", indexRouter);

// Adding basic error handling for server start
server.listen(3000, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log("Server is running on port 3000");
  }
});
