const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const apiRouter = require("./router");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://my-first-url-shortener.netlify.app/login",
  },
});

connectDB();

app.use(express.json());
app.use(cors());

app.use("/", apiRouter);

app.get("/", (req, res) => {
  res.send("working");
});

const db = async () => {
  try {
    const socket = await mongoose.connection;

    socket.once("open", () => {
      console.log("socket is ready");

      //books

      const urlCollection = socket.collection("urls");
      const changeStreamB1 = urlCollection.watch();

      changeStreamB1.on("change", (change) => {
        switch (change.operationType) {
          case "insert":
            const urlDetails = change.fullDocument;
            io.emit("new url", urlDetails);
            break;
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

db();

server.listen(PORT, () => {
  console.log(`Server is Running: ${PORT} `);
});
