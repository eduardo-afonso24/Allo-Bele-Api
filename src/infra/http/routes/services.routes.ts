import { Router } from "express";
import { deleteService, getAllServices, getAllServicesByUsers, getServices, registerService, updateService } from "../controllers";
const router = Router();

router.post("/services/:userId", registerService);
router.get("/services/:category", getAllServices)
router.get("/services-by-user/:id", getAllServicesByUsers)
router.get("/services", getServices)
router.delete("/services/:serviceId", deleteService)
router.put("/services/:serviceId", updateService)


export default router;