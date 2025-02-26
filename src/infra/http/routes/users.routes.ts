import { Router } from "express";
import { confirmRequest, getAllbarber, getAllClients, getAllConfirmedRequest, getAllConfirmedRequestByUserId, getAllRequest, getAllRequestByBarberId, getUserById, lockAndUnlockUser, login, register, sendRequestToAdmin, updateLocationUser, updateUser } from "../controllers";
const router = Router();

router.post("/client-register", register);
router.post("/login", login);
router.put("/update-profile", updateUser);
router.put("/lock-and-unlock-user/:id", lockAndUnlockUser);
router.put("/confirm-request/:requestId", confirmRequest);
router.post("/send-request-to-admin", sendRequestToAdmin);
router.get("/get-all-request/:baberId", getAllRequestByBarberId);
router.get("/all-barber", getAllbarber);
router.get("/all-clients", getAllClients);
router.get("/all-request", getAllRequest);
router.get("/all-confirmed-request", getAllConfirmedRequest);
router.get("/all-confirmed-request/:userId", getAllConfirmedRequestByUserId);
router.get("/get-info/:id", getUserById);
router.put("/user-update-location/:id", updateLocationUser);

export default router;