import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { SimpleBugCard } from "@/components/BugCard";
import Sidebar from "@/components/Sidebar";
import LoginErrorMessage from "@/components/LoginErrorMessage";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Developer, SimpleBugCardProps } from "@/types/appTypes";
import LoadingMessage from "@/components/LoadingMessage";

interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
  developers: Developer[];
}

export default function Dashboard() {
  const { data: sessionData } = useSession();

  const { data: ownProjects, isLoading: isOwnProjectsLoading } = useQuery({
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/project/getProjectsByType?userId=${sessionData?.user.id}&type=owner`
        );
        const data = await res.json();
        return data;
      } catch (error: any) {
        console.error(error);
      }
    },
    queryKey: ["getOwnProjects"],
    enabled: !!sessionData?.user.id,
  });

  const { data: assignedProjects, isLoading: isAssignedProjectsLoading } =
    useQuery({
      queryFn: async () => {
        try {
          const res = await fetch(
            `/api/project/getProjectsByType?userId=${sessionData?.user.id}&type=developer`
          );
          const data = await res.json();
          return data;
        } catch (error: any) {
          console.error(error);
        }
      },
      queryKey: ["getAssignedProjects"],
      enabled: !!sessionData?.user.id,
    });

  const { data: assignedBugs, isLoading: isAssignedBugsLoading } = useQuery({
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/bug/getBugs?assignedTo=${sessionData?.user.id}&type=open`
        );
        const data = await res.json();
        return data;
      } catch (error: any) {
        console.error(error);
      }
    },
    queryKey: ["getAssignedBugs"],
    enabled: !!sessionData?.user.id,
  });

  const assignedProjectsNowOwned = assignedProjects?.filter(
    (proj: ProjectData) =>
      !ownProjects?.some((p: ProjectData) => p.id === proj.id)
  );

  useEffect(() => {
    console.log(sessionData);
  }, [sessionData, sessionData?.user.id]);

  if (sessionData === null) {
    return <LoginErrorMessage />;
  }

  if (sessionData === undefined) {
    return <LoadingMessage />;
  }

  return (
    <div className="bg-gray-900 text-white flex-row lg:flex min-h-screen">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-row mx-5 flex-1">
        <h1 className="text-4xl text-center mt-3">Dashboard</h1>
        <h2 className="text-2xl my-3">My projects</h2>
        <div className="flex flex-wrap gap-4 ml">
          {isOwnProjectsLoading ? (
            <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
          ) : ownProjects.length === 0 ? (
            <p className="text-center text-lg px-2">
              You don&apos;t have any projects yet.{" "}
              <Link
                href={"/project/newProject"}
                className="font-bold hover:underline"
              >
                Create your first project
              </Link>
            </p>
          ) : (
            ownProjects
              ?.sort(
                (a: any, b: any) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              ?.map((project: ProjectData) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard
                    id={project.id}
                    name={project.name}
                    updatedAt={project.updatedAt}
                    developers={project.developers}
                  />
                </Link>
              ))
          )}
        </div>

        <h2 className="text-2xl my-3">Projects I&apos;m assigned to</h2>
        <div className="flex flex-wrap gap-4">
          {isAssignedProjectsLoading ? (
            <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
          ) : assignedProjectsNowOwned.length === 0 ? (
            <p className="text-center text-lg px-2">
              You are not assigned to any projects yet.
            </p>
          ) : (
            assignedProjectsNowOwned
              .sort(
                (a: any, b: any) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((project: ProjectData) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard
                    id={project.id}
                    name={project.name}
                    updatedAt={project.updatedAt}
                    developers={project.developers}
                  />
                </Link>
              ))
          )}
        </div>

        <h2 className="text-2xl my-3">Bugs assigned to me</h2>
        <div className="flex flex-wrap gap-4">
          {isAssignedBugsLoading ? (
            <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
          ) : assignedBugs.length === 0 ? (
            <p className="text-center text-lg px-2">
              You have not been assigned any bugs yet.
            </p>
          ) : (
            assignedBugs
              ?.sort(
                (a: any, b: any) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((bug: SimpleBugCardProps) => (
                <Link key={bug.id} href={`/bug/${bug.id}`}>
                  <SimpleBugCard
                    id={bug.id}
                    title={bug.title}
                    description={bug.markdown}
                    updatedAt={bug.updatedAt}
                    priority={bug.priority}
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
