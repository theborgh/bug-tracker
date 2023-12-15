import type { Status } from "@prisma/client";

export const Priorities = [
  {
    value: "CRITICAL" as const,
    stroke: "red",
    background: "bg-critical-priority",
  },
  {
    value: "HIGH" as const,
    stroke: "orange",
    background: "bg-high-priority",
  },
  {
    value: "MEDIUM" as const,
    stroke: "yellow",
    background: "bg-medium-priority",
  },
  { value: "LOW" as const, stroke: "white", background: "bg-low-priority" },
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

export const MAX_MARKDOWN_LENGTH = 100;

export const shortenTextIfExceedsLength = (text: string, maxLength: number = MAX_MARKDOWN_LENGTH) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}