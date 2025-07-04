import { Router } from "express";
import { authorizeBookMark, getAllBookMark, getAllBookMarkByBarberId, getAllBookMarkByClientId, registerBookMark, updateBookMark } from "../controllers/bookMark";
const router = Router();

router.post("/book-mark/:clientId", registerBookMark);
router.get("/book-mark/:clientId", getAllBookMarkByClientId)
router.get("/book-mark-by-baberId/:barberId", getAllBookMarkByBarberId)
router.put("/book-mark/:id", updateBookMark)
router.put("/authorized-book-mark/:id", authorizeBookMark)
router.get("/book-mark", getAllBookMark);
// router.delete("/services/:serviceId", deleteService)
// router.put("/services/:serviceId", updateService)


export default router;