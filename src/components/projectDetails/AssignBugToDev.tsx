import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  children: ReactNode;
};
export default function AssignBugToDev({
  children,
  bugId,
  bugTitle,
  projectDevelopers,
}: AssignBugToDevProps) {
  // mutate bug to assign to dev here
  const mutate = async (mutateObj) => {
    console.log("mutating. bugId:", bugId, "userId:", mutateObj.userId);
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign {bugTitle} to</DialogTitle>
          {/* <DialogDescription> */}
          <ul className="space-y-3  pt-4">
            {projectDevelopers.map((developer) => (
              <li
                key={developer.id}
                className="flex justify-between text-bodys text-white"
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
                  onClick={() => mutate({ bugId, userId: developer.id })}
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
          {/* </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
