import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import path from "path";
import { createConnection, Connection } from "typeorm";
import { Card } from "./entities/Card";
import { Board } from "./entities/Board";
import { List } from "./entities/List";
import * as cards from "./controllers/card";
import * as boards from "./controllers/board";
import * as lists from "./controllers/list";

const main = async () => {
  const app = express();

  app.use(express.json());

  try {
    const connection: Connection = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      logging: true,
      migrationsRun: true,
      entities: [Card, List, Board],
      migrations: [path.join(__dirname, "./migrations/*")],
    });

    if (connection.isConnected) {
      console.log("DB Connection successful.");
      // connection.runMigrations();
      // console.log("DB Migrated successfully.");
    }
  } catch (err) {
    console.error("DB Connection error: ", err);
  }

  app.get("/cards", cards.index);

  app.post("/cards", cards.createCard);

  app.get("/cards/:cardId", cards.showCard);

  app.put("/cards/:cardId", cards.updateCard);

  app.delete("/cards/:cardId", cards.deleteCard);

  app.get("/boards", boards.index);

  app.post("/boards", boards.createBoard);

  app.get("/lists", lists.index);

  app.post("/lists", lists.createList);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
};

main().catch((err) => {
  console.error(err);
});
