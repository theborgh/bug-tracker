import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch all bugs assigned to the developer with the specified id
// Create a new bug if the method is POST
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  if (req.method === "POST") {
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

      res.json(newBug);
    } catch (e) {
      console.error("Error creating a new bug:", e);
      res.status(500).send("Error creating a new bug");
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "GET") {
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
  } else {
    res.status(405).send("Method not allowed");
  }
}

