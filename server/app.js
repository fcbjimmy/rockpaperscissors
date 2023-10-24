//express
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { determineWinner } = require("./helper.js");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});

//port
const port = process.env.PORT || 4000;

let playerChoices = {};

//the Rooms
let gameRooms = {};

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  //create room
  socket.on("create_room", (data) => {
    console.log("create_room", data);
    const { room, number, id } = data;
    if (room in gameRooms) {
      io.to(id).emit("roomTaken", `Room name ${room} is taken`);
    } else {
      gameRooms[room] = { roomNumber: number };
      gameRooms[room]["players"] = [id];
      gameRooms[room]["noOfPlayers"] = 1;
      playerChoices[room] = {};
      socket.join(room);
      io.to(id).emit("roomCreated", {
        room: room,
        message: `Room ${room} has been created`,
      });
    }
    // socket.join(room);
  });

  //Join Room
  socket.on("join_room", async (data) => {
    //data: {name, email, id, room}
    console.log("ROOM:", data);
    const { room, id, name, email } = data;
    if (room in gameRooms) {
      gameRooms[room]["players"] = [...gameRooms[room]["players"], id];
      gameRooms[room]["noOfPlayers"] = ++gameRooms[room]["noOfPlayers"];
      io.to(id).emit("joined", {
        room,
        message: `Welcome to room ${room}`,
      });
      io.sockets.in(room).emit("message", `${name} has entered the room `);
      console.log(gameRooms);
      console.log(playerChoices);
    } else {
      io.to(id).emit("notJoined", {
        message: `Room ${room} does not exists`,
      });
    }
    // gameRooms[room][id] = name;
    //{room1:{id1:name, id2:name}
    // const result = Object.entries(gameRooms[room]).map(([key, value]) => ({
    //   [key]: value,
    // }));
    // console.log("The room:");
    // console.log(result, result.length);
    // io.sockets.in(room.room).emit("message", result);
    // const sockets = await io.in(room.room).fetchSockets();
    // const socketIds = sockets.map((socket) => socket.id); // creates an array with the ids in the room
  });

  socket.on("sendChoice", (data) => {
    // console.log("choice", choice);
    //choice is an object {name, email, choice}
    const { name, email, choice, room } = data;
    console.log("Checking", playerChoices[room]);
    playerChoices[room][socket.id] = choice;
    console.log("Inside sendChoice listener");
    console.log(
      gameRooms[room]["noOfPlayers"],
      Object.keys(playerChoices[room]).length
    );
    socket.to(room).emit("receivedChoice", data);
    if (
      gameRooms[room]["noOfPlayers"] === Object.keys(playerChoices[room]).length
    ) {
      const player1Choice = {
        id: Object.keys(playerChoices[room])[0],
        choice: Object.values(playerChoices[room])[0],
      };
      const player2Choice = {
        id: Object.keys(playerChoices[room])[1],
        choice: Object.values(playerChoices[room])[1],
      };
      // socket.broadcast.emit("receivedChoice", data);
      const winner = determineWinner(player1Choice, player2Choice);
      io.emit("gameResult", winner);
      // Clear choices
      playerChoices[room] = {};
    }
  });
});

const start = async () => {
  try {
    server.listen(port, console.log(`server is listening on port ${port}`));
  } catch (e) {
    console.log(e);
  }
};

start();

// const playerChoicesTest = {
//   gameRoomId: { player1: "rock", player2: "scissors" },
// };

//playerChoices = {secret:{}}
