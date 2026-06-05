export interface ReadinessResult {
  overall: number;
  india: number;
  oman: number;
  swiss: number;
  fintech: number;
}

export function calculateReadiness(
  categoryCompletion: Record<string, number>
): ReadinessResult {

  const get = (name: string) =>
    categoryCompletion[name] || 0;

  // Overall Readiness
  const overall = Math.round(
    (
      get("SQL") +
      get("Excel") +
      get("Power BI") +
      get("SDLC") +
      get("Database Concepts") +
      get("Jira") +
      get("Confluence") +
      get("Banking & FinTech") +
      get("Soft Skills")
    ) / 9
  );

  // India BA
  const india = Math.round(
    get("SQL") * 0.30 +
    get("Excel") * 0.25 +
    get("Power BI") * 0.20 +
    get("Soft Skills") * 0.15 +
    get("SDLC") * 0.10
  );

  // Oman BA
  const oman = Math.round(
    get("SQL") * 0.30 +
    get("Power BI") * 0.25 +
    get("Soft Skills") * 0.20 +
    get("Jira") * 0.10 +
    get("Banking & FinTech") * 0.15
  );

  // Switzerland BA
  const swiss = Math.round(
    get("SQL") * 0.20 +
    get("Power BI") * 0.20 +
    get("Jira") * 0.20 +
    get("Confluence") * 0.15 +
    get("Banking & FinTech") * 0.25
  );

  // FinTech Analyst
  const fintech = Math.round(
    get("SQL") * 0.25 +
    get("Banking & FinTech") * 0.35 +
    get("Power BI") * 0.20 +
    get("Jira") * 0.10 +
    get("Soft Skills") * 0.10
  );

  return {
    overall,
    india,
    oman,
    swiss,
    fintech
  };
}
