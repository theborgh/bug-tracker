import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProjectData {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  bugs: {
    id: number;
    title: string;
    priority: string;
    status: string;
    minutesToComplete: number;
    reportingUserId: string;
  };
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

  // assign data to project details of project by id, using prisma

  const isOwner =
    sessionData && sessionData.user && sessionData?.user.id === data?.ownerId;

  return <div>Project name: {data && data.name}</div>;
}
