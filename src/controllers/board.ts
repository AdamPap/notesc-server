import { Request, Response } from "express";
import { Board } from "../entities/Board";

export const index = async (_: Request, res: Response) => {
  const boards = await Board.find();

  res.json(boards);
};

export const createBoard = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const board = Board.create({ title, content });
  await board.save();

  res.status(201).json(board);
};
