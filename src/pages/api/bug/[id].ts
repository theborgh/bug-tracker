import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// PATCH bug
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const { status, assignedToUserId } = req.body;

  try {
    let bug;

    if (status) {
      bug = await prisma.bug.update({
        where: { id },
        data: { status },
      });
    } else if (assignedToUserId) {
      bug = await prisma.bug.update({
        where: { id },
        data: { assignedToUserId, status: "TODO" },
      });
    } else {
      throw new Error("Invalid request body");
    }

    res.json(bug);
  } catch (e) {
    console.error("Error querying the database:", e);
    res.status(500).json({ error: "Error querying the database" });
  } finally {
    await prisma.$disconnect();
  }
}

