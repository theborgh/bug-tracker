import { getBugSortLabel, sortByAllCriteria, Bug, bugSortingType } from "./sorting";
import { Status } from "@prisma/client";

describe("sorting", () => {
  describe("getBugSortLabel", () => {
    it("should return correct label for each sorting type", () => {
      const sortingTypes: bugSortingType[] = [
        "recent",
        "oldest",
        "highest-priority",
        "lowest-priority",
        "most-comments",
        "least-comments",
      ];
      const expectedLabels = [
        "Newest",
        "Oldest",
        "Highest Priority",
        "Lowest Priority",
        "Most Comments",
        "Least Comments",
      ];

      sortingTypes.forEach((type, index) => {
        expect(getBugSortLabel(type)).toBe(expectedLabels[index]);
      });
    });
  });

  describe("sortByAllCriteria", () => {
    const bugA: Bug = {
      id: "1",
      title: "Bug A",
      markdown: "Markdown A",
      priority: "HIGH",
      status: Status.TODO,
      minutesToComplete: 60,
      reportingUser: {
        name: "User A",
        id: "1",
      },
      assignedToUserId: "2",
      _count: { comments: 5 },
      createdAt: new Date("2022-01-01T00:00:00Z"),
      updatedAt: "2022-01-01T00:00:00Z",
    };

    const bugB: Bug = {
      id: "2",
      title: "Bug B",
      markdown: "Markdown B",
      priority: "LOW",
      status: Status.CLOSED,
      minutesToComplete: 120,
      reportingUser: {
        name: "User B",
        id: "2",
      },
      assignedToUserId: "1",
      _count: { comments: 10 },
      createdAt: new Date("2022-02-01T00:00:00Z"),
      updatedAt: "2022-02-01T00:00:00Z",
    };

    it("should sort by recent", () => {
      expect(sortByAllCriteria(bugA, bugB, "recent")).toBeGreaterThan(0);
      expect(sortByAllCriteria(bugB, bugA, "recent")).toBeLessThan(0);
    });

    it("should sort by oldest", () => {
      expect(sortByAllCriteria(bugA, bugB, "oldest")).toBeGreaterThan(1);
      expect(sortByAllCriteria(bugB, bugA, "oldest")).toBeGreaterThan(0);
    });

    it("should sort by most comments", () => {
      expect(sortByAllCriteria(bugA, bugB, "most-comments")).toBeLessThan(0);
      expect(sortByAllCriteria(bugB, bugA, "most-comments")).toBeGreaterThan(0);
    });

    it("should sort by least comments", () => {
      expect(sortByAllCriteria(bugA, bugB, "least-comments")).toBeLessThan(0);
      expect(sortByAllCriteria(bugB, bugA, "least-comments")).toBeGreaterThan(0);
    });

    it("should sort by highest priority", () => {
      expect(sortByAllCriteria(bugA, bugB, "highest-priority")).toBeLessThan(0);
      expect(sortByAllCriteria(bugB, bugA, "highest-priority")).toBeGreaterThan(0);
    });

    it("should sort by lowest priority", () => {
      expect(sortByAllCriteria(bugA, bugB, "lowest-priority")).toBeGreaterThan(0);
      expect(sortByAllCriteria(bugB, bugA, "lowest-priority")).toBeLessThan(0);
    });
  });
});