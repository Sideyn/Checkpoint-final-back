const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN,
  })
);

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bonjour !" });
});

app.use("/api", mainRouter);

module.exports = app;
