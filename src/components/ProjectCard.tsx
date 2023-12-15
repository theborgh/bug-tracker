import formatDistance from "date-fns/formatDistance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { getNameLetters } from "@/utils/data";

type ProjectCardProps = {
  id: string;
  name: string;
  updatedAt: string;
  developers: { id: string; name: string; image: string }[];
};

export default function ProjectCard({
  id,
  name,
  updatedAt,
  developers,
}: ProjectCardProps) {
  return (
    <div className="flex justify-between rounded-md bg-gray-800 py-3 px-4 w-64">
      <div className="">
        <div className="flex justify-between">
          <h3 className="text-hs text-white font-medium line-clamp-1">
            {name}
          </h3>
        </div>
        <p className="mb-1 mt-0.5 text-xs font-light text-white text-opacity-75">
          last updated{" "}
          {formatDistance(new Date(updatedAt), new Date(), { addSuffix: true })}
        </p>
        <p className="mb-2 text-xs font-light text-white text-opacity-75">
          {developers.length} developer{developers.length !== 1 && "s"}
        </p>
        <div className="flex gap-1">
          {developers.map((developer) => (
            <Avatar key={developer.id} title={developer?.name ?? "anonymous"}>
              <AvatarImage src={developer?.image ?? ""} />
              <AvatarFallback>
                {getNameLetters(developer?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
}
