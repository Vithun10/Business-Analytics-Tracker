import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useStudySessions } from "./useStudySessions";

export const useWeeklyGoal = () => {
  const { profile } = useAuth();
  const studyHook = useStudySessions();

  const weeklyData = useMemo(() => {
    const goal =
      profile?.weekly_hours_goal || 10;

    const now = new Date();

    const startOfWeek = new Date(now);

    startOfWeek.setDate(
      now.getDate() - now.getDay()
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyHours =
      studyHook.sessions
        .filter((session) => {
          const date =
            new Date(session.date);

          return date >= startOfWeek;
        })
        .reduce(
          (sum, session) =>
            sum + Number(session.hours),
          0
        );

    const remaining =
      Math.max(goal - weeklyHours, 0);

    const percentage =
      Math.min(
        Math.round(
          (weeklyHours / goal) * 100
        ),
        100
      );

    let status = "Behind";

    if (percentage >= 100) {
      status = "Completed";
    } else if (percentage >= 70) {
      status = "On Track";
    }

    return {
      goal,
      weeklyHours,
      remaining,
      percentage,
      status,
    };
  }, [
    profile,
    studyHook.sessions,
  ]);

  return weeklyData;
};