import { Router } from "express";
import { deleteBarbersShops, getAllBarberShops, registerBarbersShops, updateBarbersShops } from "../controllers/barbersShops";
const router = Router();

router.post("/barber-shops", registerBarbersShops);
router.get("/barber-shops", getAllBarberShops)
router.delete("/barber-shops/:id", deleteBarbersShops)
router.put("/barber-shops/:id", updateBarbersShops)


export default router;