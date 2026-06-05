export interface SkillCategory {
  name: string;
  icon: string;
  topics: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "SQL",
    icon: "Database",
    topics: [
      "SELECT",
      "JOIN",
      "GROUP BY",
      "HAVING",
      "Subqueries",
      "Window Functions"
    ]
  },

  {
    name: "Excel",
    icon: "FileSpreadsheet",
    topics: [
      "Pivot Tables",
      "Power Query",
      "Lookup Functions",
      "Dashboards",
      "Data Cleaning"
    ]
  },

  {
    name: "Power BI",
    icon: "BarChart3",
    topics: [
      "Data Modeling",
      "DAX",
      "Dashboard Building",
      "KPI Reporting"
    ]
  },

  {
    name: "SDLC",
    icon: "GitBranch",
    topics: [
      "Software Development Life Cycle",
      "Waterfall",
      "Agile",
      "Scrum",
      "User Stories",
      "Backlog Management"
    ]
  },

  {
    name: "Database Concepts",
    icon: "Server",
    topics: [
      "Relational Databases",
      "ER Diagrams",
      "Normalization",
      "Database Design Basics",
      "MySQL"
    ]
  },

  {
    name: "Jira",
    icon: "Trello",
    topics: [
      "Creating Stories",
      "Managing Backlogs",
      "Sprint Boards",
      "Reporting"
    ]
  },

  {
    name: "Confluence",
    icon: "BookOpen",
    topics: [
      "Documentation",
      "Knowledge Management",
      "Meeting Notes"
    ]
  },

  {
    name: "Banking & FinTech",
    icon: "Coins",
    topics: [
      "KYC",
      "AML",
      "Payment Gateways",
      "Fraud Detection",
      "Credit Scoring"
    ]
  },

  {
    name: "Soft Skills",
    icon: "MessageSquareCode",
    topics: [
      "Communication",
      "Root Cause Analysis",
      "5 Why Method",
      "Stakeholder Management",
      "Managing Client Expectations"
    ]
  }
];

export const ALL_TOPICS_COUNT = SKILL_CATEGORIES.reduce(
  (sum, category) => sum + category.topics.length,
  0
);