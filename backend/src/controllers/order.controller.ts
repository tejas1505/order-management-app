import { Request, Response } from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  OrderNotFoundError,
  MenuItemNotFoundError,
} from "../services/order.service";

export async function postOrder(req: Request, res: Response) {
  try {
    const order = await createOrder(req.body);
    return res.status(201).json(order);
  } catch (err) {
    if (err instanceof MenuItemNotFoundError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Failed to create order" });
  }
}

export async function getOrder(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId)) {
    return res.status(400).json({ error: "Invalid order id" });
  }
  try {
    const order = await getOrderById(orderId);
    return res.status(200).json(order);
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
}

export async function patchOrderStatus(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId)) {
    return res.status(400).json({ error: "Invalid order id" });
  }
  try {
    const order = await updateOrderStatus(orderId, req.body.status);
    return res.status(200).json(order);
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
}
