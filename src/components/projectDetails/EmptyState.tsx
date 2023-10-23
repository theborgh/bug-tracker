import { NoResultsSVG } from "../../../public/SVG";
import Link from "next/link";
import { useRouter } from "next/router";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="mt-6 flex h-[80%] flex-col items-center justify-center rounded-2xl bg-slate-800 text-center text-white">
      <NoResultsSVG />

      <h2 className="mt-6 mb-3 text-hm font-semibold">
        No bugs here: Keep up the great work!
      </h2>
      <p className="max-w-md text-sm text-white text-opacity-70">
        No bugs match the selected filters for this project. Keep up the good
        work, and don&apos;t hesitate to adjust the filters or{" "}
        <Link href={`${router.asPath}/newBug`} className="font-bold">
          report a new bug
        </Link>
        .
      </p>
    </div>
  );
}
