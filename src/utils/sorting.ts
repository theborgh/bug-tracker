import { Status } from "@prisma/client";
import { Priorities } from "@/utils/data";

export type bugSortingType =
  | "recent"
  | "oldest"
  | "highest-priority"
  | "lowest-priority"
  | "most-comments"
  | "least-comments";

export const allSortingTypes = [
  "most-comments",
  "least-comments",
  "highest-priority",
  "lowest-priority",
  "recent",
  "oldest",
] as const;

export function getBugSortLabel(sort: bugSortingType): string {
  switch (sort) {
    case "highest-priority":
      return "Highest Priority";
    case "lowest-priority":
      return "Lowest Priority";
    case "oldest":
      return "Oldest";
    case "recent":
      return "Newest";
    case "most-comments":
      return "Most Comments";
    case "least-comments":
      return "Least Comments";
  }
}

export interface Bug {
    id: string;
    title: string;
    markdown: string;
    priority: string;
    status: Status;
    minutesToComplete: number;
    reportingUser: {
      name: string;
      id: string;
    };
    assignedToUserId: string | null;
    _count: { 
      comments: number 
    };
    createdAt: Date;
    updatedAt: string;
}

export const sortByAllCriteria = (a: Bug, b: Bug, sortBy: string) => {
    if (sortBy === "recent") {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "most-comments") {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "least-comments") {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "highest-priority") {
      return (
        Priorities.findIndex((el) => el.value === a.priority) -
        Priorities.findIndex((el) => el.value === b.priority)
      );
    } else if (sortBy === "lowest-priority") {
      return (
        Priorities.findIndex((el) => el.value === b.priority) -
        Priorities.findIndex((el) => el.value === a.priority)
      );
    } else {
      return 0;
    }
  }
