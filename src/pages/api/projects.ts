import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch all projects owned by the user or where the user is a developer
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { ownedBy } = req.query as { ownedBy: string };
  const { assignedTo } = req.query as { assignedTo: string };

  if (ownedBy && !assignedTo) {
    const projects = await prisma.project.findMany({
      where: { ownerId: ownedBy },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json(projects);
  } else if (!ownedBy && assignedTo) {
    const projects = await prisma.project.findMany({
      where: { developers: { some: { id: assignedTo } } },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json(projects);
  } else {
    res.status(400).json({ message: 'Invalid query parameters' });
  }
}