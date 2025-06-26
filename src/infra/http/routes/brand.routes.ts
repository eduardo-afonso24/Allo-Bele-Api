import { Router } from "express";
import { deleteBrand, getAllBrand, registerBrand, updateBrand } from "../controllers/brand";
const router = Router();

router.post("/brand", registerBrand);
router.put("/brand/:id", updateBrand)
router.get("/brand", getAllBrand);
router.delete("/brand/:id", deleteBrand)


export default router;