import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Priorities } from "@/utils/data";
import { Status } from "@prisma/client";
import EmptyState from "@/components/projectDetails/EmptyState";
import BugCard from "@/components/BugCard";
import SidebarCard from "@/components/SidebarCard";
import StatusButton, { selectedStatusType } from "@/components/StatusButton";
import PriorityButton, {
  selectedPrioritiesType,
} from "@/components/priorityButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import SortDropdown from "@/components/projectDetails/SortDropdown";
import type { bugSortingType } from "@/utils/sorting";

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
  const router = useRouter();
  const [data, setData] = useState<ProjectData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<selectedStatusType>([
    "CLOSED",
    "INPROGRESS",
    "TESTING",
    "TODO",
    "UNASSIGNED",
  ]);
  const [selectedPriorities, setSelectedPriorities] =
    useState<selectedPrioritiesType>(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);

  const [sortBy, setSortBy] = useState<bugSortingType>("recent");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projects?id=${router.query.id}`);
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [router.query.id]);

  const isOwner = sessionData?.user?.id === data?.ownerId;

  if (!data) return <div className="">loading...</div>;

  return (
    <main className="grid min-h-screen grid-cols-5 gap-x-8 p-11">
      <div className="col-span-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-800 px-6 py-5">
          <div className="flex items-center justify-between gap-6">
            <h1 className="text-hm text-white font-medium">{data.name}</h1>
            <SortDropdown sort={sortBy} setSort={setSortBy} />
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
      <div className="">
        <SidebarCard
          title="Bug Status"
          className="flex flex-wrap gap-2 text-white"
        >
          {Object.values(Status).map((item) => (
            <li key={item}>
              <StatusButton
                statusValue={item}
                setSelectedStatus={setSelectedStatus}
                isSelected={selectedStatus.includes(item)}
              >
                {item.toLowerCase()}
              </StatusButton>
            </li>
          ))}
        </SidebarCard>
        <SidebarCard title="Bug Priority" className="space-y-1 text-white">
          {Priorities.map(({ value, background }) => (
            <PriorityButton
              count={data.bugs.filter((bug) => bug.priority === value).length}
              isSelected={selectedPriorities.includes(value)}
              setSelectedPriorities={setSelectedPriorities}
              value={value}
              color={background}
              key={value}
            />
          ))}
        </SidebarCard>
        <SidebarCard
          title="Developers"
          className="space-y-3 text-white"
          // TODO
          topRight={isOwner && <div>TODO: Project owner panel</div>}
        >
          {data.developers.map((developer) => (
            <li key={developer.id} className="flex justify-between text-bodym">
              <div className="flex">
                <Avatar className="mr-4 h-6 w-6">
                  <AvatarImage src={developer?.image ?? ""} />
                  <AvatarFallback>
                    {/* TODO */}
                    <div>TODO: DEV INITIALS</div>
                  </AvatarFallback>
                </Avatar>
                {developer.name}
              </div>
              {isOwner && <div>TODO: Assign bugs to dev</div>}
            </li>
          ))}
          {data.developers.length === 0 && (
            <li className="text-justify text-bodys leading-5 text-white text-opacity-75">
              No developers are currently assigned to this project. To add a
              developer, please click the &quot;Add Developer&quot; icon.
            </li>
          )}
        </SidebarCard>
      </div>
    </main>
  );
}
