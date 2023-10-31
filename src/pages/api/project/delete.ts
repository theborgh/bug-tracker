import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    await prisma.comment.deleteMany({
      where: {
        Bug: {
          project: {
            id,
          },
        },
      },
    });

    await prisma.bug.deleteMany({
      where: {
        project: {
          id,
        },
      },
    });

    await prisma.project.delete({
      where: {
        id
    }});

    res.json({ message: "Project and associated bugs and comments deleted successfully" });
  } catch (e) {
    console.error("Error deleting project and associated bugs and comments:", e);
    res.status(500).send("Error deleting project and associated bugs and comments");
  } finally {
    await prisma.$disconnect();
  }
}