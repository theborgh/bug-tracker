import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserPlusIcon, PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { Priorities } from "@/utils/data";
import { Status } from "@prisma/client";
import EmptyState from "@/components/projectDetails/EmptyState";
import BugCard from "@/components/BugCard";

interface ProjectData {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  developers: [
    {
      id: string;
      name: string;
      image: string;
    }
  ];
  bugs: [
    {
      id: string;
      title: string;
      markdown: string;
      priority: string;
      status: Status;
      minutesToComplete: number;
      reportingUserId: string;
      assignedToUserId: string;
      createdAt: Date;
      updatedAt: string;
    }
  ];
}

export default function ProjectDetails() {
  const { data: sessionData } = useSession();
  const [data, setData] = useState<ProjectData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projects?id=${router.query.id}`);
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [router.query.id]);

  const isOwner =
    sessionData && sessionData.user && sessionData?.user.id === data?.ownerId;

  if (!data) return <div className="">loading</div>;

  return (
    <main className="grid min-h-screen grid-cols-5 gap-x-8 p-11">
      <div className="col-span-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-800 px-6 py-5">
          <div className="flex items-center justify-between gap-6">
            <h1 className="text-hm font-medium">{data.name}</h1>
            {/* <SortDropdown sort={sortBy} setSort={setSortBy} /> */}
          </div>
          <Link
            href={`./${router.query.id as string}/new`}
            className="rounded-md bg-blue-900 px-5 py-3 text-bodym font-medium text-white transition duration-300 hover:bg-white hover:text-blue-900"
          >
            Report New Bug
          </Link>
        </div>
        {data.bugs.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-x-5 gap-y-5">
            {data.bugs.map((bug) => (
              <BugCard
                id={bug.id}
                title={bug.title}
                description={bug.markdown}
                author={bug.reportingUserId ?? "anonymous"}
                // assignee={bug.assignedToUserId ?? "unassigned"}
                // n_comments={bug._count.comments}
                createdAt={bug.createdAt}
                priority={
                  Priorities?.find((item) => item.value === bug.priority) ?? {
                    value: "LOW",
                    stroke: "stroke-white",
                  }
                }
                status={bug.status}
                key={bug.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
