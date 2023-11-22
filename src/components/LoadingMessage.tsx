import { ArrowPathIcon } from "@heroicons/react/24/outline";

const LoadingMessage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex">
      <div className="flex-row mx-5 flex-1">
        <div className="flex flex-wrap gap-4 ml">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
