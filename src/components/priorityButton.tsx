import type { Dispatch, SetStateAction } from "react";

export type selectedPriorityType = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export default function PriorityButton({
  value,
  color,
  isSelected,
  handleClick,
  count,
}: {
  count: number;
  value: selectedPriorityType;
  color: string;
  isSelected: boolean;
  handleClick: (priority: selectedPriorityType, selected: boolean) => void;
}) {
  const handlePriorityClick = () => {
    handleClick(value, isSelected);
  };

  return (
    <li
      className={`flex justify-between transition duration-300 hover:opacity-50 ${
        isSelected ? "" : "opacity-20"
      }`}
    >
      <div className="flex items-center">
        <div className={`${color} mr-4 h-2 w-2 rounded-full`}></div>
        <button onClick={handlePriorityClick} className="text-hxs capitalize">
          {value.toLowerCase()}
        </button>
      </div>
      <div className="text-hxs">{count}</div>
    </li>
  );
}
