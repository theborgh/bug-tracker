import LoginButton from "@/components/LoginButton";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { SimpleBugCard } from "@/components/BugCard";
import { Status } from "@prisma/client";
import Sidebar from "@/components/Sidebar";
import { FetchState } from "@/utils/fetch";

interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
}

interface SimpleBugCardProps {
  id: string;
  title: string;
  author: string;
  description: string;
  updatedAt: Date;
  priority: string;
  _count: { comments: number };
  status: Status;
}

export default function Dashboard() {
  const [ownedProjects, setOwnedProjects] = useState<FetchState<ProjectData[]>>(
    { data: null, loading: true, error: null }
  );
  const [assignedToProjects, setAssignedToProjects] = useState<
    FetchState<ProjectData[]>
  >({ data: null, loading: true, error: null });
  const [assignedToMeBugs, setAssignedToMeBugs] = useState<
    FetchState<SimpleBugCardProps[]>
  >({ data: null, loading: true, error: null });
  const { data: sessionData } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/projects?userId=${sessionData?.user.id}&type=owner`
        );
        const data = await res.json();
        setOwnedProjects({ data, loading: false, error: null });
      } catch (error: any) {
        setOwnedProjects({ data: null, loading: false, error });
      }

      try {
        const res2 = await fetch(
          `/api/projects?userId=${sessionData?.user.id}&type=developer`
        );
        const data2 = await res2.json();
        setAssignedToProjects({ data: data2, loading: false, error: null });
      } catch (error: any) {
        setAssignedToProjects({ data: null, loading: false, error });
      }

      try {
        const res3 = await fetch(
          `/api/bugs?assignedTo=${sessionData?.user.id}&type=open`
        );
        const data3 = await res3.json();
        setAssignedToMeBugs({ data: data3, loading: false, error: null });
      } catch (error: any) {
        setAssignedToMeBugs({ data: null, loading: false, error });
      }
    };

    fetchData();
  }, [sessionData?.user.id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-row mx-5">
        <h1 className="text-4xl text-center mt-3">Dashboard</h1>
        <h2 className="text-2xl my-3">My projects</h2>
        <div className="flex gap-4 ml">
          {ownedProjects.loading ? (
            <p>Loading my projects...</p>
          ) : ownedProjects.error ? (
            <p>Error: {ownedProjects.error.message}</p>
          ) : (
            ownedProjects.data?.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  updatedAt={project.updatedAt}
                />
              </Link>
            ))
          )}
        </div>

        <h2 className="text-2xl my-3">Projects I&apos;m assigned to</h2>
        <div className="flex flex-wrap gap-4">
          {assignedToProjects.loading ? (
            <p>Loading assigned projects...</p>
          ) : assignedToProjects.error ? (
            <p>Error: {assignedToProjects.error.message}</p>
          ) : (
            assignedToProjects.data?.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  updatedAt={project.updatedAt}
                />
              </Link>
            ))
          )}
        </div>

        <h2 className="text-2xl my-3">Bugs assigned to me</h2>
        <div className="flex flex-wrap gap-4">
          {assignedToMeBugs.loading ? (
            <p>Loading assigned bugs...</p>
          ) : assignedToMeBugs.error ? (
            <p>Error: {assignedToMeBugs.error.message}</p>
          ) : (
            assignedToMeBugs?.data?.map((bug) => (
              <Link key={bug.id} href={`/bug/${bug.id}`}>
                <SimpleBugCard
                  id={bug.id}
                  title={bug.title}
                  author={bug.author}
                  description={bug.description}
                  updatedAt={bug.updatedAt}
                  priority={bug.priority}
                  commentCount={bug._count?.comments ?? 0}
                  status={bug.status}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
