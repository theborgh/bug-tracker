import type { ReactNode } from "react";
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
import { getNameLetters } from "@/utils/data";

type AssignBugToDevProps = {
  bugTitle: string;
  bugId: string;
  projectDevelopers: {
    id: string;
    name: string;
    image: string;
  }[];
  handleBugAssignment: (bugId: string, assignedToId: string) => void;
  children: ReactNode;
};
export default function AssignBugToDev({
  children,
  bugId,
  bugTitle,
  projectDevelopers,
  handleBugAssignment,
}: AssignBugToDevProps) {
  // For new bugs, simply call the handleBugAssignment function
  const mutate = async (bugId: string, assignedToUserId: string) => {
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
      } catch (error) {
        console.error(error);
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
            <p>
              Project owners can assign to anyone; everyone else can self-assign
            </p>
            <ul className="space-y-3 pt-4">
              {projectDevelopers.map((developer) => (
                <li
                  key={developer.id}
                  className="flex justify-between text-bodys"
                >
                  <div className="flex">
                    <Avatar className="mr-4 h-6 w-6">
                      <AvatarImage src={developer?.image ?? ""} />
                      <AvatarFallback>
                        {getNameLetters(developer?.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    {developer.name}
                  </div>
                  <button
                    onClick={() => mutate(bugId, developer.id)}
                    aria-label={`Assign to ${developer?.name ?? ""} `}
                  >
                    <PlusIcon
                      aria-hidden
                      className="h-6 w-6 cursor-pointer transition duration-200 hover:opacity-50"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
