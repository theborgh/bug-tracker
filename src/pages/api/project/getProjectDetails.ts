import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch project with specified id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
  const project = await prisma.project.findUnique({ 
    where: { id },
    select: {
      id: true,
      name: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
      bugs: {
        select: {
          id: true,
          title: true,
          markdown: true,
          priority: true,
          status: true,
          minutesToComplete: true,
          assignedToUserId: true,
          reportingUser: {
            select: {
              name: true
            }
          },
          _count: { select: { comments: true } },
          createdAt: true,
          updatedAt: true,
        }
      },
      owner: {
        select: {
          name: true,
          image: true,
        }
      },
      developers: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }
    }
  });

  res.json(project);
} catch (e) {
  console.error("Error querying the database:", e);
} finally {
  await prisma.$disconnect();
}
}