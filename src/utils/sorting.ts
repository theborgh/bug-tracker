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
