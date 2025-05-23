import { Router } from "express";
import { checkCode, clearNotificationRequest, confirmRequest, deleteRequest, getAllbarber, getAllClients, getAllConfirmedRequest, getAllConfirmedRequestByUserId, getAllRequest, getAllRequestByBarberId, getAllRequestById, getUserById, iamHereRequest, inTrafficRequest, isItCompleteRequest, lockAndUnlockUser, login, pushNotification, register, sendRequestToAdmin, socialLogin, updateLocationUser, updateUser } from "../controllers";
import { forgotPassword } from "../controllers/user/forgotPassword";
import { resetPassword } from "../controllers/user/resetPassword";
const router = Router();

router.post("/client-register", register);
router.post("/login", login);
router.post("/check-code", checkCode);
router.post("/social-login", socialLogin);
router.post("/register-token-push-notification/:userId", pushNotification);
router.post("/send-request-to-admin", sendRequestToAdmin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.put("/update-profile", updateUser);
router.put("/lock-and-unlock-user/:id", lockAndUnlockUser);
router.put("/confirm-request/:requestId", confirmRequest);
router.put("/user-update-location/:id", updateLocationUser);
router.put("/in-traffic/:requestId", inTrafficRequest);
router.put("/is-it-complete/:requestId", isItCompleteRequest);
router.put("/i-am-here/:requestId", iamHereRequest);
router.put("/clear-request/:requestId", clearNotificationRequest);
router.get("/get-all-request/:baberId", getAllRequestByBarberId);
router.get("/get-all-request-by-id/:id", getAllRequestById);
router.get("/all-barber", getAllbarber);
router.get("/all-clients", getAllClients);
router.get("/all-request", getAllRequest);
router.get("/all-confirmed-request", getAllConfirmedRequest);
router.get("/all-confirmed-request/:userId", getAllConfirmedRequestByUserId);
router.get("/get-info/:id", getUserById);
router.delete("/delete-request/:requestId", deleteRequest);

export default router;