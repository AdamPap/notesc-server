import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import path from "path";
import { createConnection, Connection } from "typeorm";
import { Card } from "./entities/Card";
import { Board } from "./entities/Board";
import { List } from "./entities/List";
import cardsRoutes from "./routes/cards";
import boardsRoutes from "./routes/boards";
import listRoutes from "./routes/lists";

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
    }
  } catch (err) {
    console.error("DB Connection error: ", err);
  }

  app.use(cardsRoutes);
  app.use(boardsRoutes);
  app.use(listRoutes);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
};

main().catch((err) => {
  console.error(err);
});
