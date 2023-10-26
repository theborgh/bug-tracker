import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id, markdown, authorId } = req.body

  try {
    const newComment = await prisma.comment.create({
      data: {
        markdown,
        authorId,
        bugId: id,
      },
    
    });

    res.status(200).json(newComment);
  } catch (e) {
    console.error("Error creating a new comment:", e);
    res.status(500).send("Error creating a new comment");
  } finally {
    await prisma.$disconnect();
  }
}