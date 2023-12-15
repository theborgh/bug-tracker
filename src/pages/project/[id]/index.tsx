import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Priorities } from "@/utils/data";
import { Priority, Status } from "@prisma/client";
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
import { sortByAllCriteria, type bugSortingType } from "@/utils/sorting";
import { BugCardData } from "@/types/appTypes";
import { FetchState } from "@/utils/fetch";
import Sidebar from "@/components/Sidebar";
import { getNameLetters } from "@/utils/data";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeleteProject from "@/components/projectDetails/DeleteProject";
import LoginErrorMessage from "@/components/LoginErrorMessage";
import { initialFilters } from "@/utils/sorting";

interface ProjectData {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    image: string;
  };
  developers: [
    {
      id: string;
      name: string;
      image: string;
    }
  ];
  bugs: BugCardData[];
}

export default function ProjectDetails() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [projectData, setProjectData] = useState<FetchState<ProjectData>>({
    data: null,
    loading: true,
    error: null,
  });
  const [statusFilters, setStasusFilters] = useState(initialFilters.status);
  const [priorityFilters, setPriorityFilters] = useState(
    initialFilters.priority
  );
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
        const res = await fetch(
          `/api/project/getProjectDetails?id=${router.query.id}`
        );

        if (res.status === 404) {
          throw new Error("Project not found");
        }

        const data = await res.json();
        setProjectData({ data, loading: false, error: null });
      } catch (error: any) {
        setProjectData({ data: null, loading: false, error });
      }
    };

    if (router.query.id) fetchData();
  }, [router.query.id]);

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
            assignedToUserId:
              newStatus === Status.UNASSIGNED ? "" : bug.assignedToUserId,
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

  const changeBugPriority = (bugId: string, newPriority: Priority) => {
    setProjectData((prev) => {
      if (!prev.data) return { data: null, loading: true, error: null };

      const newBugs = prev.data.bugs.map((bug) => {
        if (bug.id === bugId) {
          return {
            ...bug,
            priority: newPriority,
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

  const changeBugAssignee = (bugId: string, assignedToId: string | null) => {
    setProjectData((prev) => {
      if (!prev.data) return prev;

      const newBugs = prev.data.bugs.map((bug) => {
        if (bug.id === bugId) {
          return {
            ...bug,
            status: assignedToId ? Status.TODO : Status.UNASSIGNED,
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

  if (!sessionData) {
    return <LoginErrorMessage />;
  }

  return (
    <main className="flex-row lg:flex bg-gray-900 min-h-screen">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-1 m-5">
        <div className="flex">
          <div className="flex-1 flex-wrap title-and-bugs-container mr-3">
            {/* Card with title, sort dropdown and report new bug button */}
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

            {/* Bugs container */}
            <div className="bug-container">
              {projectData.loading ? (
                <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
              ) : projectData.error ? (
                <p className="text-white text-center">
                  Error: {projectData.error.message}
                </p>
              ) : (filteredBugs?.length ?? 0) > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {filteredBugs?.map((bug) => (
                    <BugCard
                      id={bug.id}
                      reporterId={bug.reportingUser.id}
                      projectOwnerId={projectData.data?.ownerId || ""}
                      projectDevelopers={projectData.data?.developers || []}
                      title={bug.title}
                      description={bug.markdown}
                      author={bug.reportingUser.name ?? "anonymous"}
                      assignedToDev={
                        bug.assignedToUserId
                          ? sessionData?.user.id === projectData.data?.ownerId
                            ? projectData.data?.developers.find(
                                (dev) => dev.id === bug.assignedToUserId
                              )
                            : projectData.data?.developers.find(
                                (dev) => dev.id === sessionData?.user.id
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
                      canEditPriority={
                        sessionData?.user.id === projectData.data?.ownerId ||
                        sessionData?.user.id === bug.reportingUser.id
                      }
                      status={bug.status}
                      handleBugStatusChange={changeBugStatus}
                      handleBugPriorityChange={changeBugPriority}
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

          {/* Right sidebar container */}
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

            <SidebarCard title="Team" className="space-y-2 text-white">
              <h1 className="font-bold">Project owner</h1>
              <div className="flex gap-2 items-center">
                <Avatar title={projectData.data?.owner.name}>
                  <AvatarImage src={projectData.data?.owner.image ?? ""} />
                  <AvatarFallback>
                    {getNameLetters(projectData.data?.owner.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                {projectData.data?.owner.name}
              </div>

              {!projectData.data?.developers.length ? (
                <li className="text-justify text-bodys leading-5 text-white text-opacity-75">
                  No developers are currently assigned to this project. To add a
                  developer, click the &quot;Add Developer&quot; icon.
                </li>
              ) : (
                <h1 className="font-bold">Developers</h1>
              )}

              {projectData.data?.developers.map((developer) => (
                <li
                  key={developer.id}
                  className="flex justify-between text-bodym"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar title={developer.name}>
                      <AvatarImage src={developer?.image ?? ""} />
                      <AvatarFallback>
                        {getNameLetters(developer.name ?? "")}
                      </AvatarFallback>
                    </Avatar>

                    <span className="">{developer.name}</span>
                  </div>
                </li>
              ))}
            </SidebarCard>

            {sessionData?.user?.id === projectData?.data?.ownerId && (
              <SidebarCard title="Project owner panel" className="text-white">
                <ul className="space-y-3">
                  <li className="flex gap-2 items-center">
                    <TrashIcon className="h-5 w-5" />
                    <DeleteProject
                      projectId={projectData.data?.id || ""}
                      projectTitle={projectData.data?.name || ""}
                    >
                      <span className="hover:opacity-50">Delete project</span>
                    </DeleteProject>
                  </li>
                </ul>
              </SidebarCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
