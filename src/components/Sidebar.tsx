import React from "react";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import Link from "next/link";
import { Command as CommandPrimitive } from "cmdk";
import { CommandInput, CommandList } from "@/components/ui/Command";
import NewProjectSheet from "./NewProjectSheet";

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
  const isLoading = false;
  const isError = false;

  if (isLoading) return <div className="">loading</div>;
  if (isError) return <div className="">error</div>;

  return (
    <div className="flex w-[60rem] flex-col border-r border-sidebar-border bg-slate-800">
      <Image
        priority
        src="../logo.svg"
        alt="logo"
        width={132}
        height={60}
        className="m-0 mt-6 self-center"
      />

      <div>
        <CommandPrimitive>
          <CommandInput placeholder="Quick Search..." />
          <CommandList></CommandList>
        </CommandPrimitive>
      </div>

      <div className="flex h-full flex-col justify-between text-gray-400">
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
          <div className="mt-5 text-hsb uppercase">My work (#bugs)</div>
          <div>{!isLoading && !isError && "mybugs"}</div>
          <div className="mt-5 text-hsb uppercase">My projects (#projects)</div>
          <div>{!isLoading && !isError && "projectList"}</div>
        </div>
        <div className="m-0 mb-6 self-center">
          <Link href={"/dashboard"}>
            <Avatar title="avatar">
              <AvatarImage src={loggedUser?.image ?? ""} />
              <AvatarFallback>{loggedUser?.name}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}
