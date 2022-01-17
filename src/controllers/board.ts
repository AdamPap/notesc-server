import { Request, Response } from "express";
import { Board } from "../entities/Board";

export const index = async (_: Request, res: Response) => {
  const boards = await Board.find({ relations: ["lists"] });

  res.json(boards);
};

export const createBoard = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const board = Board.create({ title, content });
  await board.save();

  res.status(201).json(board);
};

export const showBoard = async (
  req: Request<{ boardId: string }, {}, {}>,
  res: Response
) => {
  const boardId = parseInt(req.params.boardId);

  const board = await Board.findOne({ id: boardId }, { relations: ["lists"] });

  if (!board) {
    throw new Error("Board not found");
  }

  res.json(board);
};
