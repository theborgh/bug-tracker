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

const BugPage: NextPage = () => {
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
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="container m-auto text-white">
        <h1 className="mb-8 text-5xl text-white">Bug details</h1>
      </div>
    </main>
  );
};

export default BugPage;
