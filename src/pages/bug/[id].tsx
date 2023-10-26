import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { FetchState } from "@/utils/fetch";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Status, Priority } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { getNameLetters } from "@/utils/data";
import StatusDropdown from "@/components/projectDetails/StatusDropdown";
import formatDistance from "date-fns/formatDistance";
import Link from "next/link";

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
  const [markdown, setMarkdown] = useState("");
  const {
    query: { id },
    push,
  } = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/bug/${id}`);
        const data = await res.json();
        setBugData({ data, loading: false, error: null });
      } catch (error: any) {
        setBugData({ data: null, loading: false, error: error });
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/comments`, {
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

  return (
    <main className="flex">
      <Sidebar loggedUser={sessionData?.user} />
      <div className="flex-1 min-h-screen flex-col items-center bg-gray-900 text-white w-full p-8">
        <h1 className="text-4xl mt-5 text-center">
          {bugData.loading ? (
            <div>loading...</div>
          ) : bugData.error ? (
            <div>error</div>
          ) : (
            <div>
              <div>Bug: {bugData.data?.title}</div>
              <Link
                className="text-2xl"
                href={`/project/${bugData.data?.projectId}`}
              >
                {bugData.data?.project?.name} project
              </Link>
              <div className="text-lg">
                created{" "}
                {formatDistance(
                  new Date(bugData.data?.createdAt || ""),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}{" "}
                by {bugData.data?.reportingUser?.name ?? "anonymous"},{" "}
                {bugData.data?.assignedTo?.id ? (
                  <div>
                    assigned to {bugData.data?.assignedTo?.name ?? "anonymous"}
                  </div>
                ) : (
                  "unassigned"
                )}
              </div>
            </div>
          )}
        </h1>

        <div className="text-center mt-2">
          <StatusDropdown
            bugId={bugData.data?.id ?? ""}
            status={bugData.data?.status ?? Status.TODO}
            assigneeId={bugData.data?.assignedTo?.id ?? ""}
            projectOwnerId={bugData.data?.project?.ownerId ?? ""}
            handleBugStatusChange={handleBugStatusChange}
          />
        </div>

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

        <h2 className="text-2xl mt-2">Comments</h2>

        {bugData.loading ? (
          <div>loading...</div>
        ) : bugData.error ? (
          <div>error</div>
        ) : (
          bugData.data?.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 w-full p-3 mt-3 ml-3">
              <div className="text-gray-400 text-sm">
                from {comment.author.name},{" "}
                {formatDistance(new Date(comment.createdAt), new Date(), {
                  addSuffix: true,
                })}
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

        <h2 className="text-2xl mt-2">Add a comment</h2>

        <form onSubmit={handleSubmit} className="flex-col">
          <textarea
            id="markdown"
            className="bg-slate-800 font-bold rounded-sm p-3 border-solid border border-[#252945] focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-base mt-5 w-full"
            rows={3}
            placeholder="Add a comment..."
            minLength={1}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          ></textarea>
          <button type="submit" className="btn-blue">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default BugPage;
