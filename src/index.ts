import "reflect-metadata";
import "dotenv-safe/config";
import express, { Request } from "express";
import path from "path";
import { createConnection, Connection } from "typeorm";
import { Card } from "./entities/Card";
import { Board } from "./entities/Board";
import { List } from "./entities/List";
import * as cards from "./controllers/card";

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

  app.post("/cards", async (req, res) => {
    const { title, content } = req.body;

    const card = Card.create({ title, content });
    await card.save();

    console.log(card);

    res.status(201).json(card);
  });

  app.get("/cards/:cardId", async (req, res) => {
    const cardId = parseInt(req.params.cardId);

    const card = await Card.findOne(cardId);

    if (!card) {
      throw new Error("Card not found.");
    }

    res.status(200).send(card);
  });

  app.put("/cards/:cardId", async (req, res) => {
    const cardId = parseInt(req.params.cardId);

    const card = await Card.findOne({ id: cardId });

    if (!card) {
      throw new Error("Card not found");
    }

    const { title, content } = req.body;

    Card.update(
      { id: cardId },
      {
        title,
        content,
      }
    );

    // card.title = title;
    // card.content = content;

    // card.save();

    res.json(card);
  });

  app.delete("/cards/:cardId", async (req, res) => {
    const cardId = parseInt(req.params.cardId);

    const card = Card.findOne({ id: cardId });

    if (!card) {
      throw new Error("Card not found");
    }

    await Card.delete({ id: cardId });

    res.json({ deleted: true });
  });

  app.post("/boards", async (req, res) => {
    const { title, content } = req.body;

    const board = Board.create({ title, content });
    await board.save();

    res.status(201).json(board);
  });

  app.get("/boards", async (_, res) => {
    const boards = await Board.find();

    res.json(boards);
  });

  app.post("/lists", async (req: Request<{}, {}, List>, res) => {
    const { title, content, boardId } = req.body;

    const board = await Board.findOne({ id: boardId });

    if (!board) {
      throw new Error("Board not found");
    }

    const list = List.create({ title, content, boardId });
    list.board = board;
    await list.save();

    res.status(201).json(list);
  });

  app.get("/lists", async (_, res) => {
    const lists = await List.find({ relations: ["board"] });

    res.json(lists);
  });

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
};

main().catch((err) => {
  console.error(err);
});
