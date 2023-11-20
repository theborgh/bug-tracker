import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  if (req.method === "PATCH") {
    const { status, priority, assignedToUserId } = req.body;

    try {
      let bug;

      if (status) {
        bug = await prisma.bug.update({
          where: { id },
          data: { status },
        });
      } else if (priority) {
        bug = await prisma.bug.update({
          where: { id },
          data: { priority },
        });
      } else if (assignedToUserId || assignedToUserId === null) {
        bug = await prisma.bug.update({
          where: { id },
          data: { assignedToUserId, status: assignedToUserId ? "TODO" : "UNASSIGNED" },
        });
      } else {
        throw new Error("Invalid request body");
      }

      await prisma.project.update({
        where: { id: bug.projectId },
        data: { updatedAt: new Date() },
      });

      res.json(bug);
    } catch (e) {
      console.error("Error querying the database:", e);
      res.status(500).json({ error: "Error querying the database" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "GET") {
    try {
      const bug = await prisma.bug.findUnique({
        where: { id },
        include: {
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              ownerId: true,
              developers: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
          reportingUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!bug) {
        res.status(404).json({ error: "Bug not found" });
      } else {
        res.json(bug);
      }
    } catch (e) {
      console.error("Error querying the database:", e);
      res.status(500).json({ error: "Error querying the database" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}