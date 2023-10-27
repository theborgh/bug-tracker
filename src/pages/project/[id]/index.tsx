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
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import SortDropdown from "@/components/projectDetails/SortDropdown";
import {
  sortByAllCriteria,
  type bugSortingType,
  type Bug,
} from "@/utils/sorting";
import { FetchState } from "@/utils/fetch";
import Sidebar from "@/components/Sidebar";
import { getNameLetters } from "@/utils/data";

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
  bugs: Bug[];
}

export default function ProjectDetails() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [projectData, setProjectData] = useState<FetchState<ProjectData>>({
    data: null,
    loading: true,
    error: null,
  });
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
  const filteredBugs = projectData.data?.bugs
    .filter(
      (bug) =>
        statusFilters[bug.status] &&
        priorityFilters[bug.priority as selectedPriorityType]
    )
    .sort((a, b) => sortByAllCriteria(a, b, sortBy));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projectDetails?id=${router.query.id}`);
        const data = await res.json();
        setProjectData({ data, loading: false, error: null });
      } catch (error: any) {
        setProjectData({ data: null, loading: false, error });
      }
    };

    if (router.query.id) fetchData();
  }, [router.query.id]);

  const isOwner = sessionData?.user?.id === projectData?.data?.ownerId;

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

  const changeBugStatus = (bugId: string, newStatus: Status) => {
    setProjectData((prev) => {
      if (!prev.data) return { data: null, loading: true, error: null };

      const newBugs = prev.data.bugs.map((bug) => {
        if (bug.id === bugId) {
          return {
            ...bug,
            status: newStatus,
          };
        }
        return bug;
      });

      return {
        ...prev,
        data: {
          ...prev.data,
          bugs: [...newBugs],
        },
      };
    });
  };

  const changeBugAssignee = (bugId: string, assignedToId: string) => {
    setProjectData((prev) => {
      if (!prev.data) return { data: null, loading: true, error: null };

      const newBugs = prev.data.bugs.map((bug) => {
        if (bug.id === bugId) {
          return {
            ...bug,
            status: Status.TODO,
            assignedToUserId: assignedToId,
          };
        }
        return bug;
      });

      return {
        ...prev,
        data: {
          ...prev.data,
          bugs: [...newBugs],
        },
      };
    });
  };

  return (
    <main className="flex bg-gray-900">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-1 m-5">
        <div className="flex">
          <div className="flex-1 flex-wrap title-and-bugs-container mr-3">
            <div className="flex w-full grow-0 items-center justify-between rounded-xl bg-slate-800 px-6 py-5 bug-title-container">
              <div className="flex items-center justify-between gap-6">
                <h1 className="text-hm text-white font-medium">
                  {projectData?.data?.name}
                </h1>
                <SortDropdown sort={sortBy} setSort={setSortBy} />
              </div>
              <Link
                href={`./${router.query.id as string}/newBug`}
                className="rounded-md bg-blue-900 px-5 py-3 text-bodym font-medium text-white transition duration-300 hover:bg-white hover:text-blue-900"
              >
                Report New Bug
              </Link>
            </div>

            <div className="bug-container">
              {projectData.loading ? (
                <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
              ) : projectData.error ? (
                <p>Error: {projectData.error.message}</p>
              ) : (projectData.data?.bugs?.length ?? 0) > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {filteredBugs?.map((bug) => (
                    <BugCard
                      id={bug.id}
                      projectOwnerId={projectData.data?.ownerId || ""}
                      projectDevelopers={projectData.data?.developers || []}
                      title={bug.title}
                      description={bug.markdown}
                      author={bug.reportingUser.name ?? "anonymous"}
                      assignedToDev={
                        bug.assignedToUserId
                          ? projectData.data?.developers.find(
                              (dev) => dev.id === bug.assignedToUserId
                            )
                          : null
                      }
                      commentCount={bug?._count.comments ?? 0}
                      createdAt={bug.createdAt}
                      priority={
                        Priorities?.find(
                          (item) => item.value === bug.priority
                        ) ?? {
                          value: "LOW",
                          stroke: "stroke-white",
                        }
                      }
                      status={bug.status}
                      handleBugStatusChange={changeBugStatus}
                      handleBugAssignment={changeBugAssignee}
                      key={bug.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
          <div className="sidecards-container flex-col w-[250px]">
            <SidebarCard
              title="Status filter"
              className="flex flex-wrap gap-1 text-white"
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
            <SidebarCard
              title="Priority filter"
              className="space-y-1 text-white"
            >
              {Priorities.map(({ value, background }) => (
                <PriorityButton
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
              topRight={isOwner && <div>TODO: Project owner panel</div>}
            >
              {projectData.data?.developers.map((developer) => (
                <li
                  key={developer.id}
                  className="flex justify-between text-bodym"
                >
                  <div className="flex">
                    <Avatar className="mr-4 h-6 w-6">
                      <AvatarImage src={developer?.image ?? ""} />
                      <AvatarFallback>
                        {getNameLetters(developer.name ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    {developer.name}
                  </div>
                </li>
              ))}

              {!projectData.data?.developers.length && (
                <li className="text-justify text-bodys leading-5 text-white text-opacity-75">
                  No developers are currently assigned to this project. To add a
                  developer, click the &quot;Add Developer&quot; icon.
                </li>
              )}
            </SidebarCard>
          </div>
        </div>
      </div>
    </main>
  );
}
