import { Request, Response } from "express";
import { List } from "../entities/List";
import { Card } from "../entities/Card";

export const index = async (_: Request, res: Response) => {
  try {
    const cards = await Card.find({ relations: ["list"] });

    if (cards.length < 1) {
      throw new Error("Not cards found.");
    }

    res.json(cards);
  } catch (err) {
    console.error(err);
  }
};

export const createCard = async (req: Request<{}, {}, Card>, res: Response) => {
  const { title, content, listId } = req.body;

  const list = await List.findOne({ id: listId });

  if (!list) {
    throw new Error("List not found");
  }

  const card = Card.create({ title, content, listId });
  card.list = list;
  await card.save();

  res.status(201).json(card);
};

export const showCard = async (req: Request, res: Response) => {
  const cardId = parseInt(req.params.cardId);

  const card = await Card.findOne(cardId);

  if (!card) {
    throw new Error("Card not found.");
  }

  res.send(card);
};

export const updateCard = async (req: Request, res: Response) => {
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

  res.json(card);
};

export const deleteCard = async (req: Request, res: Response) => {
  const cardId = parseInt(req.params.cardId);

  const card = Card.findOne({ id: cardId });

  if (!card) {
    throw new Error("Card not found");
  }

  await Card.delete({ id: cardId });

  res.json({ deleted: true });
};
