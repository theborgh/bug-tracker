import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    const results = await prisma.user.findMany({
      where: { id },
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