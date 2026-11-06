"use client";

import { useState } from "react";
import { getSupabase, type Task } from "@/lib/supabase";
import type { Project } from "@/components/ProjectCard";

type AiSummaryProps = {
  tasks: Task[];
  projects: Project[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
};

export default function AiSummary({
  tasks,
  projects,
  totalTasks,
  completedTasks,
  overdueTasks,
}: AiSummaryProps) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateSummary() {
    const supabase = getSupabase();
    if (!supabase || loading) {
      setError("Your workspace session is not ready. Refresh and try again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (sessionError || !accessToken) {
        throw new Error("Your session has expired. Sign in again to generate an AI summary.");
      }

      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          metrics: { totalTasks, completedTasks, overdueTasks },
          projects: projects.slice(0, 50).map((project) => ({
            name: project.name,
            description: project.description,
          })),
          tasks: tasks.slice(0, 100).map((task) => ({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.due_date,
            projectId: task.project_id,
          })),
        }),
      });

      const payload = (await response.json()) as { summary?: string; error?: string };
      if (!response.ok || !payload.summary) {
        throw new Error(payload.error || "The AI service could not create a summary. Please try again.");
      }
      setSummary(payload.summary);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong while generating the summary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel ai-summary" aria-labelledby="ai-summary-title">
      <div className="panel-head ai-summary-head">
        <div>
          <span className="eyebrow">WORKSPACE INTELLIGENCE</span>
          <h2 id="ai-summary-title">AI project insights</h2>
          <p>Turn your current tasks and project progress into a practical next-step summary.</p>
        </div>
        <button className="btn primary" type="button" onClick={generateSummary} disabled={loading}>
          {loading ? <><span className="button-spinner" aria-hidden="true" /> Analyzing…</> : summary ? "Refresh summary" : "Generate summary"}
        </button>
      </div>
      {loading ? (
        <div className="ai-loading" role="status" aria-live="polite">
          <span className="spinner" />
          <span>Reviewing {totalTasks} tasks across {projects.length} projects…</span>
        </div>
      ) : summary ? (
        <div className="ai-result" aria-live="polite">{summary}</div>
      ) : (
        <div className="ai-empty">
          <span aria-hidden="true">✦</span>
          <p>Get a concise view of progress, overdue work, and suggested priorities based on your live dashboard.</p>
        </div>
      )}
      {error && (
        <div className="ai-fallback" role="alert">
          <strong>AI summary unavailable</strong>
          <p>{error}</p>
          <span>Your projects and tasks are safe. You can continue using the dashboard and retry when the service is available.</span>
        </div>
      )}
    </section>
  );
}
