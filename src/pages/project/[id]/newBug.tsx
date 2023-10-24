import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Priority } from "@prisma/client";
import { useSession } from "next-auth/react";

interface ProjectData {
  id: string;
  name: string;
  ownerId: string;
}

const NewBug: NextPage = () => {
  const {
    query: { id },
    push,
  } = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("LOW");
  const [description, setDescription] = useState<string>("");
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (id) {
      setSelectedProject(id as string);
    }
  }, [id]);

  useEffect(() => {
    // fetch projects the user is assigned to the user
    const fetchProjects = async () => {
      const res = await fetch(
        `/api/projects?userId=${sessionData?.user.id}&type=all`
      );
      const projects = await res.json();
      setProjects(projects);
    };

    fetchProjects();
  }, [selectedProject, sessionData?.user.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/bugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        markdown: description,
        priority,
        status: "UNASSIGNED",
        projectId: selectedProject,
        reportingUserId: sessionData?.user.id,
      }),
    });

    if (res.status === 200) {
      push(`/project/${selectedProject}`);
    }
  };

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
              <input
                placeholder="Enter a bug name"
                type="text"
                className="custom-input"
                minLength={2}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex-auto px-2">
              <label className="mb-2 block font-medium" htmlFor="">
                Project
              </label>
              <select
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="custom-input"
              >
                {projects.filter((p) => p.ownerId === sessionData?.user.id)
                  .length && (
                  <optgroup label="My projects">
                    {projects
                      .filter((p) => p.ownerId === sessionData?.user.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </optgroup>
                )}
                {projects.filter((p) => p.ownerId !== sessionData?.user.id)
                  .length && (
                  <optgroup label="Assigned projects">
                    {projects
                      .filter((p) => p.ownerId !== sessionData?.user.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
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
              placeholder="Bug description and steps to reproduce..."
              minLength={10}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="ml-auto flex justify-end">
            <Link href={`/project/${id}`} className="btn mr-2">
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
