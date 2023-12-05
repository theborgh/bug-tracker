import { Priority, Status } from "@prisma/client"

interface SessionData {
  user: {
    id: string;
    name: string;
    image: string;
  };
}
interface Comment {
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  id: string;
  bugId: string;
  markdown: string;
  createdAt: string;
  updatedAt: string;
}

interface BugData {
  id: string;
  title: string;
  markdown: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  priority: Priority;
  projectId: string;
  project: {
    name: string;
    id: string;
    ownerId: string;
    developers: {
      id: string;
      name: string;
      image: string;
    }[];
  };
  assignedTo: {
    id: string | null;
    name: string;
    image: string;
  };
  reportingUser: {
    id: string;
    name: string;
    image: string;
  };
  comments: Comment[];
}

interface Developer {
  id: string;
  name: string;
  image: string;
}

export type { SessionData, Comment, BugData, Developer };