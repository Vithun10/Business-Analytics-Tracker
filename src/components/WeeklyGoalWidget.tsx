import React from "react";
import { useWeeklyGoal } from "../hooks/useWeeklyGoal";

export const WeeklyGoalWidget: React.FC = () => {
  const goal = useWeeklyGoal();

  const statusColor =
    goal.status === "Completed"
      ? "text-green-400"
      : goal.status === "On Track"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="
      border
      border-slate-700
      rounded-xl
      p-6
      bg-slate-900
    ">
      <h2 className="text-xl font-bold mb-4">
        Weekly Goal
      </h2>

      <div className="space-y-2">

        <p>
          Target Hours:
          <span className="font-bold ml-2">
            {goal.goal}
          </span>
        </p>

        <p>
          Completed:
          <span className="font-bold ml-2">
            {goal.weeklyHours}
          </span>
        </p>

        <p>
          Remaining:
          <span className="font-bold ml-2">
            {goal.remaining}
          </span>
        </p>

        <p className={statusColor}>
          Status: {goal.status}
        </p>

      </div>

      <div className="
        mt-5
        h-3
        bg-slate-800
        rounded-full
        overflow-hidden
      ">
        <div
          className="
            h-full
            bg-indigo-500
            rounded-full
          "
          style={{
            width: `${goal.percentage}%`,
          }}
        />
      </div>

      <p className="text-sm text-slate-400 mt-2">
        {goal.percentage}% Complete
      </p>
    </div>
  );
};