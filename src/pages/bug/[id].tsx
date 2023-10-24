import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { FetchState } from "@/utils/fetch";
import { useRouter } from "next/router";
import type { Bug } from "@prisma/client";

const BugPage: NextPage = () => {
  const [bugData, setBugData] = useState<FetchState<Bug>>({
    data: null,
    loading: true,
    error: null,
  });
  const {
    query: { id },
    push,
  } = useRouter();

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
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white">
      <h1 className="mb-8 text-4xl">
        {bugData.loading ? (
          <div>loading...</div>
        ) : bugData.error ? (
          <div>error</div>
        ) : (
          bugData.data?.title
        )}
      </h1>

      <div className="bg-gray-800 w-3/4 p-3">
        {" "}
        {bugData.loading ? (
          <div>loading...</div>
        ) : bugData.error ? (
          <div>error</div>
        ) : (
          bugData.data?.markdown
        )}
      </div>

      {bugData.loading ? (
        <div>loading...</div>
      ) : bugData.error ? (
        <div>error</div>
      ) : (
        "Comments"
      )}
    </main>
  );
};

export default BugPage;
