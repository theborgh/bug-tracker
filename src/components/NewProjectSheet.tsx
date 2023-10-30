import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectDevelopers, setProjectDevelopers] = useState<DeveloperType[]>(
    []
  );
  const [allDevelopers, setAllDevelopers] = useState<DeveloperType[]>([]);

  const isLoading = false;
  const isError = false;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/user/getAllUsers`);
      const data = await res.json();

      setAllDevelopers(data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      name: projectName,
      developers: projectDevelopers.map((dev) => dev.id),
      ownerId: sessionData?.user.id,
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setProjectName("");
    setProjectDevelopers([]);

    router.push(`/project/${data.id}`);
  };

  return (
    <Sheet>
      <SheetTrigger>Create new project</SheetTrigger>
      <SheetContent className="rounded-tl-large rounded-bl-large bg-slate-700">
        <SheetHeader>
          <h1 className="mb-8 text-3xl text-white">Add New Project</h1>
        </SheetHeader>
        <div className="text-white">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="text-sm">Title</div>
            <div className="mb-5 flex items-center gap-4">
              <input
                className="custom-input text-white"
                type="text"
                placeholder="Enter project name"
                onChange={(e) => setProjectName(e.target.value)}
                minLength={3}
                required
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

          {projectDevelopers.length > 0 && (
            <p className="mb-3 mt-3">New project developers</p>
          )}

          {projectDevelopers.map((developer) => (
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
                  setProjectDevelopers([
                    ...projectDevelopers.filter(
                      (dev) => dev.id !== developer.id
                    ),
                  ])
                }
                className="h-6 w-6 cursor-pointer hover:opacity-50"
              />
            </li>
          ))}

          <p className="mt-3 mb-3">Add existing developers</p>

          {!isLoading &&
            !isError &&
            allDevelopers.length > 0 &&
            allDevelopers
              .filter(
                (dev) =>
                  !projectDevelopers.some((projDev) => projDev.id === dev.id)
              )
              .map((developer) => (
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
                  <PlusIcon
                    onClick={() =>
                      setProjectDevelopers([...projectDevelopers, developer])
                    }
                    className="h-6 w-6 cursor-pointer hover:opacity-50"
                  />
                </li>
              ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
