import { Router } from "express";
import {
  deleteProducts,
  getAllProducts,
  getProducts,
  getProductsAll,
  getProductsAllIsWholesale,
  getProductsById,
  registerProduct,
  registerProductIsWholesale,
  updateProduct,
  updateProductDiscount,
  updateProductIsWholesale,
  updateProductUnavailable,
} from "../controllers/products";
const router = Router();

router.post("/products", registerProduct);
router.post("/products-is-wholesale", registerProductIsWholesale);
router.get("/products/:id", getProductsById);
router.get("/products/:category", getAllProducts);
router.get("/products", getProducts);
router.get("/products-all", getProductsAll);
router.get("/products-all-is-wholesale", getProductsAllIsWholesale);
router.delete("/products/:id", deleteProducts);
router.put("/products/:id", updateProduct);
router.put("/product-update-discount/:id", updateProductDiscount);
router.put("/product-unavailable/:id", updateProductUnavailable);
router.put("/product-is-wholesal/:id", updateProductIsWholesale);

export default router;
