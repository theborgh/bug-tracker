import formatDistance from "date-fns/formatDistance";

type ProjectCardProps = {
  id: string;
  name: string;
  updatedAt: string;
};

export default function ProjectCard({ id, name, updatedAt }: ProjectCardProps) {
  return (
    <div className="flex justify-between rounded-md bg-gray-800 py-3 px-4 w-64">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-hs text-white font-medium line-clamp-1">
            {name}
          </h3>
        </div>
        <p className="mb-2 mt-0.5 text-xs font-light text-white text-opacity-75">
          last updated{" "}
          {formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
