import { Router } from "express";
import { getOneDeliveryPrice, registerDeliveryPrice, updateDeliveryPrice } from "../controllers/deliveryPrice";
const router = Router();

router.post("/delivery-price", registerDeliveryPrice);
router.put("/delivery-price/:id", updateDeliveryPrice)
router.get("/delivery-price", getOneDeliveryPrice);


export default router;