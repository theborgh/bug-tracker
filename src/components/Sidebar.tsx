import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import LoginButton from "./LoginButton";
import { FetchState } from "@/utils/fetch";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState<FetchState<any>>({
    data: null,
    loading: true,
    error: null,
  });
  const { publicRuntimeConfig } = getConfig();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/user/getSidebarData?id=${loggedUser?.id}`
        );
        const data = await res.json();
        setSidebarData({ data: data, loading: false, error: null });
      } catch (error: any) {
        setSidebarData({ data: null, loading: false, error: error });
      }
    };

    if (loggedUser?.id) fetchData();
  }, [loggedUser?.id]);

  return (
    <>
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
                {sidebarData.loading
                  ? "loading..."
                  : sidebarData.error
                  ? "error"
                  : sidebarData.data?.assignedBugs?.length}
                )
              </div>
              <div className="">
                {sidebarData.loading ? (
                  <div>Loading...</div>
                ) : sidebarData.error ? (
                  <div>Error: {sidebarData.error.message}</div>
                ) : (
                  sidebarData.data?.assignedBugs
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
                {sidebarData.loading
                  ? "loading..."
                  : sidebarData.error
                  ? "error"
                  : sidebarData.data?.ownedProjects?.length}
                )
              </div>
              <div>
                {sidebarData.loading ? (
                  <div>Loading...</div>
                ) : sidebarData.error ? (
                  <div>Error: {sidebarData.error.message}</div>
                ) : (
                  sidebarData.data?.ownedProjects
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
                {sidebarData.loading
                  ? "loading..."
                  : sidebarData.error
                  ? "error"
                  : sidebarData.data?.developerOnProjects.filter(
                      (proj: any) =>
                        !sidebarData.data?.ownedProjects.some(
                          (p: any) => p.id === proj.id
                        )
                    ).length}
                )
              </div>
              <div>
                {sidebarData.loading ? (
                  <div>Loading...</div>
                ) : sidebarData.error ? (
                  <div>Error: {sidebarData.error.message}</div>
                ) : (
                  sidebarData.data?.developerOnProjects
                    .filter(
                      (proj: any) =>
                        !sidebarData.data?.ownedProjects.some(
                          (p: any) => p.id === proj.id
                        )
                    )
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
