import { Priority, Status } from "@prisma/client";
import {
  ShieldExclamationIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import PriorityDropdown from "./projectDetails/PriorityDropdown";
import formatDistance from "date-fns/formatDistance";
import StatusDropdown from "./projectDetails/StatusDropdown";
import {
  Priorities,
  getNameLetters,
  MAX_MARKDOWN_LENGTH,
  shortenTextIfExceedsLength,
} from "@/utils/data";
import AssignBugToDev from "./projectDetails/AssignBugToDev";
import Link from "next/link";

type BugCardProps = {
  id: string;
  reporterId: string;
  projectOwnerId: string;
  projectDevelopers: {
    id: string;
    name: string;
    image: string;
  }[];
  title: string;
  author: string;
  assignedToDev?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;

  description: string;
  createdAt: Date;
  priority: { value: Priority; stroke: string };
  canEditPriority: boolean;
  commentCount: number;
  status: Status;
  handleBugStatusChange: (bugId: string, newStatus: Status) => void;
  handleBugPriorityChange: (bugId: string, newPriority: Priority) => void;
  handleBugAssignment: (bugId: string, assignedToId: string | null) => void;
};

export function BugCard({
  id,
  reporterId,
  projectOwnerId,
  projectDevelopers,
  title,
  author,
  assignedToDev,
  createdAt,
  description,
  priority,
  canEditPriority,
  commentCount,
  status,
  handleBugStatusChange,
  handleBugPriorityChange,
  handleBugAssignment,
}: BugCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-md bg-gray-800 py-3 px-4 text-white w-80">
      <div className="">
        <div className="flex justify-between">
          <h3
            className="text-hs font-medium line-clamp-1 w-64 hover:opacity-70"
            aria-label={title}
            title={title}
          >
            <Link href={`/bug/${id}`}>{title}</Link>
          </h3>
          {canEditPriority ? (
            <PriorityDropdown
              bugId={id}
              priority={priority.value}
              projectOwnerId={projectOwnerId}
              reporterId={reporterId}
              handleBugPriorityChange={handleBugPriorityChange}
            >
              <ShieldExclamationIcon
                title={`${priority.value.toLocaleLowerCase()} priority`}
                className={`h-8 w-8 hover:cursor-pointer`}
                stroke={priority.stroke}
              />
            </PriorityDropdown>
          ) : (
            <ShieldExclamationIcon
              title={`${priority.value.toLocaleLowerCase()} priority`}
              className={`h-8 w-8 hover:cursor-pointer`}
              stroke={priority.stroke}
            />
          )}
        </div>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}{" "}
          - Reported by {author} - {commentCount}{" "}
          {commentCount === 1 ? "comment" : "comments"}
        </p>
      </div>
      <p className="mb-4 text-sm text-white text-opacity-75">
        {shortenTextIfExceedsLength(description, MAX_MARKDOWN_LENGTH)}
      </p>
      <div className="flex items-center justify-between">
        <StatusDropdown
          bugId={id}
          status={status}
          assigneeId={assignedToDev?.id}
          projectOwnerId={projectOwnerId}
          handleBugStatusChange={handleBugStatusChange}
        />
        {assignedToDev ? (
          <AssignBugToDev
            assignedToId={assignedToDev?.id}
            bugTitle={title}
            bugId={id}
            projectDevelopers={projectDevelopers ?? []}
            handleBugAssignment={handleBugAssignment}
          >
            <Avatar title={assignedToDev?.name ?? "anonymous"}>
              <AvatarImage src={assignedToDev?.image ?? ""} />
              <AvatarFallback>
                {getNameLetters(assignedToDev?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          </AssignBugToDev>
        ) : (
          <AssignBugToDev
            assignedToId={null}
            bugTitle={title}
            bugId={id}
            projectDevelopers={projectDevelopers}
            handleBugAssignment={handleBugAssignment}
          >
            <UserPlusIcon className="h-6 w-6" />
          </AssignBugToDev>
        )}
      </div>
    </div>
  );
}

// Simplified version, for the dashboard
export type SimpleBugCardProps = {
  id: string;
  title: string;
  description: string;
  updatedAt: Date;
  priority: string;
  status: Status;
};

export function SimpleBugCard({
  id,
  title,
  description,
  updatedAt,
  priority,
  status,
}: SimpleBugCardProps) {
  return (
    <div className="flex justify-between rounded-md bg-gray-800 py-3 px-4 w-64">
      <div className="w-full">
        <div className="flex justify-between">
          <h3
            className="text-hs font-medium line-clamp-1 hover:opacity-70"
            aria-label={title}
          >
            {title}
          </h3>
          <ShieldExclamationIcon
            title={`${priority.toLocaleLowerCase()} priority`}
            className={`h-8 w-8 hover:cursor-pointer`}
            stroke={Priorities.find((p) => p.value === priority)!.stroke}
          />
        </div>
        <p className="mb-2 mt-2 text-sm text-white text-opacity-75">
          {shortenTextIfExceedsLength(description, MAX_MARKDOWN_LENGTH)}
        </p>
        <p className="mb-3 mt-0.5 text-xs font-light text-white text-opacity-75">
          last updated{" "}
          {formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })}
        </p>
        <p className="mb-1 mt-2 text-xs font-light text-white text-opacity-75">
          <StatusDropdown
            bugId={id}
            status={status}
            projectOwnerId=""
            handleBugStatusChange={() => {}}
          />
        </p>
      </div>
    </div>
  );
}
