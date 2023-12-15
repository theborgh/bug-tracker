import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import LoginButton from "./LoginButton";
import { useQuery } from "@tanstack/react-query";
import getConfig from "next/config";
import {
  BugAntIcon,
  FolderOpenIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Sidebar({
  loggedUser,
}: {
  loggedUser:
    | ({ id: string } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | undefined;
}) {
  const { publicRuntimeConfig } = getConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: sidebarData, isLoading: isSidebarLoading } = useQuery({
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/user/getSidebarData?id=${loggedUser?.id}`
        );
        const data = await res.json();
        return data;
      } catch (error: any) {
        console.error(error);
      }
    },
    queryKey: ["getSidebarData"],
    enabled: !!loggedUser?.id,
  });

  const developerOnProjects = sidebarData?.developerOnProjects.filter(
    (proj: any) =>
      !sidebarData?.ownedProjects.some((p: any) => p.id === proj.id)
  );

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="block lg:hidden">
        <DropdownMenu.Root
          open={isMenuOpen}
          onOpenChange={() => setIsMenuOpen(isMenuOpen ? false : true)}
        >
          <DropdownMenu.Trigger asChild>
            <Bars3Icon className="h-10 w-10 text-white cursor-pointer" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="my-2 w-42 rounded-lg border border-white border-opacity-10 bg-gray-800 p-3 text-sm font-medium text-white cursor-pointer">
              <DropdownMenu.RadioGroup>
                <DropdownMenu.RadioItem value="logout">
                  <div onClick={() => void signOut({ callbackUrl: "/" })}>
                    Logout
                  </div>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="dashboard">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="newproject">
                  <Link href="/project/newProject">New project</Link>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Full sidebar for lg viewport width */}
      <div className="hidden lg:flex flex flex-col w-[250px] border-r border-sidebar-border bg-slate-800 min-h-screen">
        <Link href={"/dashboard"}>
          <Image
            priority
            src={`${publicRuntimeConfig.baseUrl}/logo.svg`}
            alt="logo"
            width={132}
            height={60}
            className="m-0 mt-6 mx-auto"
          />
        </Link>

        <div className="flex flex-col text-gray-400 mt-10 flex-1">
          <div className="flex flex-col justify-between flex-1 ml-4">
            <div>
              <div className="">
                <Link
                  href="/dashboard"
                  className={`mb-1 flex gap-2 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center ${
                    router.pathname === "/dashboard" &&
                    "text-blue-400 border-r border-width-4 border-blue-400"
                  }`}
                >
                  <Squares2X2Icon className="h-7 w-7" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </div>
              <div className="flex gap-2 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center">
                <PencilSquareIcon className="h-7 w-7" />
                <Link href="/project/newProject">New Project</Link>
              </div>
              <div className="mt-5 mb-2 text-hsb uppercase">
                My work (
                {isSidebarLoading
                  ? "loading..."
                  : sidebarData?.assignedBugs?.length}
                )
              </div>
              <div className="">
                {isSidebarLoading ? (
                  <div>Loading...</div>
                ) : sidebarData?.assignedBugs.length === 0 ? (
                  <div>You don&apos;t have any bugs assigned to you.</div>
                ) : (
                  sidebarData?.assignedBugs
                    ?.sort(
                      (a: any, b: any) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((bug: any) => (
                      <Link
                        key={bug.id}
                        href={`/bug/${bug.id}`}
                        className={`flex gap-1 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center ${
                          router.query.id === bug.id &&
                          "text-blue-400 border-r border-width-4 border-blue-400"
                        }`}
                      >
                        <BugAntIcon className="h-5 w-5" />
                        <div>{bug.title}</div>
                      </Link>
                    ))
                )}
              </div>

              <div className="mt-5 mb-2 text-hsb uppercase">
                My projects (
                {isSidebarLoading
                  ? "loading..."
                  : sidebarData?.ownedProjects?.length}
                )
              </div>
              <div>
                {isSidebarLoading ? (
                  <div>Loading...</div>
                ) : sidebarData?.ownedProjects.length === 0 ? (
                  <div>You don&apos;t have any projects yet.</div>
                ) : (
                  sidebarData?.ownedProjects
                    ?.sort(
                      (a: any, b: any) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((proj: any) => (
                      <Link
                        key={proj.id}
                        href={`/project/${proj.id}`}
                        className={`flex gap-1 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center ${
                          router.query.id === proj.id &&
                          "text-blue-400 border-r border-width-4 border-blue-400"
                        }`}
                      >
                        <FolderOpenIcon className="h-5 w-5" />
                        <div>{proj.name}</div>
                      </Link>
                    ))
                )}
              </div>
              <div className="mt-5 mb-2 text-hsb uppercase">
                Assigned projects (
                {isSidebarLoading
                  ? "loading..."
                  : sidebarData?.developerOnProjects.filter(
                      (proj: any) =>
                        !sidebarData?.ownedProjects.some(
                          (p: any) => p.id === proj.id
                        )
                    ).length}
                )
              </div>
              <div>
                {isSidebarLoading ? (
                  <div>Loading...</div>
                ) : developerOnProjects.length === 0 ? (
                  <div>You are not assigned to any projects yet.</div>
                ) : (
                  developerOnProjects
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((proj: any) => (
                      <Link
                        key={proj.id}
                        href={`/project/${proj.id}`}
                        className={`flex gap-1 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center ${
                          router.query.id === proj.id &&
                          "text-blue-400 border-r border-width-4 border-blue-400"
                        }`}
                      >
                        <FolderOpenIcon className="h-5 w-5" />
                        <div>{proj.name}</div>
                      </Link>
                    ))
                )}
              </div>
            </div>

            {/* Avatar and logout button */}
            <div className="flex-row m-0 mb-6 self-center justify-center">
              <div className="flex justify-center">
                <Link href={"/dashboard"}>
                  <Avatar title="avatar">
                    <AvatarImage src={loggedUser?.image ?? ""} />
                    <AvatarFallback>{loggedUser?.name}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
