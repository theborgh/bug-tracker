import { Priority, Status } from "@prisma/client";
import {
  ShieldExclamationIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { useSession } from "next-auth/react";
import formatDistance from "date-fns/formatDistance";

type BugCardProps = {
  id: string;
  title: string;
  author: string;
  assignee?: { id: string; name: string | null; image: string | null } | null;

  description: string;
  createdAt: Date;
  priority: { value: Priority; stroke: string };
  commentCount: number;
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
  commentCount,
  status,
}: BugCardProps) {
  const { data: userData } = useSession();

  console.log("created at:", createdAt);

  return (
    <div className="flex flex-col justify-between rounded-md bg-gray-800 py-3 px-4">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-hs font-medium line-clamp-1">{title}</h3>
          <ShieldExclamationIcon
            title={priority.value}
            className={`h-8 w-8 ${priority.stroke} `}
          />
        </div>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}{" "}
          - Reported by {author} - {commentCount} Comments
        </p>
      </div>
      <p className="mb-4 text-sm text-white text-opacity-75">{description}</p>
      <div className="flex items-center justify-between">
        STATUS DROPDOWN
        {/* <StatusDropdown
          bugTitle={title}
          bugId={id}
          status={status}
          assigneId={assignee?.id}
        />
        {assignee ? (
          <Avatar title={assignee?.name ?? "anonymous"}>
            <AvatarImage src={assignee?.image ?? ""} />
            <AvatarFallback>
              {" "}
              {getNameLetters(assignee?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        ) : userData?.user.id === projectOwnerId ? (
          <AssignBugToDev bugTitle={title} bugId={id}>
            <UserPlusIcon className="h-6 w-6" />
          </AssignBugToDev>
        ) : null} */}
      </div>
    </div>
  );
}
