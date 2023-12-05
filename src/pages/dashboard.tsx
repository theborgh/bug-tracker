import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { SimpleBugCard } from "@/components/BugCard";
import { Status } from "@prisma/client";
import Sidebar from "@/components/Sidebar";
import LoginErrorMessage from "@/components/LoginErrorMessage";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

interface Developer {
  id: string;
  name: string;
  image: string;
}

interface ProjectData {
  id: string;
  name: string;
  updatedAt: string;
  developers: Developer[];
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
  const { data: sessionData } = useSession();

  const { data: ownProjects, isLoading: isOwnProjectsLoading } = useQuery({
    queryFn: async () => {
      try {
        console.log("user id", sessionData?.user.id);
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

  if (
    !sessionData &&
    !(
      isOwnProjectsLoading ||
      isAssignedProjectsLoading ||
      isAssignedBugsLoading
    )
  ) {
    return <LoginErrorMessage />;
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
          ) : (
            assignedProjects
              ?.filter(
                (proj: ProjectData) =>
                  !ownProjects?.some((p: ProjectData) => p.id === proj.id)
              )
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
