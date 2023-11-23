import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import { NextPage } from "next";
import Sidebar from "@/components/Sidebar";
import { getNameLetters } from "@/utils/data";

type DeveloperType = {
  id: string;
  name: string | null;
  image: string | null;
};

const NewProject: NextPage = () => {
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

    const res = await fetch("/api/project/postNewProject", {
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
    <main className="flex">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-1 min-h-screen flex-col items-center justify-center bg-gray-900 w-full p-8">
        <h1 className="mb-8 text-3xl text-white">Add New Project</h1>

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
                <Avatar className="mr-4">
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>
                    {getNameLetters(developer?.name ?? "")}
                  </AvatarFallback>
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
                    <Avatar className="mr-4">
                      <AvatarImage src={developer?.image ?? ""} />
                      <AvatarFallback>
                        {getNameLetters(developer?.name ?? "")}
                      </AvatarFallback>
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
      </div>
    </main>
  );
};

export default NewProject;
