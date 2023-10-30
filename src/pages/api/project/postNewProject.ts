import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Fetch projects based on the type query parameter
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
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
}