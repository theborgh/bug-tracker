import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Priorities } from "@/utils/data";
import { Status } from "@prisma/client";
import EmptyState from "@/components/projectDetails/EmptyState";
import { BugCard } from "@/components/BugCard";
import SidebarCard from "@/components/SidebarCard";
import StatusButton, { selectedStatusType } from "@/components/StatusButton";
import PriorityButton, {
  selectedPriorityType,
} from "@/components/priorityButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import SortDropdown from "@/components/projectDetails/SortDropdown";
import { sortByAllCriteria, type bugSortingType } from "@/utils/sorting";
import Sidebar from "@/components/Sidebar";

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
      reportingUser: {
        name: string;
      };
      assignedToUserId: string;
      commentCount: {
        comments: number;
      };
      createdAt: Date;
      updatedAt: string;
    }
  ];
}

export default function ProjectDetails() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ProjectData | null>(null);
  const [statusFilters, setStasusFilters] = useState({
    CLOSED: false,
    INPROGRESS: true,
    TESTING: true,
    TODO: true,
    UNASSIGNED: true,
  });
  const [priorityFilters, setPriorityFilters] = useState({
    CRITICAL: true,
    HIGH: true,
    MEDIUM: true,
    LOW: true,
  });
  const [sortBy, setSortBy] = useState<bugSortingType>("recent");
  const filteredBugs = data?.bugs
    .filter(
      (bug) =>
        statusFilters[bug.status] &&
        priorityFilters[bug.priority as selectedPriorityType]
    )
    .sort((a, b) => sortByAllCriteria(a, b, sortBy));

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/projectDetails?id=${router.query.id}`);
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [router.query.id]);

  const isOwner = sessionData?.user?.id === data?.ownerId;

  if (!data) return <div className="">loading...</div>;

  const handleStatusFilterClick = (
    status: selectedStatusType,
    selected: boolean
  ) => {
    setStasusFilters((prev) => ({
      ...prev,
      [status]: !selected,
    }));
  };

  const handlePriorityFilterClick = (
    priority: selectedPriorityType,
    selected: boolean
  ) => {
    setPriorityFilters((prev) => ({
      ...prev,
      [priority]: !selected,
    }));
  };

  return (
    <main className="flex">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="grid min-h-screen grid-cols-5 gap-x-8 p-11 bg-gray-900">
        <div className="col-span-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-800 px-6 py-5">
            <div className="flex items-center justify-between gap-6">
              <h1 className="text-hm text-white font-medium">{data.name}</h1>
              <SortDropdown sort={sortBy} setSort={setSortBy} />
            </div>
            <Link
              href={`./${router.query.id as string}/newBug`}
              className="rounded-md bg-blue-900 px-5 py-3 text-bodym font-medium text-white transition duration-300 hover:bg-white hover:text-blue-900"
            >
              Report New Bug
            </Link>
          </div>
          {data.bugs.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-x-5 gap-y-5">
              {filteredBugs?.map((bug) => (
                <BugCard
                  id={bug.id}
                  projectOwnerId={data.ownerId}
                  projectDevelopers={data.developers}
                  title={bug.title}
                  description={bug.markdown}
                  author={bug.reportingUser.name ?? "anonymous"}
                  assignedToDev={
                    bug.assignedToUserId
                      ? data.developers.find(
                          (dev) => dev.id === bug.assignedToUserId
                        )
                      : null
                  }
                  commentCount={bug?.commentCount?.comments}
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
            title="Status filter"
            className="flex flex-wrap gap-2 text-white"
          >
            {Object.values(Status).map((stat) => (
              <li key={stat}>
                <StatusButton
                  statusValue={stat}
                  handleClick={handleStatusFilterClick}
                  isSelected={statusFilters[stat]}
                >
                  {stat.toLowerCase()}
                </StatusButton>
              </li>
            ))}
          </SidebarCard>
          <SidebarCard title="Priority filter" className="space-y-1 text-white">
            {Priorities.map(({ value, background }) => (
              <PriorityButton
                count={data.bugs.filter((bug) => bug.priority === value).length}
                isSelected={priorityFilters[value]}
                handleClick={handlePriorityFilterClick}
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
              <li
                key={developer.id}
                className="flex justify-between text-bodym"
              >
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

            {!data.developers.length && (
              <li className="text-justify text-bodys leading-5 text-white text-opacity-75">
                No developers are currently assigned to this project. To add a
                developer, click the &quot;Add Developer&quot; icon.
              </li>
            )}
          </SidebarCard>
        </div>
      </div>
    </main>
  );
}
