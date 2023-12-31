import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch all info used in the sidebar
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
  const results = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      ownedProjects: { select: { id: true, name: true, updatedAt: true } },
      developerOnProjects: { select: { id: true, name: true, updatedAt: true } },
      assignedBugs: { 
        where: {
          status: {
            not: "CLOSED"
          }
        },
        select: { id: true, title: true, updatedAt: true } },
    }
  });

    res.json(results);
  } catch (e) {
    console.error("Error querying the database:", e);
  } finally {
    await prisma.$disconnect();
  }
}