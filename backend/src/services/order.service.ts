import prisma from "../lib/prisma";
import { CreateOrderInput } from "../schemas/order.schema";

export class OrderNotFoundError extends Error {}
export class MenuItemNotFoundError extends Error {}

export async function createOrder(input: CreateOrderInput) {
  const menuItemIds = input.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  });

  if (menuItems.length !== new Set(menuItemIds).size) {
    throw new MenuItemNotFoundError("One or more menu items do not exist");
  }

  const priceMap = new Map(menuItems.map((m) => [m.id, m.price]));
  const totalAmount = input.items.reduce((sum, item) => {
    const price = Number(priceMap.get(item.menuItemId));
    return sum + price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName,
      address: input.address,
      phone: input.phone,
      totalAmount,
      items: {
        create: input.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: priceMap.get(item.menuItemId)!,
        })),
      },
    },
    include: { items: { include: { menuItem: true } } },
  });

  // Status progression is now simulated entirely on the frontend (derived
  // from createdAt + elapsed time), so nothing schedules a status change
  // here. This PATCH-backed status field still exists for real status
  // updates (e.g. a future admin/kitchen view).

  return order;
}

export async function getOrderById(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { menuItem: true } } },
  });
  if (!order) throw new OrderNotFoundError("Order not found");
  return order;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) throw new OrderNotFoundError("Order not found");

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  });

  return order;
}
