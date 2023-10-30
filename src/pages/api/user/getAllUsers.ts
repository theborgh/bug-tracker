import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      }
    });

    res.json(results);
  } catch (e) {
    console.error("Error querying the database:", e);
  } finally {
    await prisma.$disconnect();
  }
}