import { SKILL_CATEGORIES } from "../utils/skillData";

export interface GapResult {
  completed: string[];
  inProgress: string[];
  missing: string[];

  critical: string[];
  important: string[];
  optional: string[];
}

const CRITICAL_SKILLS = [
  "SELECT",
  "JOIN",
  "GROUP BY",
  "HAVING",
  "Subqueries",
  "Window Functions",

  "Pivot Tables",
  "Lookup Functions",

  "Data Modeling",
  "DAX",

  "Agile",
  "Scrum",

  "ER Diagrams",

  "Communication",
  "Stakeholder Management",
  "Root Cause Analysis"
];

const IMPORTANT_SKILLS = [
  "Power Query",
  "Dashboard Building",
  "KPI Reporting",

  "Creating Stories",
  "Managing Backlogs",
  "Sprint Boards",
  "Reporting",

  "KYC",
  "AML",
  "Payment Gateways"
];

export function generateGapAnalysis(
  progressList: any[]
): GapResult {

  const completed: string[] = [];
  const inProgress: string[] = [];
  const missing: string[] = [];

  const critical: string[] = [];
  const important: string[] = [];
  const optional: string[] = [];

  SKILL_CATEGORIES.forEach((category) => {

    category.topics.forEach((topic) => {

      const progress = progressList.find(
        (item) =>
          item.category === category.name &&
          item.topic === topic
      );

      const status =
        progress?.status || "Not Started";

      if (status === "Completed") {
        completed.push(topic);
        return;
      }

      if (status === "In Progress") {
        inProgress.push(topic);
        return;
      }

      missing.push(topic);

      if (CRITICAL_SKILLS.includes(topic)) {
        critical.push(topic);
      }
      else if (
        IMPORTANT_SKILLS.includes(topic)
      ) {
        important.push(topic);
      }
      else {
        optional.push(topic);
      }

    });

  });

  return {
    completed,
    inProgress,
    missing,
    critical,
    important,
    optional
  };
}
