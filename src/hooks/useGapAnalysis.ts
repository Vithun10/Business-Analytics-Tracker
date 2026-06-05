import { useMemo } from "react";
import { useSkills } from "./useSkills";
import { generateGapAnalysis } from "../lib/gapAnalysis";

export const useGapAnalysis = () => {

  const skillsHook = useSkills();

  const result = useMemo(() => {

    return generateGapAnalysis(
      skillsHook.progressList
    );

  }, [skillsHook.progressList]);

  return result;
};