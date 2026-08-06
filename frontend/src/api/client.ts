import axios from "axios";
import { MenuItem, Order, DeliveryDetails, OrderStatus } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const client = axios.create({ baseURL: API_BASE_URL });

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await client.get<MenuItem[]>("/menu");
  return res.data;
}

export async function placeOrder(
  delivery: DeliveryDetails,
  items: { menuItemId: number; quantity: number }[]
): Promise<Order> {
  const res = await client.post<Order>("/orders", { ...delivery, items });
  return res.data;
}

export async function fetchOrder(orderId: number): Promise<Order> {
  const res = await client.get<Order>(`/orders/${orderId}`);
  return res.data;
}

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const res = await client.patch<Order>(`/orders/${orderId}/status`, { status });
  return res.data;
}
