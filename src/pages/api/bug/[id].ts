import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// PATCH bug
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const { status } = req.body;

  try {
    const bug = await prisma.bug.update({
      where: { id },
      data: { status },
    });

    res.json(bug);
  } catch (e) {
    console.error("Error querying the database:", e);
  } finally {
    await prisma.$disconnect();
  }
}