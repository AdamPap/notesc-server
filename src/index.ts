import "reflect-metadata";
import express from "express";
import { createConnection, Connection } from "typeorm";

const main = async () => {
  const app = express();

  try {
    const connection: Connection = await createConnection();

    if (connection.isConnected) {
      console.log("DB Connection successful.");
    }
  } catch (err) {
    console.log("DB Connection error: ", err);
  }

  app.get("/", (_, res) => {
    res.send("INDEX");
  });

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
};

main();
