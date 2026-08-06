import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getMenu(req: Request, res: Response) {
  try {
    const items = await prisma.menuItem.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch menu items" });
  }
}
