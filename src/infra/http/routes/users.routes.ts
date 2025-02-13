import { Router } from "express";
import { confirmRequest, getAllbarber, getAllClients, getAllConfirmedRequest, getAllRequest, getAllRequestByBarberId, getUserById, login, register, sendRequestToAdmin } from "../controllers";
const router = Router();

router.post("/client-register", register);
router.post("/login", login);
router.put("/confirm-request/:requestId", confirmRequest);
router.post("/send-request-to-admin", sendRequestToAdmin);
router.get("/get-all-request/:baberId", getAllRequestByBarberId);
router.get("/all-barber", getAllbarber);
router.get("/all-clients", getAllClients);
router.get("/all-request", getAllRequest);
router.get("/all-confirmed-request", getAllConfirmedRequest);
router.get("/get-info/:id", getUserById);

export default router;