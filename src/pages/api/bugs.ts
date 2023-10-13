import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch all bugs assigned to the developer with the specified id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  const bugs = await prisma.bug.findMany({
    where: { assignedToUserId: id },
    select: {
      id: true,
      title: true,
      markdown: true,
      priority: true,
      status: true,
      reportingUserId: true,
      _count: { select: { comments: true } },
      updatedAt: true,
    }
  });

    res.json(bugs);
}
