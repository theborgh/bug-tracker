import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch all bugs assigned to the developer with the specified id
// Create a new bug if the method is POST
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    const { type } = req.query as { type: string };
    let bugs = [];

    if (type === "open") {
      bugs = await prisma.bug.findMany({
        where: {
          AND: [ {
          assignedToUserId: req.query.assignedTo as string },
          {status: {
            not: "CLOSED"
          }}]
        },
        select: {
          id: true,
          title: true,
          markdown: true,
          priority: true,
          status: true,
          reportingUserId: true,
          _count: { select: { comments: true } },
          updatedAt: true,
        },
      });
    } else if (type === "all") {
      bugs = await prisma.bug.findMany({
        where: {
          assignedToUserId: id,
        },
        select: {
          id: true,
          title: true,
          markdown: true,
          priority: true,
          status: true,
          reportingUserId: true,
          _count: { select: { comments: true } },
          updatedAt: true,
        },
      });
    } else {
      res.status(400).send("Invalid type");
      return;
    }

    res.json(bugs);
  } catch (e) {
    console.error("Error querying the database:", e);
    res.status(500).send("Error querying the database");
  } finally {
    await prisma.$disconnect();
  }
}

