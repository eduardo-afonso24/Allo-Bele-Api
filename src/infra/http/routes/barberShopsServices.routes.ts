import { Router } from "express";
import { deleteService, getAllServices, getAllServicesByBarberShop, getServices, registerService, updateService } from "../controllers/barberShopServices";
const router = Router();

router.post("/services-barber-shops/:barbersShopsId", registerService);
router.get("/services-barber-shops/:category", getAllServices)
router.get("/services-by-barber-shops/:id", getAllServicesByBarberShop)
router.get("/services-barber-shops", getServices)
router.delete("/services-barber-shops/:serviceId", deleteService)
router.put("/services-barber-shops/:serviceId", updateService)


export default router;