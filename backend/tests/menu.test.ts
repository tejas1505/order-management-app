import request from "supertest";

jest.mock("../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    menuItem: {
      findMany: jest.fn(),
    },
  },
}));

import { createApp } from "../src/app";
import prisma from "../src/lib/prisma";

const app = createApp();

describe("GET /api/menu", () => {
  it("returns 200 with the list of menu items", async () => {
    const mockItems = [
      { id: 1, name: "Pizza", description: "Cheesy", price: "8.99", imageUrl: "x.jpg" },
    ];
    (prisma.menuItem.findMany as jest.Mock).mockResolvedValue(mockItems);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItems);
  });

  it("returns 200 and an empty array when no items exist", async () => {
    (prisma.menuItem.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 500 when the database call fails", async () => {
    (prisma.menuItem.findMany as jest.Mock).mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
