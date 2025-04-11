import { Router } from "express";
import baseRoute from "./baseRoutes.routes";
import usersRoutes from "./users.routes";
import chatRoutes from "./chat.routes";
import servicesRoutes from "./services.routes";
import bookMarkRoutes from "./bookMark.routes";
import adminRoutes from "./admin.routes";
import categoryRoutes from "./category.routes";

const router = Router();

router.use(baseRoute);
router.use(usersRoutes);
router.use(adminRoutes);
router.use(chatRoutes);
router.use(servicesRoutes);
router.use(bookMarkRoutes);
router.use(categoryRoutes);

export default router;