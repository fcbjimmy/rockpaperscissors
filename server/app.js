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

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("sendChoice", (data) => {
    // console.log("choice", choice);
    //choice is an object {name, email, choice}
    const { name, email, choice } = data;
    playerChoices[socket.id] = choice;

    if (Object.keys(playerChoices).length === 2) {
      const player1Choice = {
        id: Object.keys(playerChoices)[0],
        choice: Object.values(playerChoices)[0],
      };
      const player2Choice = {
        id: Object.keys(playerChoices)[1],
        choice: Object.values(playerChoices)[1],
      };
      socket.broadcast.emit("receivedChoice", choice);
      const winner = determineWinner(player1Choice, player2Choice);
      console.log(winner);
      io.emit("gameResult", winner);
      // Clear choices
      playerChoices = {};
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
