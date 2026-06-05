import React from "react";
import { useReadiness } from "../hooks/useReadiness";
import { useGapAnalysis } from "../hooks/useGapAnalysis";

export const CareerReadiness: React.FC = () => {
  const readiness = useReadiness();
  const gaps = useGapAnalysis();

  const cards = [
    {
      title: "Overall Readiness",
      value: readiness.overall,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "India BA",
      value: readiness.india,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Oman BA",
      value: readiness.oman,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Swiss BA",
      value: readiness.swiss,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      title: "FinTech BA",
      value: readiness.fintech,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Career Readiness
        </h1>

        <p className="text-slate-400 mt-2">
          Track your readiness for Business Analyst roles
          in India, Oman and Switzerland.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border p-5 ${card.bg} ${card.border}`}
          >
            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <h2
              className={`text-4xl font-bold mt-2 ${card.color}`}
            >
              {card.value}%
            </h2>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-green-500/20 p-5 bg-green-500/5">
          <p className="text-slate-400">
            Completed
          </p>

          <p className="text-3xl font-bold text-green-400">
            {gaps.completed.length}
          </p>
        </div>

        <div className="rounded-xl border border-yellow-500/20 p-5 bg-yellow-500/5">
          <p className="text-slate-400">
            In Progress
          </p>

          <p className="text-3xl font-bold text-yellow-400">
            {gaps.inProgress.length}
          </p>
        </div>

        <div className="rounded-xl border border-red-500/20 p-5 bg-red-500/5">
          <p className="text-slate-400">
            Missing
          </p>

          <p className="text-3xl font-bold text-red-400">
            {gaps.missing.length}
          </p>
        </div>
      </div>

      {/* Readiness Breakdown */}
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-900">
        <h2 className="text-xl font-bold mb-6">
          Readiness Breakdown
        </h2>

        {cards.map((card) => (
          <div key={card.title} className="mb-5">
            <div className="flex justify-between text-sm mb-1">
              <span>{card.title}</span>
              <span>{card.value}%</span>
            </div>

            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{
                  width: `${card.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critical Skills */}
      <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
        <h2 className="text-xl font-bold mb-4 text-red-400">
          🔴 Critical Skills Missing
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          {gaps.critical.length > 0 ? (
            gaps.critical.map((skill) => (
              <div
                key={skill}
                className="px-3 py-2 rounded-lg bg-red-500/10"
              >
                {skill}
              </div>
            ))
          ) : (
            <p className="text-slate-400">
              No critical gaps found 🎉
            </p>
          )}
        </div>
      </div>

      {/* Important Skills */}
      <div className="border border-yellow-500/30 rounded-xl p-6 bg-yellow-500/5">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">
          🟡 Important Skills Missing
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          {gaps.important.length > 0 ? (
            gaps.important.map((skill) => (
              <div
                key={skill}
                className="px-3 py-2 rounded-lg bg-yellow-500/10"
              >
                {skill}
              </div>
            ))
          ) : (
            <p className="text-slate-400">
              No important gaps found 🎉
            </p>
          )}
        </div>
      </div>

      {/* Optional Skills */}
      <div className="border border-green-500/30 rounded-xl p-6 bg-green-500/5">
        <h2 className="text-xl font-bold mb-4 text-green-400">
          🟢 Nice To Have Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          {gaps.optional.length > 0 ? (
            gaps.optional.map((skill) => (
              <div
                key={skill}
                className="px-3 py-2 rounded-lg bg-green-500/10"
              >
                {skill}
              </div>
            ))
          ) : (
            <p className="text-slate-400">
              No optional gaps found 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
