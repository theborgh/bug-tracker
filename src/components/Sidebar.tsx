import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import NewProjectSheet from "./NewProjectSheet";
import LoginButton from "./LoginButton";
import { FetchState } from "@/utils/fetch";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sidebar?id=${loggedUser?.id}`);
        const data = await res.json();
        setSidebarData({ data: data, loading: false, error: null });
      } catch (error: any) {
        setSidebarData({ data: null, loading: false, error: error });
      }
    };

    if (loggedUser?.id) fetchData();
  }, [loggedUser?.id]);

  return (
    <div className="flex flex-col border-r border-sidebar-border bg-slate-800">
      <Link href={"/dashboard"}>
        <Image
          priority
          src="../logo.svg"
          alt="logo"
          width={132}
          height={60}
          className="m-0 mt-6 mx-auto"
        />
      </Link>

      <div className="flex h-full flex-col justify-between text-gray-400 mt-5">
        <div className="ml-4">
          <div className="">
            <Link href="/dashboard" className="mb-2 flex gap-2">
              <Squares2X2Icon className="h-6 w-6" />
              Dashboard
            </Link>
          </div>
          <div className="">
            <NewProjectSheet />
          </div>
          <div className="mt-5 text-hsb uppercase">
            My work (
            {sidebarData.loading
              ? "loading..."
              : sidebarData.error
              ? "error"
              : sidebarData.data?.assignedBugs?.length}
            )
          </div>
          <div>
            {sidebarData.loading ? (
              <div>Loading...</div>
            ) : sidebarData.error ? (
              <div>Error: {sidebarData.error.message}</div>
            ) : (
              sidebarData.data?.assignedBugs?.map((bug: any) => (
                <Link key={bug.id} href={`/bug/${bug.id}`}>
                  <div>{bug.title}</div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-5 text-hsb uppercase">
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
              sidebarData.data?.ownedProjects?.map((proj: any) => (
                <Link key={proj.id} href={`/project/${proj.id}`}>
                  <div>{proj.name}</div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-5 text-hsb uppercase">
            Assigned projects (
            {sidebarData.loading
              ? "loading..."
              : sidebarData.error
              ? "error"
              : sidebarData.data?.developerOnProjects?.length}
            )
          </div>
          <div>
            {sidebarData.loading ? (
              <div>Loading...</div>
            ) : sidebarData.error ? (
              <div>Error: {sidebarData.error.message}</div>
            ) : (
              sidebarData.data?.developerOnProjects?.map((proj: any) => (
                <Link key={proj.id} href={`/project/${proj.id}`}>
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
