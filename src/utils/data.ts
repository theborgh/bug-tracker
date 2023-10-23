import type { Status } from "@prisma/client";

export const Priorities = [
  {
    value: "CRITICAL" as const,
    stroke: "red",
    background: "bg-red-500",
  },
  {
    value: "HIGH" as const,
    stroke: "orange",
    background: "bg-orange-500",
  },
  {
    value: "MEDIUM" as const,
    stroke: "yellow",
    background: "bg-yellow-500",
  },
  { value: "LOW" as const, stroke: "white", background: "bg-white" },
];

export const defaultStatuses = [
  {
    value: "UNASSIGNED" as Status,
    label: "Unassigned",
    background: "bg-unassigned",
  },
  { value: "TODO" as Status, label: "Todo", background: "bg-todo" },
  {
    value: "INPROGRESS" as Status,
    background: "bg-inprogress",
    label: "In Progress",
  },
  { value: "TESTING" as Status, background: "bg-testing", label: "Testing" },
  {
    value: "CLOSED" as Status,
    background: "bg-closed",
    label: "Closed",
  },
];

export function getNameLetters(name: string): string {
  const words = name.split(" ");
  switch (words.length) {
    case 0:
      return "AN";
    case 1:
      return words?.[0]?.[0] ?? "AN";
    default:
      const firstLetter = words?.[0]?.[0] ?? "A";
      const secondLetter = words?.[1]?.[0] ?? "N";
      return firstLetter + secondLetter;
  }
}