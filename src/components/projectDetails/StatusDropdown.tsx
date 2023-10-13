import { useState } from "react";
import type { Status } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import AssignBugToDev from "./AssignBugToDev";
import { defaultStatuses } from "@/utils/data";

type StatusDropdownProps = {
  bugId: string;
  assigneId?: string;
  status: Status;
  bugTitle: string;
  projectOwnerId: string;
  projectDevelopers: {
    id: string;
    name: string;
    image: string;
  }[];
};

const StatusDropdown = ({
  bugId,
  status,
  assigneId,
  bugTitle,
  projectOwnerId,
  projectDevelopers,
}: StatusDropdownProps) => {
  const { data: sessionData } = useSession();

  // add mutate bug status code here
  const mutate = (mutateObj) => {
    console.log("mutating. status:", mutateObj.status, "bugId:", bugId);
  };

  const readonly =
    !sessionData || ![assigneId, projectOwnerId].includes(sessionData.user.id);
  const isOwner = projectOwnerId === sessionData?.user.id;
  const Statuses = isOwner
    ? defaultStatuses
    : defaultStatuses.filter((item) => item.value !== "CLOSED");
  const [open, setOpen] = useState(false);
  const selectedStatusObject = defaultStatuses?.find(
    (item) => item.value === status
  ) ?? {
    value: "UNASSIGNED" as const,
    background: "bg-slate-900",
    label: "Unassigned",
  };

  if (status !== "UNASSIGNED" || sessionData?.user.id !== projectOwnerId)
    return (
      <DropdownMenu.Root
        open={open}
        onOpenChange={(open) => setOpen(readonly ? false : open)}
      >
        <DropdownMenu.Trigger asChild>
          <button
            disabled={readonly}
            className={`rounded-[4px] ${
              readonly ? "cursor-default" : "cursor-pointer"
            } transition hover:bg-opacity-75 ${
              selectedStatusObject.background
            } options w-28 py-1.5 text-center
          text-sm capitalize`}
          >
            {selectedStatusObject.label}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="my-2 w-28 rounded-lg border border-white border-opacity-10 bg-gray-800 p-3 text-sm font-medium text-white">
            <DropdownMenu.RadioGroup>
              {Statuses.map((status) => (
                <DropdownMenu.RadioItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => {
                    mutate({ status: status.value, bugId });
                  }}
                  className={`my-1 cursor-pointer text-center capitalize outline-none transition hover:text-gray-500`}
                >
                  {status.label}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  return (
    <AssignBugToDev
      bugTitle={bugTitle}
      bugId={bugId}
      projectDevelopers={projectDevelopers}
    >
      <span
        className={`inline-block cursor-pointer rounded-[4px] transition hover:bg-opacity-75 ${selectedStatusObject.background} options text-centerz w-28 py-1.5
    text-sm capitalize`}
      >
        {selectedStatusObject.label}
      </span>
    </AssignBugToDev>
  );
};

export default StatusDropdown;
