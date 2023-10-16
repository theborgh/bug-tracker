import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/Sheet";

type DeveloperType = {
  id: string;
  name: string | null;
  image: string | null;
};

export default function NewProjectSheet() {
  const { data: sessionData } = useSession();
  const [projectName, setProjectName] = useState("");
  const [developers, setDevelopers] = useState<DeveloperType[]>([]);

  const isLoading = false;
  const isError = false;

  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch(`/api/users`);
      // const data = await res.json();
      console.log("TODO: fetch data from /api/users");
    };

    fetchData();
  }, []);

  const addMutate = async () => {
    console.log("addMutate");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addMutate();
  };

  return (
    <Sheet>
      <SheetTrigger>New project</SheetTrigger>
      <SheetContent className="rounded-tl-large rounded-bl-large bg-slate-700">
        <SheetHeader>
          <h1 className="mb-8 text-3xl text-white">Add New Project</h1>
        </SheetHeader>
        <div className="text-white">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="text-sm">Title</div>
            <div className="mb-5 flex items-center gap-4">
              <input
                className="custom-input"
                type="text"
                placeholder="Enter project name"
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button type="submit" className="btn-blue whitespace-nowrap">
                Create project
              </button>
            </div>

            <div className="text-sm">Invite developers</div>
            <div className="flex items-center gap-4">
              <input
                className="custom-input"
                type="text"
                placeholder="Enter an Email"
              />
              <button className="btn-blue whitespace-nowrap">
                Send Invite
              </button>
            </div>
          </form>

          {developers.length > 0 && (
            <p className="mb-3 mt-3">Developers list</p>
          )}

          {developers.map((developer) => (
            <li
              key={developer.id}
              className="mb-2 flex justify-between text-bodym"
            >
              <div className="flex">
                <Avatar className="mr-4 h-6 w-6">
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>{developer.name}</AvatarFallback>
                </Avatar>
                {developer.name}
              </div>
              <MinusIcon
                onClick={() =>
                  setDevelopers([
                    ...developers.filter((dev) => dev.id !== developer.id),
                  ])
                }
                className="h-6 w-6 cursor-pointer hover:opacity-50"
              />
            </li>
          ))}

          <p className="mt-3 mb-3">Team members previously added to projects</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
