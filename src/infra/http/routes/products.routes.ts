import { Router } from "express";
import { deleteProducts, getAllProducts, getProducts, registerProduct, updateProduct } from "../controllers/products";
const router = Router();

router.post("/products", registerProduct);
router.get("/products/:category", getAllProducts)
router.get("/products", getProducts)
router.delete("/products/:id", deleteProducts)
router.put("/products/:id", updateProduct)


export default router;