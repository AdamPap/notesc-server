import "reflect-metadata";
import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("INDEX");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
