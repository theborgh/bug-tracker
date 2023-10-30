import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, markdown, priority, reportingUserId, projectId, assignedToUserId } = req.body;

  try {
    const newBug = await prisma.bug.create({
      data: {
        title,
        markdown,
        priority,
        status: assignedToUserId ? "TODO" : "UNASSIGNED",
        assignedToUserId: assignedToUserId || null,
        reportingUserId,
        projectId,
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    });

    res.json(newBug);
  } catch (e) {
    console.error("Error creating a new bug:", e);
    res.status(500).send("Error creating a new bug");
  } finally {
    await prisma.$disconnect();
  }
  
}

