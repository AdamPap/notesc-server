import { Router } from "express";
import * as cards from "../controllers/card";

const router = Router({ mergeParams: true });

router.get("/cards", cards.index);

router.post("/cards", cards.createCard);

router.get("/cards/:cardId", cards.showCard);

router.put("/cards/:cardId", cards.updateCard);

router.delete("/cards/:cardId", cards.deleteCard);

export default router;
