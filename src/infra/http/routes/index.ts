import { Router } from "express";
import baseRoute from "./baseRoutes.routes";
import usersRoutes from "./users.routes";
import chatRoutes from "./chat.routes";
import servicesRoutes from "./services.routes";
import bookMarkRoutes from "./bookMark.routes";
import adminRoutes from "./admin.routes";
import categoryRoutes from "./category.routes";
import productsRoutes from "./products.routes";
import brandRoutes from "./brand.routes";
import categoryProductRoutes from "./categoryProduct.routes";

const router = Router();

router.use(baseRoute);
router.use(usersRoutes);
router.use(adminRoutes);
router.use(chatRoutes);
router.use(servicesRoutes);
router.use(bookMarkRoutes);
router.use(categoryRoutes);
router.use(productsRoutes);
router.use(brandRoutes);
router.use(categoryProductRoutes);

export default router;