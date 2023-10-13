import LoginButton from "@/components/LoginButton";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [ownedProjects, setOwnedProjects] = useState<ProjectData[] | null>(
    null
  );
  const [assignedToProjects, setAssignedToProjects] = useState<
    ProjectData[] | null
  >(null);
  const { data: sessionData } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projects?ownedBy=${sessionData?.user.id}`);
      const data = await res.json();
      setOwnedProjects(data);

      const res2 = await fetch(
        `/api/projects?assignedTo=${sessionData?.user.id}`
      );
      const data2 = await res2.json();
      setAssignedToProjects(data2);
    };

    fetchData();
  }, [sessionData?.user.id]);

  return (
    <div>
      <LoginButton />
      <h2>My projects</h2>
      <div className="flex gap-4">
        {ownedProjects?.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <ProjectCard
              id={project.id}
              name={project.name}
              updatedAt={project.updatedAt}
            />
          </Link>
        ))}
      </div>
      <h2>Projects I&apos;m assigned to</h2>

      <div className="flex flex-wrap gap-4">
        {assignedToProjects?.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <ProjectCard
              id={project.id}
              name={project.name}
              updatedAt={project.updatedAt}
            />
          </Link>
        ))}
      </div>

      <h2>Bugs assigned to me</h2>
    </div>
  );
}
