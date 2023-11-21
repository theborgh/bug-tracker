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
import { useRouter } from "next/router";

type DeleteProjectProps = {
  projectId: string;
  projectTitle: string;
  children: ReactNode;
};

export default function DeleteProject({
  projectId,
  projectTitle,
  children,
}: DeleteProjectProps) {
  const router = useRouter();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/project/delete?id=${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Permanently delete project <em>{projectTitle}</em>?
          </DialogTitle>
          <DialogDescription>
            This action will{" "}
            <span className="text-red-600 font-bold">permanently delete</span>{" "}
            the project, all project bugs and their comments. To confirm, type
            the project name below and click &apos;delete&apos;.
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
            className="bg-red-600 text-white rounded-md px-3 py-2 mt-3 disabled:opacity-50"
            disabled={loading || confirmationMessage !== projectTitle}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
