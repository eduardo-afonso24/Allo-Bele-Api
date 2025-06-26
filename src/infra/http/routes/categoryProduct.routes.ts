import { Router } from "express";
import { deleteCategoryProduct, getAllCategoryProduct, registerCategoryProduct, updateCategoryProduct } from "../controllers/categoryProduct";
const router = Router();

router.post("/category-product", registerCategoryProduct);
router.put("/category-product/:id", updateCategoryProduct)
router.get("/category-product", getAllCategoryProduct);
router.delete("/category-product/:id", deleteCategoryProduct)


export default router;