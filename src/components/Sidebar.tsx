import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import NewProjectSheet from "./NewProjectSheet";
import LoginButton from "./LoginButton";

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
  const [sidebarData, setSidebarData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/sidebar?id=${loggedUser?.id}`);
      const data = await res.json();
      setSidebarData(data);
    };

    if (loggedUser?.id) fetchData();
  }, [loggedUser?.id]);

  const isLoading = false;
  const isError = false;

  if (isLoading) return <div className="">loading</div>;
  if (isError) return <div className="">error</div>;

  return (
    <div className="flex w-[600px] flex-col border-r border-sidebar-border bg-slate-800">
      <Link href={"/"}>
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
            My work ({sidebarData?.assignedBugs?.length})
          </div>
          <div>
            {!isLoading &&
              !isError &&
              sidebarData?.assignedBugs?.map((bug: any) => (
                <Link key={bug.id} href={`/project/${bug.id}`}>
                  <div>{bug.name}</div>
                </Link>
              ))}
          </div>
          <div className="mt-5 text-hsb uppercase">
            My projects ({sidebarData?.ownedProjects?.length})
          </div>
          <div>
            {!isLoading &&
              !isError &&
              sidebarData?.ownedProjects?.map((proj: any) => (
                <Link key={proj.id} href={`/project/${proj.id}`}>
                  <div>{proj.name}</div>
                </Link>
              ))}
          </div>
          <div className="mt-5 text-hsb uppercase">
            Assigned projects ({sidebarData?.developerOnProjects?.length})
          </div>
          <div>
            {!isLoading &&
              !isError &&
              sidebarData?.developerOnProjects?.map((proj: any) => (
                <Link key={proj.id} href={`/project/${proj.id}`}>
                  <div>{proj.name}</div>
                </Link>
              ))}
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
