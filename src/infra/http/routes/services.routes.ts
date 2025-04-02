import { Router } from "express";
import { deleteService, getAllServices, getServices, registerService, updateService } from "../controllers";
const router = Router();

router.post("/services/:userId", registerService);
router.get("/services/:userId", getAllServices)
router.get("/services", getServices)
router.delete("/services/:serviceId", deleteService)
router.put("/services/:serviceId", updateService)


export default router;