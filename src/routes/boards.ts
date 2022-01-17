import { Router } from "express";
import * as boards from "../controllers/board";

const router = Router();

router.get("/boards", boards.index);

router.post("/boards", boards.createBoard);

router.get("/boards/:boardId", boards.showBoard);

export default router;
