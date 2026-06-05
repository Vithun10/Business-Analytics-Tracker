import { useMemo } from "react";
import { useSkills } from "./useSkills";
import { calculateReadiness } from "../lib/readinessEngine";

export const useReadiness = () => {

  const skillsHook = useSkills();

  const readiness = useMemo(() => {

    return calculateReadiness(
      skillsHook.categoryCompletion
    );

  }, [
    skillsHook.categoryCompletion
  ]);

  return readiness;
};
