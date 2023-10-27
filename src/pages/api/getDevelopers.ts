import { PrismaClient } from "@prisma/client";
import { ca } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch projects based on the type query parameter
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query as { projectId: string };

  console.log("test", projectId);

  try {
    const developers = await prisma.user.findMany({
      where: {
        developerOnProjects: {
          some: {
            id: projectId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    console.log(developers);
    res.json(developers);
  } catch (e) {
    console.error("Error fetching projects:", e);
    res.status(500).send("Error fetching developers");
  } finally {
    await prisma.$disconnect();
  }
}