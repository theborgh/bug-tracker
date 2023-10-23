import { Priority, Status } from "@prisma/client";
import {
  ShieldExclamationIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { useSession } from "next-auth/react";
import formatDistance from "date-fns/formatDistance";
import StatusDropdown from "./projectDetails/StatusDropdown";
import { getNameLetters } from "@/utils/data";
import { useState } from "react";
import AssignBugToDev from "./projectDetails/AssignBugToDev";

type BugCardProps = {
  id: string;
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
  commentCount: number;
  status: Status;
};

export function BugCard({
  id,
  projectOwnerId,
  projectDevelopers,
  title,
  author,
  assignedToDev,
  createdAt,
  description,
  priority,
  commentCount,
  status,
}: BugCardProps) {
  const { data: userData } = useSession();
  const [bugStatus, setBugStatus] = useState<Status>(status);

  const updateBugStatus = async (newStatus: Status) => {
    setBugStatus(newStatus);
  };

  return (
    <div className="flex flex-col justify-between rounded-md bg-gray-800 py-3 px-4 text-white">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-hs font-medium line-clamp-1">{title}</h3>
          <ShieldExclamationIcon
            title={priority.value}
            className={`h-8 w-8`}
            stroke={priority.stroke}
          />
        </div>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}{" "}
          - Reported by {author} - {commentCount} comments
        </p>
      </div>
      <p className="mb-4 text-sm text-white text-opacity-75">{description}</p>
      <div className="flex items-center justify-between">
        <StatusDropdown
          bugTitle={title}
          bugId={id}
          status={bugStatus}
          assigneeId={assignedToDev?.id}
          projectOwnerId={projectOwnerId}
          projectDevelopers={projectDevelopers}
          handleBugStatusChange={updateBugStatus}
        />
        {assignedToDev ? (
          <Avatar title={assignedToDev?.name ?? "anonymous"}>
            <AvatarImage src={assignedToDev?.image ?? ""} />
            <AvatarFallback>
              {getNameLetters(assignedToDev?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        ) : userData?.user.id === projectOwnerId ? (
          <AssignBugToDev
            bugTitle={title}
            bugId={id}
            projectDevelopers={projectDevelopers}
          >
            <UserPlusIcon className="h-6 w-6" />
          </AssignBugToDev>
        ) : null}
      </div>
    </div>
  );
}

// Simplified version, for the dashboard
export type SimpleBugCardProps = {
  id: string;
  title: string;
  author: string;
  description: string;
  updatedAt: Date;
  priority: string;
  commentCount: number;
  status: Status;
};

export function SimpleBugCard({
  id,
  title,
  author,
  description,
  updatedAt,
  priority,
  commentCount,
  status,
}: SimpleBugCardProps) {
  return (
    <div className="flex justify-between rounded-md bg-gray-800 py-3 px-4 w-64">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-hs text-white font-medium line-clamp-1">
            {title}
          </h3>
          <p className="mb-4 text-sm text-white text-opacity-75">
            {description}
          </p>
        </div>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          last updated{" "}
          {formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })}
        </p>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          Reported by {author} - {commentCount} comments
        </p>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          Priority: {priority}
        </p>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          Status: {status}
        </p>
      </div>
    </div>
  );
}
