import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch projects based on the type query parameter
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query as { type: string };

  if (req.method === 'GET') {
    if (type) {
      const { userId } = req.query as { userId: string };
  
      switch (type) {
        case 'owner':
          const ownedProjects = await prisma.project.findMany({
            where: { ownerId: userId },
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
              developers: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            }
          });
  
          res.json(ownedProjects);
          break;
        case 'developer':
          const developedProjects = await prisma.project.findMany({
            where: { developers: { some: { id: userId } } },
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
              developers: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                }
              }
            }
          });
  
          res.json(developedProjects);
          break;
        case 'all':
          const allProjects = await prisma.project.findMany({
            where: {
              OR: [
                { ownerId: userId },
                { developers: { some: { id: userId } } },
              ]
            },
            select: {
              id: true,
              name: true,
              ownerId: true,
            }
          });
  
          res.json(allProjects);
          break;
        default:
          res.status(400).json({ message: 'Invalid type parameter' });
          break;
      }
    } else {
      res.status(400).json({ message: 'Missing type parameter' });
    }
  } else if (req.method === 'POST') {
    const { name, ownerId, developers } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        ownerId,
        developers: {
          connect: developers.map((id: string) => ({ id })),
        },
      },
    });

    res.json(project);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

}