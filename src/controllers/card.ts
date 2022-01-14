import { Request, Response } from "express";
import { Card } from "../entities/Card";

export const index = async (_: Request, res: Response) => {
  try {
    const cards = await Card.find();

    if (cards.length < 1) {
      throw new Error("Not cards found.");
    }

    res.json(cards);
  } catch (err) {
    console.error(err);
  }
};

export const createCard = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const card = Card.create({ title, content });
  await card.save();

  console.log(card);

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
