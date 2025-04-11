import { Router } from "express";
import { deleteCategory, getAllCategory, registerCategory, updateCategory } from "../controllers";
const router = Router();

router.post("/category", registerCategory);
router.get("/category", getAllCategory)
router.put("/category/:id", updateCategory)
router.delete("/category/:id", deleteCategory);


export default router;