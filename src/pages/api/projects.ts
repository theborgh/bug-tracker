import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch project with specified id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  console.log('projects.ts api: id is', id);

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
          priority: true,
          status: true,
          minutesToComplete: true,
          reportingUserId: true,
        }
      }
    }
  });

  console.log('projects.ts api: project is', project);

  res.json(project);
}