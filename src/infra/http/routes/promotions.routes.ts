import { Router } from "express";
import {
  deletePromotions,
  getPromotions,
  registerPromotions,
  updatePromotions,
} from "../controllers";
const router = Router();

router.post("/promotions", registerPromotions);
router.get("/promotions", getPromotions);
router.delete("/promotions/:id", deletePromotions);
router.put("/promotions/:id", updatePromotions);

export default router;
