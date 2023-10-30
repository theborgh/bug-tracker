import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    const developers = await prisma.project.delete({
      where: {
        id
    }});

    res.json(developers);
  } catch (e) {
    console.error("Error fetching projects:", e);
    res.status(500).send("Error fetching developers");
  } finally {
    await prisma.$disconnect();
  }
}