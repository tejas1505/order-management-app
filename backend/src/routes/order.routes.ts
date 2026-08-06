import { Router } from "express";
import { postOrder, getOrder, patchOrderStatus } from "../controllers/order.controller";
import { validateBody } from "../middleware/validate";
import { createOrderSchema, updateStatusSchema } from "../schemas/order.schema";

const router = Router();

router.post("/", validateBody(createOrderSchema), postOrder);
router.get("/:id", getOrder);
router.patch("/:id/status", validateBody(updateStatusSchema), patchOrderStatus);

export default router;
