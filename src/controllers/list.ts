import { Request, Response } from "express";
import { Board } from "../entities/Board";
import { List } from "../entities/List";

export const index = async (_: Request, res: Response) => {
  const lists = await List.find({ relations: ["board"] });

  res.json(lists);
};

export const createList = async (req: Request<{}, {}, List>, res: Response) => {
  const { title, content, boardId } = req.body;

  const board = await Board.findOne({ id: boardId });

  if (!board) {
    throw new Error("Board not found");
  }

  const list = List.create({ title, content, boardId });
  list.board = board;
  await list.save();

  res.status(201).json(list);
};
