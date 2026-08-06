import request from "supertest";

jest.mock("../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    menuItem: { findMany: jest.fn() },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { createApp } from "../src/app";
import prisma from "../src/lib/prisma";

const app = createApp();

const sampleMenuItems = [
  { id: 1, name: "Pizza", price: "8.99" },
  { id: 2, name: "Burger", price: "7.49" },
];

afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST /api/orders", () => {
  it("creates an order with valid input and returns 201", async () => {
    (prisma.menuItem.findMany as jest.Mock).mockResolvedValue(sampleMenuItems);
    (prisma.order.create as jest.Mock).mockResolvedValue({
      id: 1,
      customerName: "Jane Doe",
      address: "123 Main St",
      phone: "1234567890",
      status: "ORDER_RECEIVED",
      totalAmount: "24.47",
      items: [],
    });

    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        address: "123 Main St",
        phone: "1234567890",
        items: [
          { menuItemId: 1, quantity: 2 },
          { menuItemId: 2, quantity: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("ORDER_RECEIVED");
    expect(prisma.order.create).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/orders").send({ customerName: "Jane" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("details");
  });

  it("returns 400 for an invalid phone number", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        address: "123 Main St",
        phone: "abc",
        items: [{ menuItemId: 1, quantity: 1 }],
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 when quantity is zero or negative", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        address: "123 Main St",
        phone: "1234567890",
        items: [{ menuItemId: 1, quantity: 0 }],
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 when a menu item does not exist", async () => {
    (prisma.menuItem.findMany as jest.Mock).mockResolvedValue([sampleMenuItems[0]]);

    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        address: "123 Main St",
        phone: "1234567890",
        items: [
          { menuItemId: 1, quantity: 1 },
          { menuItemId: 999, quantity: 1 },
        ],
      });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/orders/:id", () => {
  it("returns 200 with the order when found", async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      status: "PREPARING",
      items: [],
    });

    const res = await request(app).get("/api/orders/1");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("PREPARING");
  });

  it("returns 404 when the order does not exist", async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/api/orders/999");

    expect(res.status).toBe(404);
  });

  it("returns 400 for a non-numeric id", async () => {
    const res = await request(app).get("/api/orders/abc");

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  it("updates the status and returns 200", async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue({ id: 1, status: "ORDER_RECEIVED" });
    (prisma.order.update as jest.Mock).mockResolvedValue({ id: 1, status: "PREPARING" });

    const res = await request(app).patch("/api/orders/1/status").send({ status: "PREPARING" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("PREPARING");
  });

  it("returns 400 for an invalid status value", async () => {
    const res = await request(app).patch("/api/orders/1/status").send({ status: "BAKING" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when updating a non-existent order", async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).patch("/api/orders/999/status").send({ status: "PREPARING" });

    expect(res.status).toBe(404);
  });
});
