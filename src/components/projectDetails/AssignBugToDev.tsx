import type { ReactNode } from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getNameLetters } from "@/utils/data";

type AssignBugToDevProps = {
  assignedToId: string | null;
  bugTitle: string;
  bugId: string;
  projectDevelopers: {
    id: string;
    name: string;
    image: string;
  }[];
  handleBugAssignment: (bugId: string, assignedToId: string | null) => void;
  children: ReactNode;
};

export default function AssignBugToDev({
  assignedToId,
  children,
  bugId,
  bugTitle,
  projectDevelopers,
  handleBugAssignment,
}: AssignBugToDevProps) {
  const [selectedDeveloper, setSelectedDeveloper] = useState<null | string>(
    null
  );

  const { mutateAsync: assignBugMutation, isPending: isAssignmentPending } =
    useMutation({
      mutationFn: async (assignedToUserId) => {
        setSelectedDeveloper(assignedToUserId);
        if (bugId === "newBug") {
          handleBugAssignment(bugId, assignedToUserId);
        } else {
          try {
            const response = await fetch(`/api/bug/${bugId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ assignedToUserId }),
            });
            if (!response.ok) {
              throw new Error("Failed to assign bug to developer");
            }

            handleBugAssignment(bugId, assignedToUserId);
            const data = await response.json();
            return data;
          } catch (error: any) {
            console.log(error);
          }

          return null;
        }
      },
      onSuccess: (bugId: string, assignedToUserId: string | null) => {
        handleBugAssignment(bugId, assignedToUserId);
      },
      mutationKey: ["assignBug"],
    });

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign <em>{bugTitle}</em> to...
          </DialogTitle>
          <DialogDescription>
            Project owners can assign bugs to anyone, developers can self-assign
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-1 pt-2">
          {projectDevelopers.map((developer) => (
            <li
              key={developer.id}
              className={`flex justify-between text-bodys p-1 hover:cursor-pointer hover:bg-slate-800 hover:text-white ${
                (isAssignmentPending || assignedToId === developer.id) &&
                "pointer-events-none opacity-25"
              }}`}
              onClick={async () => assignBugMutation(developer.id)}
            >
              <div className="flex items-center gap-2">
                <Avatar title={developer.name}>
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>
                    {getNameLetters(developer?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <span>{developer.name}</span>
              </div>
              <button aria-label={`Assign to ${developer?.name ?? ""} `}>
                {isAssignmentPending
                  ? developer.id === selectedDeveloper && (
                      <ArrowPathIcon
                        aria-hidden
                        className="h-6 w-6 transition duration-200 hover:opacity-50 animate-spin"
                      />
                    )
                  : assignedToId !== developer.id && (
                      <PlusIcon
                        aria-hidden
                        className="h-6 w-6 transition duration-200 hover:opacity-50"
                      />
                    )}
              </button>
            </li>
          ))}
        </ul>
        {assignedToId && (
          <button onClick={() => assignBugMutation(bugId)}>Unassign</button>
        )}
      </DialogContent>
    </Dialog>
  );
}
