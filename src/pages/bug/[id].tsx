import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { FetchState } from "@/utils/fetch";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Status, Priority } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { MentionsInput, Mention } from "react-mentions";
import { Priorities, getNameLetters } from "@/utils/data";
import StatusDropdown from "@/components/projectDetails/StatusDropdown";
import PriorityDropdown from "@/components/projectDetails/PriorityDropdown";
import AssignBugToDev from "@/components/projectDetails/AssignBugToDev";
import Link from "next/link";
import styles from "./styles";
import { format, formatDistance } from "date-fns";
import {
  UserPlusIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

interface Comment {
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  id: string;
  bugId: string;
  markdown: string;
  createdAt: string;
  updatedAt: string;
}

interface BugData {
  id: string;
  title: string;
  markdown: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  priority: Priority;
  projectId: string;
  project: {
    name: string;
    id: string;
    ownerId: string;
    developers: {
      id: string;
      name: string;
      image: string;
    }[];
  };
  assignedTo: {
    id: string;
    name: string;
    image: string;
  };
  reportingUser: {
    id: string;
    name: string;
    image: string;
  };
  comments: Comment[];
}

const BugPage: NextPage = () => {
  const [bugData, setBugData] = useState<FetchState<BugData>>({
    data: null,
    loading: true,
    error: null,
  });
  const [canEditPriority, setCanEditPriority] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const {
    query: { id },
    push,
  } = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData?.user?.id) {
      setCanEditPriority(
        sessionData?.user?.id === bugData.data?.reportingUser?.id ||
          sessionData?.user?.id === bugData.data?.project?.ownerId
      );
    }
  }, [
    sessionData?.user?.id,
    bugData.data?.reportingUser?.id,
    bugData.data?.project?.ownerId,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/bug/${id}`);

        if (res.status === 404) {
          throw new Error("Bug not found");
        }

        const data = await res.json();
        setBugData({ data, loading: false, error: null });
      } catch (error: any) {
        setBugData({ data: null, loading: false, error });
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/comment/postComment`, {
        method: "POST",
        body: JSON.stringify({ id, markdown, authorId: sessionData?.user?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      } else {
        setBugData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            comments: [
              ...prev.data.comments,
              {
                ...data,
                author: {
                  id: sessionData?.user?.id,
                  name: sessionData?.user?.name,
                  image: sessionData?.user?.image,
                },
              } as Comment,
            ],
          },
        }));
        setMarkdown("");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleBugStatusChange = (bugId: string, newStatus: Status) => {
    setBugData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        status: newStatus,
      },
    }));
  };

  const handleBugPriorityChange = (bugId: string, newPriority: Priority) => {
    setBugData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        priority: newPriority,
      },
    }));
  };

  const handleBugAssignment = (bugId: string, assignedToId: string | null) => {
    setBugData((prev) => {
      if (!prev.data) return { data: null, loading: true, error: null };

      return {
        ...prev,
        data: {
          ...prev.data,
          assignedTo: {
            id: assignedToId,
            name: prev.data.project.developers.find(
              (dev) => dev.id === assignedToId
            )?.name,
            image: prev.data.project.developers.find(
              (dev) => dev.id === assignedToId
            )?.image,
          },
          status: assignedToId ? prev.data.status : Status.UNASSIGNED,
        },
      };
    });
  };

  return (
    <main className="flex">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-1 min-h-screen flex-col items-center bg-gray-900 text-white w-full p-8">
        <h1 className="text-4xl mt-5 text-center">
          {bugData.loading ? (
            <div>loading...</div>
          ) : bugData.error ? (
            <div>Error</div>
          ) : (
            <div>
              <div>Bug: {bugData.data?.title}</div>
              <span className="text-2xl">
                <Link
                  title="Go to project page"
                  className="hover:opacity-50 opacity-70"
                  href={`/project/${bugData.data?.projectId}`}
                >
                  {bugData.data?.project?.name}
                </Link>{" "}
                project
              </span>
              <span className="text-lg flex items-center justify-center gap-2">
                Created{" "}
                <span
                  className="hover:opacity-50 opacity-70 cursor-pointer"
                  title={`${format(
                    new Date(
                      bugData.data?.createdAt &&
                      !isNaN(Date.parse(bugData.data?.createdAt))
                        ? new Date(bugData.data?.createdAt)
                        : new Date()
                    ),
                    "cccc do 'of' MMMM yyyy 'at' HH:mm:ss"
                  )}`}
                >
                  {formatDistance(
                    new Date(
                      bugData.data?.createdAt &&
                      !isNaN(Date.parse(bugData.data?.createdAt))
                        ? new Date(bugData.data?.createdAt)
                        : new Date()
                    ),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>{" "}
                by {bugData.data?.reportingUser?.name ?? "anonymous"} &middot;{" "}
                {canEditPriority ? (
                  <PriorityDropdown
                    bugId={bugData.data?.id ?? ""}
                    priority={bugData.data?.priority ?? Priority.MEDIUM}
                    projectOwnerId={bugData.data?.project?.ownerId ?? ""}
                    reporterId={bugData.data?.reportingUser?.id ?? ""}
                    handleBugPriorityChange={handleBugPriorityChange}
                  >
                    <ShieldExclamationIcon
                      title={`${bugData.data?.priority.toLocaleLowerCase()} priority`}
                      className={`h-8 w-8 hover:cursor-pointer`}
                      stroke={
                        Priorities.find(
                          (p) => p.value === bugData.data?.priority
                        )?.stroke ?? Priorities[0].stroke
                      }
                    />
                  </PriorityDropdown>
                ) : (
                  <ShieldExclamationIcon
                    title={`${bugData.data?.priority?.toLocaleLowerCase()} priority (only project owner and reporter can edit priority)`}
                    className={`h-8 w-8`}
                    stroke={
                      Priorities.find((p) => p.value === bugData.data?.priority)
                        ?.stroke ?? Priorities[0].stroke
                    }
                  />
                )}
                {bugData.data?.priority?.toLocaleLowerCase()} priority &middot;{" "}
                {bugData.data?.assignedTo?.id ? (
                  <span>
                    assigned to{" "}
                    <AssignBugToDev
                      bugTitle={bugData.data.title}
                      bugId={bugData.data.id}
                      projectDevelopers={bugData.data.project.developers ?? []}
                      handleBugAssignment={handleBugAssignment}
                    >
                      <Avatar
                        title={bugData.data.assignedTo.name ?? "anonymous"}
                      >
                        <AvatarImage
                          src={bugData.data.assignedTo.image ?? ""}
                        />
                        <AvatarFallback>
                          {getNameLetters(bugData.data.assignedTo.name ?? "")}
                        </AvatarFallback>
                      </Avatar>
                    </AssignBugToDev>
                  </span>
                ) : (
                  <span className="flex items-center gap-2" title="Assign bug">
                    <span className="items-center">unassigned</span>{" "}
                    <span className="items-center">
                      <AssignBugToDev
                        bugTitle={bugData.data?.title ?? ""}
                        bugId={bugData.data?.id ?? ""}
                        projectDevelopers={
                          bugData.data?.project?.developers ?? []
                        }
                        handleBugAssignment={handleBugAssignment}
                      >
                        <UserPlusIcon className="h-8 w-8" />
                      </AssignBugToDev>
                    </span>
                  </span>
                )}
              </span>
              <div className="text-center">
                <StatusDropdown
                  bugId={bugData.data?.id ?? ""}
                  status={bugData.data?.status ?? Status.TODO}
                  assigneeId={bugData.data?.assignedTo?.id ?? ""}
                  projectOwnerId={bugData.data?.project?.ownerId ?? ""}
                  handleBugStatusChange={handleBugStatusChange}
                />
              </div>
            </div>
          )}
        </h1>

        <h2 className="text-2xl my-2">Bug description</h2>
        <div className="bg-gray-800 w-full p-3">
          {bugData.loading ? (
            <div>loading...</div>
          ) : bugData.error ? (
            <div>error</div>
          ) : (
            bugData.data?.markdown
          )}
        </div>

        <h2 className="text-2xl mt-2">
          Comments ({bugData.data?.comments?.length})
        </h2>

        <div className="ml-3">
          {bugData.loading ? (
            <div>loading...</div>
          ) : bugData.error ? (
            <div>error</div>
          ) : (
            bugData.data?.comments?.map((comment) => (
              <div key={comment.id} className="bg-gray-800 w-full p-3 mt-3">
                <div className="text-gray-400 text-sm">
                  from {comment.author.name},{" "}
                  <span
                    className="hover:opacity-50 opacity-70 cursor-pointer"
                    title={`${format(
                      new Date(
                        bugData.data?.createdAt &&
                        !isNaN(Date.parse(bugData.data?.createdAt))
                          ? new Date(bugData.data?.createdAt)
                          : new Date()
                      ),
                      "cccc do 'of' MMMM yyyy 'at' HH:mm:ss"
                    )}`}
                  >
                    {formatDistance(new Date(comment.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex gap-4 mt-2">
                  <Avatar title={comment.author.name ?? "anonymous"}>
                    <AvatarImage src={comment.author.image ?? ""} />
                    <AvatarFallback>
                      {getNameLetters(comment.author.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>{comment.markdown}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <h2 className="text-2xl mt-2">Add a comment</h2>

        <div className="ml-3">
          <form onSubmit={handleSubmit} className="flex-col">
            <MentionsInput
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="bg-slate-800 rounded-sm p-3 border-solid border border-[#252945] focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-base mt-5 w-full mb-2"
              placeholder="Add a comment (type @ to mention another developer on the project)"
              style={styles}
            >
              <Mention
                trigger="@"
                data={
                  bugData.data?.project?.developers.map((dev) => ({
                    id: dev.id,
                    display: dev.name,
                  })) || []
                }
                displayTransform={(id, display) => `@${display}`}
                className="hidden"
                appendSpaceOnAdd={true}
                markup="@[__display__]"
              />
            </MentionsInput>

            <button type="submit" className="btn-blue hover:bg-opacity-75">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BugPage;
