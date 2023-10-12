import { Priority, Status } from "@prisma/client";

type BugCardProps = {
  id: string;
  title: string;
  author: string;
  assignee?: { id: string; name: string | null; image: string | null } | null;

  description: string;
  createdAt: Date;
  priority: { value: Priority; stroke: string };
  status: Status;
};

export default function BugCard({
  id,
  title,
  author,
  assignee,
  createdAt,
  description,
  priority,
  status,
}: BugCardProps) {
  return <div>BUG CARD</div>;
}
