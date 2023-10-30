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

type DeleteProjectProps = {
  projectId: string;
  projectTitle: string;
  children: ReactNode;
};
export default function AssignBugToDev({
  projectId,
  projectTitle,
  children,
}: DeleteProjectProps) {
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log("delete project");
    if (confirmationMessage === projectTitle) {
      try {
        const response = await fetch(`/api/project/delete?id=${projectId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete project");
        }
        console.log("project deleted");
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
            Delete project <em>{projectTitle}</em>? This action is irreversible!
          </DialogTitle>
          <DialogDescription>
            To confirm, type the project name below and click the delete button.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setConfirmationMessage(e.target.value)}
            type="text"
            className="bg-gray-700 rounded-md w-full py-2 px-3 text-white"
          />
          <button
            type="submit"
            className="bg-red-600 text-white rounded-md px-3 py-2 mt-3"
          >
            Delete
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
