import { Router } from "express";
import * as lists from "../controllers/list";

const router = Router({ mergeParams: true });

router.get("/lists", lists.index);

router.post("/lists", lists.createList);

export default router;
