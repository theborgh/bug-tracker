import { useState } from "react";
import type { ReactNode } from "react";
import type { Priority } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { Priorities } from "@/utils/data";

type PriorityDropdownProps = {
  bugId: string;
  priority: Priority;
  projectOwnerId: string;
  reporterId: string;
  children: ReactNode;
  handleBugPriorityChange: (bugId: string, newPriority: Priority) => void;
};

const PriorityDropdown = ({
  bugId,
  priority,
  projectOwnerId,
  reporterId,
  children,
  handleBugPriorityChange,
}: PriorityDropdownProps) => {
  const { data: sessionData } = useSession();
  const readonly =
    !sessionData || ![reporterId, projectOwnerId].includes(sessionData.user.id);
  const [open, setOpen] = useState(false);

  const updatePriority = async (newPriority: Priority) => {
    const response = await fetch(`/api/bug/${bugId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priority: newPriority }),
    });

    await response.json();

    if (response.ok) {
      handleBugPriorityChange(bugId, newPriority);
    }
  };

  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={(open) => setOpen(readonly ? false : open)}
    >
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="my-2 w-28 rounded-lg border border-white border-opacity-10 bg-gray-800 p-3 text-sm font-medium text-white">
          <DropdownMenu.RadioGroup>
            {Priorities.map((p) => (
              <DropdownMenu.RadioItem
                key={p.value}
                value={p.value}
                onSelect={() => {
                  updatePriority(p.value);
                }}
                className={`my-1 cursor-pointer text-center capitalize outline-none transition hover:text-gray-500`}
              >
                {p.value.charAt(0).toUpperCase() +
                  p.value.slice(1).toLowerCase()}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default PriorityDropdown;
