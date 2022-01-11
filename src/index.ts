import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import { createConnection, Connection } from "typeorm";
import { Card } from "./entities/Card";
import path from "path";

const main = async () => {
  const app = express();

  app.use(express.json());

  try {
    const connection: Connection = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      logging: true,
      migrationsRun: true,
      entities: [Card],
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

  app.get("/", (_, res) => {
    res.send("INDEX");
  });

  app.get("/cards", async (_, res) => {
    try {
      const cards = await Card.find();

      res.status(200).json(cards);
    } catch (err) {
      console.error(err);
    }
  });

  app.post("/cards", async (req, res) => {
    console.log(req.body);

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

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port} `);
  });
};

main().catch((err) => {
  console.error(err);
});
