import type { ReactNode } from "react";
import { useState } from "react";
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
  children,
  bugId,
  bugTitle,
  projectDevelopers,
  handleBugAssignment,
}: AssignBugToDevProps) {
  const [loading, setLoading] = useState(false);

  const mutate = async (bugId: string, assignedToUserId: string | null) => {
    if (bugId === "newBug") {
      handleBugAssignment(bugId, assignedToUserId);
    } else {
      try {
        setLoading(true);
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
        setLoading(false);
        handleBugAssignment(bugId, assignedToUserId);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

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
                loading && "pointer-events-none opacity-25"
              }}`}
              onClick={() => mutate(bugId, developer.id)}
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
                {loading ? (
                  <ArrowPathIcon
                    aria-hidden
                    className="h-6 w-6 transition duration-200 hover:opacity-50 animate-spin"
                  />
                ) : (
                  <PlusIcon
                    aria-hidden
                    className="h-6 w-6 transition duration-200 hover:opacity-50"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => mutate(bugId, null)}>Unassign</button>
      </DialogContent>
    </Dialog>
  );
}
