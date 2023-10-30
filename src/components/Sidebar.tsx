import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import NewProjectSheet from "./NewProjectSheet";
import LoginButton from "./LoginButton";
import { FetchState } from "@/utils/fetch";
import getConfig from "next/config";
import {
  BugAntIcon,
  FolderOpenIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

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
    <div className="flex flex-col w-[250px] border-r border-sidebar-border bg-slate-800 min-h-screen">
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

      <div className="flex h-full flex-col justify-between text-gray-400 mt-10">
        <div className="ml-4">
          <div className="">
            <Link
              href="/dashboard"
              className={`mb-1 flex gap-2 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center ${
                router.pathname === "/dashboard" &&
                "text-blue-400 border-r border-width-4 border-blue-400"
              }`}
            >
              <Squares2X2Icon className="h-7 w-7" />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="flex gap-2 hover:text-blue-400 hover:border-r hover:border-width-4 hover:border-blue-400 items-center">
            <PencilSquareIcon className="h-7 w-7" />
            <NewProjectSheet />
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
  );
}
