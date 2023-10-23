import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Priority } from "@prisma/client";

interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const NewBug: NextPage = () => {
  const [priority, setPriority] = useState<Priority>("LOW");
  const {
    query: { id },
    push,
  } = useRouter();
  let projects: ProjectData[] = [];
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  useEffect(() => {
    // fetch projects the user is assigned to the user
    const fetchProjects = async () => {
      const res = await fetch(`/api/projects`);
      projects = await res.json();
    };

    fetchProjects();
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting data: ", e);
    void push(`/project/${id as string}`);
  };
  // if (isLoading) return <div className="">loading...</div>;
  // if (!isValidProject) return <div className="">error</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="container m-auto text-white">
        <h1 className="mb-8 text-5xl text-white">Report a bug</h1>
        <form action="POST" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4 flex flex-row">
            <div className="flex-auto pr-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Title
              </label>
              <input placeholder="" type="text" className="custom-input" />
            </div>
            <div className="flex-auto px-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Project
              </label>
              <div>Select the project</div>
            </div>
            <div className="flex-auto px-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Priority
              </label>
              <select
                className="custom-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label
              className="mb-2 block font-medium text-white"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="custom-input"
              rows={20}
            ></textarea>
          </div>
          <div className="ml-auto flex justify-end">
            <Link href="/" className="btn mr-2">
              Cancel
            </Link>
            <button type="submit" className="btn-blue">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NewBug;
